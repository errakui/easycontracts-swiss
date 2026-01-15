"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8">
            Disclaimer
          </h1>
          
          <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Importante</h2>
                <p className="text-gray-300">
                  I contratti generati da easycontracts sono bozze e non costituiscono consulenza legale professionale.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 text-gray-300">
            <h2 className="text-xl font-bold text-white">Natura del Servizio</h2>
            <p>easycontracts utilizza l&apos;intelligenza artificiale per generare bozze di contratti basate su template verificati da avvocati. Tuttavia, ogni situazione è unica e potrebbe richiedere clausole specifiche.</p>
            
            <h2 className="text-xl font-bold text-white">Limitazione di Responsabilità</h2>
            <p>Non siamo responsabili per danni diretti o indiretti derivanti dall&apos;uso dei contratti generati. L&apos;utente è responsabile della revisione e dell&apos;adeguamento dei contratti alle proprie esigenze.</p>
            
            <h2 className="text-xl font-bold text-white">Consiglio</h2>
            <p>Per contratti complessi, transazioni importanti o situazioni particolari, consigliamo sempre di consultare un avvocato professionista.</p>
            
            <h2 className="text-xl font-bold text-white">Validità Legale</h2>
            <p>I template sono conformi alla legge italiana, ma la validità di un contratto dipende anche dalla corretta compilazione e dalla situazione specifica.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
