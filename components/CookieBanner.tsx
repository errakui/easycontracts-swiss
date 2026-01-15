"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🍪</span>
              <h3 className="text-lg font-bold text-white">Cookie</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Usiamo i cookie per migliorare la tua esperienza.{" "}
              <Link href="/cookie-policy" className="text-violet-400 hover:underline">Scopri di più</Link>
            </p>
            <div className="flex gap-3">
              <button onClick={acceptCookies} className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-500 transition-all text-sm">
                Accetta
              </button>
              <button onClick={declineCookies} className="px-5 py-2.5 border border-white/20 text-gray-300 font-semibold rounded-xl hover:bg-white/5 transition-all text-sm">
                Rifiuta
              </button>
            </div>
          </div>
          <button onClick={declineCookies} className="text-gray-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
