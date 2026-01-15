"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Contattaci
            </h1>
            <p className="text-xl text-gray-400">
              Hai domande? Siamo qui per aiutarti.
            </p>
          </div>

          {submitted ? (
            <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Messaggio Inviato!</h2>
              <p className="text-gray-400">Ti risponderemo entro 24 ore.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome</label>
                <input type="text" required className="input-dark" placeholder="Mario Rossi" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input type="email" required className="input-dark" placeholder="mario@email.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Messaggio</label>
                <textarea required rows={5} className="input-dark" placeholder="Come possiamo aiutarti?" />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {loading ? "Invio..." : "Invia Messaggio"}
              </button>
            </form>
          )}

          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Oppure scrivici direttamente</p>
            <a href="mailto:info@easycontracts.ai" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300">
              <Mail className="w-5 h-5" /> info@easycontracts.ai
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
