"use client";

import { CheckCircle, X, Mail, CreditCard } from "lucide-react";
import { useState } from "react";

interface PricingCardProps {
  plan: "free" | "pro" | "business";
  name: string;
  price: number;
  period?: string;
  features: string[];
  popular?: boolean;
  priceId?: string;
}

export default function PricingCard({
  plan,
  name,
  price,
  period = "/mese",
  features,
  popular,
  priceId,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (plan === "free") {
      window.location.href = "/generate";
      return;
    }

    if (!priceId) {
      alert("Stripe nicht konfiguriert");
      return;
    }

    // Mostra modal per email
    setShowModal(true);
  };

  const processPayment = async () => {
    if (!email || !email.includes("@")) {
      setError("Bitte geben Sie eine gültige E-Mail ein");
      return;
    }

    setError("");
    setLoading(true);
    localStorage.setItem("checkout_email", email);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Checkout-Fehler");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Fehler. Bitte erneut versuchen.");
      localStorage.removeItem("checkout_email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`relative p-8 rounded-3xl ${
        popular 
          ? "bg-gradient-to-b from-red-600/20 to-red-600/5 border-2 border-red-500/50 scale-105" 
          : "bg-white/5 border border-white/10"
      }`}>
        {popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-500 rounded-full text-sm font-bold text-white">
            Am Beliebtesten
          </div>
        )}

        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-5xl font-black text-white">CHF {price}</span>
          <span className="text-gray-500">{period}</span>
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${popular ? "text-red-400" : "text-gray-500"}`} />
              <span className={popular ? "text-white" : "text-gray-400"}>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-semibold transition-all ${
            popular 
              ? "bg-red-500 text-white hover:bg-red-400" 
              : "border border-white/20 text-white hover:bg-white/5"
          } ${loading ? "opacity-50 cursor-wait" : ""}`}
        >
          {loading ? "Laden..." : plan === "free" ? "Gratis starten" : `${name} wählen`}
        </button>
      </div>

      {/* Modal Pagamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-bold text-white">Zahlen & Starten 🇨🇭</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 font-semibold">{name}</p>
              <p className="text-3xl font-black text-white">CHF {price}<span className="text-lg text-gray-500">/Monat</span></p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Ihre E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.ch"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && processPayment()}
                />
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <button
              onClick={processPayment}
              disabled={loading}
              className="w-full py-4 bg-red-500 text-white font-semibold rounded-2xl hover:bg-red-400 transition-all disabled:opacity-50"
            >
              {loading ? "Weiterleitung..." : "Zur Zahlung →"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Nach der Zahlung wird Ihr Konto automatisch aktiviert
            </p>
          </div>
        </div>
      )}
    </>
  );
}
