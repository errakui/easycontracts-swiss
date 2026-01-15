// Utility per checkout Stripe diretto

export async function startCheckout(plan: "pro" | "business", email?: string): Promise<void> {
  // Chiedi email se non fornita
  const checkoutEmail = email || prompt("Inserisci la tua email per procedere al pagamento:");
  
  if (!checkoutEmail || !checkoutEmail.includes("@")) {
    alert("Email non valida!");
    return;
  }

  // Determina il price ID
  const priceId = plan === "business" 
    ? process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS 
    : process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO;

  if (!priceId) {
    alert("Stripe non configurato. Controlla le variabili d'ambiente.");
    return;
  }

  // Salva email per dopo
  localStorage.setItem("checkout_email", checkoutEmail);

  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, email: checkoutEmail }),
    });

    const data = await response.json();
    
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || "Errore nel checkout");
    }
  } catch (error: any) {
    console.error("Errore checkout:", error);
    alert(error.message || "Errore nel checkout. Riprova.");
    localStorage.removeItem("checkout_email");
  }
}

// Componente bottone checkout riutilizzabile
export function getCheckoutHandler(plan: "pro" | "business", email?: string) {
  return () => startCheckout(plan, email);
}

