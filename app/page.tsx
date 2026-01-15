"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PricingCard from "@/components/PricingCard";
import {
  Sparkles,
  Zap,
  Shield,
  Euro,
  CheckCircle,
  ArrowRight,
  FileText,
  Star,
  ChevronDown,
  Play,
  ArrowUpRight,
  Clock,
  Users,
  Building2,
  Briefcase,
  Home,
  Lock,
  Code,
  Handshake,
  Scale,
  Database,
  Bot,
  Download,
  Cpu,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0505] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section 
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center justify-center px-4 overflow-hidden"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)`,
        }}
      >
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}></div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-red-600/30 to-rose-600/30 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-10 animate-fade-in">
            <span className="text-2xl">🇨🇭</span>
            <span className="text-sm text-gray-300">Powered by AI • Database di 500+ template svizzeri</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tight mb-8">
            <span className="block text-white">Contratti Legali</span>
            <span className="block bg-gradient-to-r from-red-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">
              in 30 Secondi
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Compila un form, l&apos;AI genera il contratto conforme alla legge svizzera, scarichi il PDF.
            <br />
            <span className="text-white font-semibold">CHF 29/mese</span> invece di <span className="line-through decoration-red-500">CHF 1&apos;500</span> per ogni contratto.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/generate" 
              className="group relative px-8 py-5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Genera Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <a 
              href="#come-funziona" 
              className="flex items-center gap-3 px-8 py-5 rounded-2xl font-semibold text-gray-300 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
            >
              <Play className="w-5 h-5" />
              Come Funziona
            </a>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Nessuna carta richiesta</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-red-500" />
              <span>500+ template svizzeri</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Pronto in 30 secondi</span>
            </div>
          </div>
        </div>

        {/* Scroll */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section id="come-funziona" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Come Funziona
            </h2>
            <p className="text-xl text-gray-400">
              3 step. Nessuna complicazione.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: <FileText className="w-10 h-10" />, 
                title: "Compila il Form", 
                desc: "Inserisci i dati delle parti, l'oggetto del contratto e scegli le clausole che ti servono.",
                color: "red" 
              },
              {
                step: "2",
                icon: <Cpu className="w-10 h-10" />, 
                title: "L'AI Genera", 
                desc: "La nostra AI, istruita con leggi svizzere aggiornate (CO, CC) e 500+ template, genera il tuo contratto.",
                color: "orange" 
              },
              {
                step: "3",
                icon: <Download className="w-10 h-10" />, 
                title: "Scarica il PDF", 
                desc: "Contratto pronto da stampare, firmare e usare. In 30 secondi invece di 3 giorni.",
                color: "emerald" 
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className={`p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-${item.color}-500/50 transition-all`}>
                  <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-${item.color}-500 flex items-center justify-center font-black text-xl`}>
                    {item.step}
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-${item.color}-500/20 flex items-center justify-center mb-6 text-${item.color}-400`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link 
              href="/generate" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all"
            >
              Prova Ora Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* LA NOSTRA AI */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
                <Bot className="w-4 h-4" />
                Intelligenza Artificiale
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                AI Istruita per i<br />
                <span className="text-red-400">Contratti Svizzeri</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                La nostra AI non è un chatbot generico. È stata addestrata specificamente su:
              </p>
              <ul className="space-y-4">
                {[
                  "500+ template di contratti reali svizzeri",
                  "Codice delle Obbligazioni (CO) aggiornato",
                  "Codice Civile Svizzero (CC)",
                  "Normative cantonali e federali 2026",
                  "Linguaggio legale tedesco, francese, italiano",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <pre className="text-sm text-gray-400 font-mono">
{`// Input utente
{
  tipo: "Arbeitsvertrag",
  arbeitgeber: "Swiss AG",
  arbeitnehmer: "Max Müller",
  lohn: "CHF 8'500",
  kanton: "Zürich"
}

// AI genera → PDF pronto ✓`}
                </pre>
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl bg-red-500/20 border border-red-500/30">
                <span className="text-4xl">🇨🇭</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO - FEATURES */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Perché Usare easycontracts?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {/* Database Card */}
            <div className="md:col-span-2 md:row-span-2 relative group rounded-3xl bg-gradient-to-br from-red-600/20 to-rose-600/20 border border-white/10 p-8 overflow-hidden hover:border-red-500/50 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-[80px]"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
                  <Database className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4">500+ Template Svizzeri</h3>
                <p className="text-gray-400 text-lg mb-auto">
                  Template conformi al diritto svizzero. Contratti in DE, FR, IT.
                  Clausole specifiche per ogni cantone.
                </p>
                <div className="flex gap-2 mt-6">
                  {['🏦', '🏠', '🔒', '🤝', '💼'].map((emoji, i) => (
                    <span key={i} className="text-2xl">{emoji}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Speed */}
            <div className="relative group rounded-3xl bg-gradient-to-br from-orange-600/20 to-amber-600/20 border border-white/10 p-6 overflow-hidden hover:border-orange-500/50 transition-all">
              <Zap className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">30 Secondi</h3>
              <p className="text-gray-400 text-sm">Compili → AI genera → Scarichi. Fine.</p>
            </div>

            {/* Multilingual */}
            <div className="relative group rounded-3xl bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-white/10 p-6 overflow-hidden hover:border-emerald-500/50 transition-all">
              <span className="text-3xl mb-4 block">🇨🇭</span>
              <h3 className="text-xl font-bold mb-2">Multilingue</h3>
              <p className="text-gray-400 text-sm">DE • FR • IT • EN</p>
            </div>

            {/* Stats */}
            <div className="md:col-span-2 relative group rounded-3xl bg-white/5 border border-white/10 p-4 md:p-6 overflow-hidden">
              <div className="grid grid-cols-4 gap-2 md:gap-4 h-full items-center">
                <div className="text-center">
                  <p className="text-lg md:text-3xl font-black text-red-400">
                    <span className="hidden md:inline">800+</span>
                    <span className="md:hidden">+800</span>
                  </p>
                  <p className="text-gray-500 text-[10px] md:text-xs">Clienti</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <p className="text-lg md:text-3xl font-black text-orange-400">
                    <span className="hidden md:inline">5&apos;200+</span>
                    <span className="md:hidden">+5.2k</span>
                  </p>
                  <p className="text-gray-500 text-[10px] md:text-xs">Contratti</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <p className="text-lg md:text-3xl font-black text-emerald-400">500+</p>
                  <p className="text-gray-500 text-[10px] md:text-xs">Template</p>
                </div>
                <div className="text-center border-l border-white/10">
                  <p className="text-lg md:text-3xl font-black text-amber-400">26</p>
                  <p className="text-gray-500 text-[10px] md:text-xs">Cantoni</p>
                </div>
              </div>
            </div>

            {/* Updated */}
            <div className="relative group rounded-3xl bg-gradient-to-br from-rose-600/20 to-pink-600/20 border border-white/10 p-6 overflow-hidden hover:border-rose-500/50 transition-all">
              <RefreshCw className="w-10 h-10 text-rose-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">2026</h3>
              <p className="text-gray-400 text-sm">CO & CC aggiornati</p>
            </div>

            {/* PDF */}
            <div className="relative group rounded-3xl bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-white/10 p-6 overflow-hidden hover:border-amber-500/50 transition-all">
              <Download className="w-10 h-10 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">PDF Pronto</h3>
              <p className="text-gray-400 text-sm">Scarica, stampa, firma.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIE */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                I Nostri Template
              </h2>
              <p className="text-gray-400 text-xl max-w-xl">
                500+ contratti per ogni esigenza. Arbeitsvertrag, Mietvertrag, NDA e altro.
              </p>
            </div>
            <Link 
              href="/generate" 
              className="mt-6 lg:mt-0 inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold"
            >
              Vedi Tutti
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Briefcase className="w-8 h-8" />, name: "Arbeitsvertrag", count: 15, color: "red" },
              { icon: <Home className="w-8 h-8" />, name: "Mietvertrag", count: 12, color: "orange" },
              { icon: <Building2 className="w-8 h-8" />, name: "Handelsrecht", count: 18, color: "amber" },
              { icon: <Lock className="w-8 h-8" />, name: "NDA", count: 8, color: "rose" },
              { icon: <Users className="w-8 h-8" />, name: "Gesellschaft", count: 10, color: "emerald" },
              { icon: <Handshake className="w-8 h-8" />, name: "Kaufvertrag", count: 14, color: "cyan" },
              { icon: <Code className="w-8 h-8" />, name: "IT & Tech", count: 9, color: "blue" },
              { icon: <FileText className="w-8 h-8" />, name: "Andere", count: 15, color: "gray" },
            ].map((cat, index) => (
              <Link 
                key={index}
                href={`/generate?category=${cat.name.toLowerCase()}`}
                className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${cat.color}-500/20 flex items-center justify-center mb-4 text-${cat.color}-400 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.count} template</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="prezzi" className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-red-950/20"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Prezzi Semplici
            </h2>
            <p className="text-gray-400 text-xl">
              Niente sorprese. Cancella quando vuoi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              plan="free"
              name="Gratis"
              price={0}
              period="/sempre"
              features={["1 contratto gratis", "3 template base", "Watermark"]}
            />
            <PricingCard
              plan="pro"
              name="Pro"
              price={29}
              period="/mese"
              features={["10 contratti/mese", "Tutti i 500+ template", "Nessun watermark", "PDF professionale", "Supporto email"]}
              popular={true}
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO}
            />
            <PricingCard
              plan="business"
              name="Business"
              price={79}
              period="/mese"
              features={["Contratti illimitati", "Tutti i 500+ template", "Nessun watermark", "PDF professionale", "Supporto prioritario"]}
              priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Domande Frequenti
            </h2>
            <p className="text-gray-500">Aggiornato Gennaio 2026</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Come funziona?", 
                a: "Scegli un tipo di contratto, compili il form con i dati, l'AI genera il documento conforme al diritto svizzero, lo scarichi come PDF." 
              },
              {
                q: "I contratti sono validi in Svizzera?",
                a: "I contratti sono basati sul Codice delle Obbligazioni (CO) e sul Codice Civile Svizzero (CC). NON siamo uno studio legale. Per situazioni importanti, fai revisionare da un avvocato." 
              },
              {
                q: "In quali lingue sono disponibili i contratti?",
                a: "Offriamo template in tedesco (DE), francese (FR), italiano (IT) e inglese (EN). Puoi scegliere la lingua al momento della generazione." 
              },
              {
                q: "Quanto costa?", 
                a: "Gratis: 1 contratto con watermark. Pro CHF 29/mese: 10 contratti. Business CHF 79/mese: contratti illimitati." 
              },
              {
                q: "Posso cancellare l'abbonamento?", 
                a: "Sì, quando vuoi dalle impostazioni. Nessun vincolo." 
              },
              {
                q: "Come contatto il supporto?", 
                a: "Email: info@easycontracts.ch" 
              },
            ].map((faq, index) => (
              <div 
                key={index}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-16 rounded-[3rem] bg-gradient-to-br from-red-600/30 via-rose-600/20 to-orange-600/30 border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10">
              <span className="text-6xl mb-6 block">🇨🇭</span>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Prova Gratis
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-xl mx-auto">
                1 contratto gratuito. Nessuna carta richiesta.
                <br />Contratti conformi al diritto svizzero.
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all hover:scale-105"
              >
                Genera il Tuo Primo Contratto
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
