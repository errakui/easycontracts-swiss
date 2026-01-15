"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8">
            Termini di Servizio
          </h1>
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 text-gray-300">
            <p className="text-gray-400 text-sm">Ultimo aggiornamento: Gennaio 2026</p>
            
            <h2 className="text-xl font-bold text-white">1. Accettazione</h2>
            <p>Utilizzando easycontracts, accetti questi termini di servizio. Se non accetti, non utilizzare il servizio.</p>
            
            <h2 className="text-xl font-bold text-white">2. Descrizione del Servizio</h2>
            <p>easycontracts è una piattaforma che utilizza l&apos;intelligenza artificiale per generare bozze di contratti legali basati su template verificati.</p>
            
            <h2 className="text-xl font-bold text-white">3. Disclaimer Legale</h2>
            <p>I contratti generati sono bozze e non costituiscono consulenza legale. Per situazioni complesse, consigliamo di consultare un avvocato. Non siamo responsabili per danni derivanti dall&apos;uso dei contratti generati.</p>
            
            <h2 className="text-xl font-bold text-white">4. Account</h2>
            <p>Sei responsabile della sicurezza del tuo account e delle attività svolte con esso.</p>
            
            <h2 className="text-xl font-bold text-white">5. Pagamenti</h2>
            <p>I piani a pagamento si rinnovano automaticamente. Puoi cancellare in qualsiasi momento dalle impostazioni.</p>
            
            <h2 className="text-xl font-bold text-white">6. Proprietà Intellettuale</h2>
            <p>I contratti generati sono di tua proprietà. La piattaforma e i template restano di nostra proprietà.</p>
            
            <h2 className="text-xl font-bold text-white">7. Modifiche</h2>
            <p>Possiamo modificare questi termini in qualsiasi momento. Le modifiche saranno comunicate via email.</p>
            
            <h2 className="text-xl font-bold text-white">8. Limitazione Responsabilità</h2>
            <p>easycontracts utilizza intelligenza artificiale per generare contratti. Non forniamo consulenza legale e non garantiamo che i contratti siano adatti a ogni situazione specifica. L&apos;utente è responsabile della verifica e dell&apos;eventuale revisione da parte di un professionista.</p>
            
            <h2 className="text-xl font-bold text-white">9. Rimborsi</h2>
            <p>Data la natura digitale del servizio, non sono previsti rimborsi dopo l&apos;attivazione dell&apos;abbonamento. Puoi cancellare il rinnovo automatico in qualsiasi momento.</p>
            
            <h2 className="text-xl font-bold text-white">10. Contatti</h2>
            <p>Per domande: support@easycontracts.tech</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
