import Stripe from "stripe";

// Verifica che la chiave Stripe sia configurata
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("⚠️ STRIPE_SECRET_KEY non configurata. Stripe non funzionerà.");
}

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey)
  : null as unknown as Stripe;

// IDs dei prodotti Stripe
export const STRIPE_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "1 contratto gratis",
      "Template base (4 contratti)",
      "Watermark",
    ],
    contractsLimit: 1,
  },
  PRO: {
    name: "Pro",
    price: 19,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    features: [
      "10 contratti/mese",
      "Tutti i template (50+)",
      "Export PDF professionale",
      "Supporto email",
    ],
    contractsLimit: 10,
  },
  BUSINESS: {
    name: "Business",
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS,
    features: [
      "Contratti illimitati",
      "Nessun watermark",
      "Team (5 membri)",
      "API access",
      "Supporto prioritario",
    ],
    contractsLimit: -1,
  },
};

export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string,
  customerEmail?: string
) {
  if (!stripe) {
    throw new Error("Stripe non è configurato. Controlla le variabili d'ambiente.");
  }

  if (!priceId) {
    throw new Error("Price ID mancante. Configura NEXT_PUBLIC_STRIPE_PRICE_PRO e NEXT_PUBLIC_STRIPE_PRICE_BUSINESS.");
  }

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/#prezzi`,
    allow_promotion_codes: true,
    locale: "it",
  };

  // Se c'è un customerId esistente, usalo
  if (customerId) {
    sessionConfig.customer = customerId;
  } else if (customerEmail) {
    sessionConfig.customer_email = customerEmail;
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionConfig);
    return session;
  } catch (error: any) {
    console.error("Errore creazione sessione Stripe:", error);
    throw new Error(`Errore Stripe: ${error.message}`);
  }
}

export async function createCustomerPortalSession(customerId: string) {
  if (!stripe) {
    throw new Error("Stripe non è configurato");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}

export async function getCustomerSubscriptions(customerId: string) {
  if (!stripe) {
    throw new Error("Stripe non è configurato");
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 10,
  });

  return subscriptions.data;
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error("Stripe non è configurato");
  }

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}
