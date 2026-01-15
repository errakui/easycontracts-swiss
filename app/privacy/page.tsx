"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert prose-gray max-w-none">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 text-gray-300">
              <p className="text-gray-400 text-sm">Ultimo aggiornamento: Gennaio 2026</p>
              
              <h2 className="text-xl font-bold text-white">1. Raccolta Dati</h2>
              <p>Raccogliamo solo i dati necessari per fornire il servizio: email, nome e dati dei contratti generati.</p>
              
              <h2 className="text-xl font-bold text-white">2. Utilizzo dei Dati</h2>
              <p>I tuoi dati vengono utilizzati esclusivamente per generare contratti e gestire il tuo account. Non vendiamo mai i tuoi dati a terzi.</p>
              
              <h2 className="text-xl font-bold text-white">3. Sicurezza</h2>
              <p>Utilizziamo crittografia SSL e standard bancari per proteggere i tuoi dati. I contratti sono memorizzati in modo sicuro.</p>
              
              <h2 className="text-xl font-bold text-white">4. GDPR</h2>
              <p>Siamo pienamente conformi al GDPR. Puoi richiedere la cancellazione dei tuoi dati in qualsiasi momento.</p>
              
              <h2 className="text-xl font-bold text-white">5. Cookie</h2>
              <p>Utilizziamo cookie tecnici necessari al funzionamento del servizio. Vedi la nostra Cookie Policy per maggiori dettagli.</p>
              
              <h2 className="text-xl font-bold text-white">6. Diritti dell&apos;Utente</h2>
              <p>Hai diritto di accedere, rettificare e cancellare i tuoi dati. Puoi esercitare questi diritti contattandoci o dalla dashboard del tuo account.</p>
              
              <h2 className="text-xl font-bold text-white">7. Conservazione Dati</h2>
              <p>I dati vengono conservati per la durata dell&apos;account più 5 anni per adempimenti fiscali. I contratti possono essere cancellati su richiesta.</p>
              
              <h2 className="text-xl font-bold text-white">8. Contatti</h2>
              <p>Per qualsiasi domanda sulla privacy: support@easycontracts.tech</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
