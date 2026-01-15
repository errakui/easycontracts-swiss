"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Users, Shield, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Chi Siamo
            </h1>
            <p className="text-xl text-gray-400">
              Rendiamo i contratti legali accessibili a tutti.
            </p>
          </div>

          <div className="space-y-12">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">La Nostra Missione</h2>
              <p className="text-gray-400 leading-relaxed">
                Crediamo che ogni professionista meriti contratti legali di qualità senza dover spendere 
                centinaia di euro per ogni documento. easycontracts nasce per democratizzare l&apos;accesso 
                ai servizi legali, usando l&apos;intelligenza artificiale per generare contratti professionali 
                in pochi secondi.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <Users className="w-10 h-10 text-violet-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">10.000+ Utenti</h3>
                <p className="text-gray-400">Freelancer, PMI e startup si fidano di noi.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <Shield className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Validati da Avvocati</h3>
                <p className="text-gray-400">Ogni template è verificato da professionisti.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <Zap className="w-10 h-10 text-amber-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">50.000+ Contratti</h3>
                <p className="text-gray-400">Generati sulla nostra piattaforma.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <Heart className="w-10 h-10 text-rose-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Made in Italy</h3>
                <p className="text-gray-400">Conformi alla legge italiana 100%.</p>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/generate" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all"
              >
                Prova Gratis <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
