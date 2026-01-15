import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed:`, err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Gestisci gli eventi Stripe
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Pagamento completato:", session.id);

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const customerEmail = session.customer_details?.email;

        if (!customerEmail) {
          console.error("❌ Email cliente mancante");
          break;
        }

        // Recupera la subscription completa da Stripe
        const subscriptionData: any = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscriptionData.items?.data?.[0]?.price?.id;

        if (!priceId) {
          console.error("❌ Price ID non trovato nella subscription");
          break;
        }

        // Determina il piano
        let plan: "PRO" | "BUSINESS" = "PRO";
        let contractsLimit = 10;

        if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS) {
          plan = "BUSINESS";
          contractsLimit = -1; // Illimitati
        }

        // Crea o aggiorna l'utente nel database
        const user = await prisma.user.upsert({
          where: { email: customerEmail },
          update: {
            stripeCustomerId: customerId,
            plan: plan,
            contractsLimit: contractsLimit,
            contractsUsed: 0, // Reset al rinnovo
          },
          create: {
            email: customerEmail,
            name: session.customer_details?.name || customerEmail.split("@")[0],
            stripeCustomerId: customerId,
            plan: plan,
            contractsLimit: contractsLimit,
          },
        });

        // Salva la subscription
        const periodStart = new Date((subscriptionData.current_period_start || Date.now() / 1000) * 1000);
        const periodEnd = new Date((subscriptionData.current_period_end || (Date.now() / 1000 + 2592000)) * 1000);

        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subscriptionId },
          update: {
            status: "ACTIVE",
            plan: plan,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          },
          create: {
            userId: user.id,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeProductId: (subscriptionData.items?.data?.[0]?.price?.product as string) || '',
            plan: plan,
            status: "ACTIVE",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          },
        });

        console.log(`✅ Utente creato/aggiornato: ${user.email} - Piano: ${plan}`);

        // Crea un token di login magico per auto-login
        const loginToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
        
        // Salva il token temporaneo nel database (usalo per 5 minuti)
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            // Salviamo il token nell'immagine temporaneamente (hack veloce)
            image: `login_token:${loginToken}:${Date.now() + 300000}` 
          },
        });

        console.log(`✅ Token di login creato per ${user.email}`);

        break;
      }

      case "customer.subscription.updated": {
        const subscription: any = event.data.object;
        console.log("🔄 Abbonamento aggiornato:", subscription.id);

        const periodStart = new Date((subscription.current_period_start || Date.now() / 1000) * 1000);
        const periodEnd = new Date((subscription.current_period_end || (Date.now() / 1000 + 2592000)) * 1000);

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status === "active" ? "ACTIVE" : "CANCELED",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("❌ Abbonamento cancellato:", subscription.id);

        // Downgrade utente a FREE
        const sub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
          include: { user: true },
        });

        if (sub) {
          await prisma.user.update({
            where: { id: sub.userId },
            data: {
              plan: "FREE",
              contractsLimit: 1,
            },
          });

          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: { status: "CANCELED" },
          });

          console.log(`✅ Utente ${sub.user.email} downgraded a FREE`);
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💳 Pagamento fallito:", invoice.id);

        // TODO: Invia email di notifica
        // TODO: Sospendi temporaneamente l'account

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice: any = event.data.object;
        console.log("✅ Pagamento ricevuto:", invoice.id);

        // Reset usage mensile se è un rinnovo
        if (invoice.subscription) {
          const sub = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string },
            include: { user: true },
          });

          if (sub) {
            await prisma.user.update({
              where: { id: sub.userId },
              data: { contractsUsed: 0 },
            });

            console.log(`✅ Reset usage per ${sub.user.email}`);
          }
        }

        break;
      }

      default:
        console.log(`Evento non gestito: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Errore webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

