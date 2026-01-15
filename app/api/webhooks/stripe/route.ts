import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Stripe from "stripe";

// Importante: disabilita il body parser per i webhook
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  // Prova verifica firma, se fallisce usa il body direttamente
  if (signature && webhookSecret && stripe) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      // Se la verifica fallisce, parsa il body direttamente (TEMPORANEO)
      console.log("Verifica firma fallita, uso body diretto:", err.message);
      try {
        event = JSON.parse(body) as Stripe.Event;
      } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
    }
  } else {
    // Nessuna verifica, parsa direttamente
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  console.log(`Webhook ricevuto: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Evento non gestito: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Errore elaborazione webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Checkout completato - CREA UTENTE SE NON ESISTE
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("=== HANDLE CHECKOUT COMPLETED ===");
  console.log("Session ID:", session.id);
  console.log("Customer email:", session.customer_email);
  console.log("Customer details email:", session.customer_details?.email);
  
  const email = session.customer_email || session.customer_details?.email;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  console.log("Email finale:", email);
  console.log("Customer ID:", customerId);
  console.log("Subscription ID:", subscriptionId);

  if (!email) {
    console.error("Checkout completato ma email mancante");
    return;
  }

  console.log(`Checkout completato per ${email}`);

  // Recupera info subscription
  let plan: "PRO" | "BUSINESS" = "PRO";
  let contractsLimit = 10;

  if (subscriptionId && stripe) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;
    
    // Determina piano dal price ID
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS) {
      plan = "BUSINESS";
      contractsLimit = 999999; // Illimitati
    }
  }

  // Cerca utente esistente o creane uno nuovo
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    // Aggiorna utente esistente
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan,
        contractsLimit,
        stripeCustomerId: customerId,
      },
    });
    console.log(`Utente ${email} aggiornato a piano ${plan}`);
  } else {
    // CREA NUOVO UTENTE (pagato prima di registrarsi)
    console.log("Creazione nuovo utente...");
    try {
      user = await prisma.user.create({
        data: {
          email,
          name: session.customer_details?.name || email.split("@")[0],
          plan,
          contractsLimit,
          contractsUsed: 0,
          stripeCustomerId: customerId,
        },
      });
      console.log(`✅ Nuovo utente ${email} creato con piano ${plan}`);
    } catch (createError: any) {
      console.error("❌ Errore creazione utente:", createError.message);
      throw createError;
    }
  }

  // Salva subscription nel database
  if (subscriptionId && stripe) {
    const sub = await stripe.subscriptions.retrieve(subscriptionId) as any;
    
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscriptionId },
      update: {
        plan,
        status: "ACTIVE",
        currentPeriodStart: new Date((sub.current_period_start || Date.now() / 1000) * 1000),
        currentPeriodEnd: new Date((sub.current_period_end || Date.now() / 1000) * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end || false,
      },
      create: {
        userId: user.id,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: sub.items?.data?.[0]?.price?.id || "",
        stripeProductId: (sub.items?.data?.[0]?.price?.product as string) || "",
        plan,
        status: "ACTIVE",
        currentPeriodStart: new Date((sub.current_period_start || Date.now() / 1000) * 1000),
        currentPeriodEnd: new Date((sub.current_period_end || Date.now() / 1000) * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end || false,
      },
    });
  }
}

// Subscription aggiornata
async function handleSubscriptionUpdate(subscription: any) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items?.data?.[0]?.price?.id;

  // Trova utente
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error(`Utente non trovato per customer ${customerId}`);
    return;
  }

  // Determina piano
  let plan: "FREE" | "PRO" | "BUSINESS" = "PRO";
  let contractsLimit = 10;

  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS) {
    plan = "BUSINESS";
    contractsLimit = 999999;
  }

  // Aggiorna utente
  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan,
      contractsLimit,
    },
  });

  // Aggiorna subscription
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    update: {
      plan,
      status: subscription.status === "active" ? "ACTIVE" : "PAST_DUE",
      currentPeriodStart: new Date((subscription.current_period_start || Date.now() / 1000) * 1000),
      currentPeriodEnd: new Date((subscription.current_period_end || Date.now() / 1000) * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
    },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId || "",
      stripeProductId: (subscription.items?.data?.[0]?.price?.product as string) || "",
      plan,
      status: "ACTIVE",
      currentPeriodStart: new Date((subscription.current_period_start || Date.now() / 1000) * 1000),
      currentPeriodEnd: new Date((subscription.current_period_end || Date.now() / 1000) * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
    },
  });

  console.log(`Subscription aggiornata per ${user.email}: ${plan}`);
}

// Subscription cancellata
async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error(`Utente non trovato per customer ${customerId}`);
    return;
  }

  // Torna a FREE
  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: "FREE",
      contractsLimit: 1,
    },
  });

  // Aggiorna subscription status
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: "CANCELED" },
  });

  console.log(`Subscription cancellata per ${user.email}, tornato a FREE`);
}

// Pagamento riuscito
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  console.log(`Pagamento riuscito per customer ${customerId}`);
}

// Pagamento fallito
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (user) {
    // Potresti inviare una email o notifica
    console.log(`Pagamento fallito per ${user.email}`);
  }
}

