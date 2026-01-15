"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8">
            Cookie Policy
          </h1>
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 text-gray-300">
            <p className="text-gray-400 text-sm">Ultimo aggiornamento: Gennaio 2026</p>
            
            <h2 className="text-xl font-bold text-white">Cosa sono i Cookie</h2>
            <p>I cookie sono piccoli file di testo memorizzati sul tuo dispositivo quando visiti un sito web.</p>
            
            <h2 className="text-xl font-bold text-white">Cookie che Utilizziamo</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Cookie Tecnici:</strong> Necessari per il funzionamento del sito</li>
              <li><strong>Cookie di Sessione:</strong> Per mantenere il login attivo</li>
              <li><strong>Cookie Analytics:</strong> Per capire come viene usato il sito (anonimizzati)</li>
            </ul>
            
            <h2 className="text-xl font-bold text-white">Gestione Cookie</h2>
            <p>Puoi gestire le preferenze sui cookie dal tuo browser. Disabilitare i cookie tecnici potrebbe compromettere il funzionamento del servizio.</p>
            
            <h2 className="text-xl font-bold text-white">Contatti</h2>
            <p>Per domande: privacy@easycontracts.ai</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
