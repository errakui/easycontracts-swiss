"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  Download,
  Check,
  Lock,
  Loader2,
  Crown,
  Users,
  Euro,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Building,
  User,
  Briefcase,
  Shield,
  AlertCircle,
} from "lucide-react";
import { contractTypes, contractCategories, commonClauses } from "@/lib/contracts";
import { downloadContractPDF } from "@/lib/pdf-generator";
import { startCheckout } from "@/lib/checkout";
import Link from "next/link";

type Step = "type" | "parties" | "details" | "clauses" | "generate" | "preview" | "revision";

interface ContractData {
  type: string;
  // Parti - BASE
  party1Name: string;
  party1Type: "persona" | "azienda";
  party1Vat: string;
  party1Address: string;
  party1City: string;
  party1Email: string;
  party1Phone: string;
  party2Name: string;
  party2Type: "persona" | "azienda";
  party2Vat: string;
  party2Address: string;
  party2City: string;
  party2Email: string;
  party2Phone: string;
  // Dettagli - BASE
  description: string;
  amount: string;
  currency: string;
  // Dettagli - PRO
  paymentMethod: string;
  paymentTerms: string;
  paymentSchedule: string;
  duration: string;
  durationType: string;
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
  noticePeriod: string;
  workLocation: string;
  workHours: string;
  deliverables: string;
  milestones: string;
  // Clausole
  selectedClauses: string[];
  customRequests: string;
  // Extra PRO
  penaltyAmount: string;
  jurisdictionCity: string;
  arbitration: boolean;
  governingLaw: string;
}

const initialData: ContractData = {
  type: "",
  party1Name: "",
  party1Type: "persona",
  party1Vat: "",
  party1Address: "",
  party1City: "",
  party1Email: "",
  party1Phone: "",
  party2Name: "",
  party2Type: "persona",
  party2Vat: "",
  party2Address: "",
  party2City: "",
  party2Email: "",
  party2Phone: "",
  description: "",
  amount: "",
  currency: "EUR",
  paymentMethod: "",
  paymentTerms: "",
  paymentSchedule: "",
  duration: "",
  durationType: "mesi",
  startDate: "",
  endDate: "",
  autoRenewal: false,
  noticePeriod: "",
  workLocation: "",
  workHours: "",
  deliverables: "",
  milestones: "",
  selectedClauses: [],
  customRequests: "",
  penaltyAmount: "",
  jurisdictionCity: "",
  arbitration: false,
  governingLaw: "italiana",
};

export default function GeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [data, setData] = useState<ContractData>(initialData);
  const [generatedContract, setGeneratedContract] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [revisionPrompt, setRevisionPrompt] = useState("");
  const [revisionUsed, setRevisionUsed] = useState(false);
  const [revising, setRevising] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setIsPro(userData.plan === "PRO" || userData.plan === "BUSINESS");
    }
  }, []);

  // Scroll to top quando cambia step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const selectedContract = contractTypes.find((c) => c.id === data.type);

  const handleNext = () => {
    const steps: Step[] = ["type", "parties", "details", "clauses"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ["type", "parties", "details", "clauses"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      localStorage.setItem("pendingContract", JSON.stringify({ data, step: "clauses" }));
      router.push("/login?from=/generate");
      return;
    }

    setStep("generate");
    setGenerating(true);

    try {
      // 1. Genera il contratto con AI
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          typeName: selectedContract?.name || "Contratto",
          isPro,
        }),
      });

      if (!response.ok) throw new Error("Errore nella generazione");

      const result = await response.json();
      const generatedContent = result.contract;
      setGeneratedContract(generatedContent);
      
      // 2. Salva nel database
      try {
        await fetch("/api/contracts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            contractData: {
              ...data,
              typeName: selectedContract?.name || "Contratto",
            },
            generatedContent,
            isPro,
          }),
        });
      } catch (dbError) {
        console.error("Errore salvataggio DB:", dbError);
      }

      // 3. Salva anche in localStorage come backup
      const contracts = JSON.parse(localStorage.getItem("contracts") || "[]");
      contracts.push({
        id: Date.now().toString(),
        type: data.type,
        typeName: selectedContract?.name || "Contratto",
        party1Name: data.party1Name,
        party2Name: data.party2Name,
        amount: data.amount,
        status: "DRAFT",
        hasWatermark: !isPro,
        createdAt: new Date().toISOString(),
        generatedContent,
      });
      localStorage.setItem("contracts", JSON.stringify(contracts));
      
      setStep("preview");
    } catch (error) {
      console.error(error);
      alert("Errore nella generazione. Riprova.");
      setStep("clauses");
    } finally {
      setGenerating(false);
    }
  };

  // Funzione per pulire markdown
  const cleanMarkdown = (text: string): string => {
    return text
      .replace(/^#{1,6}\s+/gm, '') // Rimuove # headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Rimuove **bold**
      .replace(/\*(.*?)\*/g, '$1') // Rimuove *italic*
      .replace(/`(.*?)`/g, '$1') // Rimuove `code`
      .replace(/---+/g, '═'.repeat(50)) // Sostituisce --- con linea
      .replace(/^\s*[-*]\s+/gm, '• ') // Bullet points
      .trim();
  };

  // Funzione per revisione
  const handleRevision = async () => {
    if (!revisionPrompt.trim()) return;
    
    // Se già usata e non PRO, mostra messaggio
    if (revisionUsed && !isPro) {
      const confirm = window.confirm(
        "Hai già usato la revisione gratuita. Vuoi passare a PRO per revisioni illimitate?"
      );
      if (confirm) {
        startCheckout("pro");
      }
      return;
    }

    setRevising(true);
    try {
      const response = await fetch("/api/revise-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalContract: generatedContract,
          revisionRequest: revisionPrompt,
          contractType: selectedContract?.name || data.type,
        }),
      });

      if (!response.ok) throw new Error("Errore nella revisione");

      const result = await response.json();
      setGeneratedContract(result.contract);
      setRevisionUsed(true);
      setRevisionPrompt("");
      setStep("preview");
    } catch (error) {
      console.error(error);
      alert("Errore nella revisione. Riprova.");
    } finally {
      setRevising(false);
    }
  };

  const handleDownload = () => {
    const contractTypeName = selectedContract?.name || data.type;
    downloadContractPDF({
      typeName: contractTypeName,
      party1Name: data.party1Name,
      party1Email: data.party1Email,
      party1Vat: data.party1Vat,
      party1Address: `${data.party1Address}, ${data.party1City}`,
      party2Name: data.party2Name,
      party2Email: data.party2Email,
      party2Vat: data.party2Vat,
      party2Address: `${data.party2Address}, ${data.party2City}`,
      amount: data.amount,
      paymentTerms: data.paymentTerms,
      paymentMethod: data.paymentMethod,
      duration: data.duration ? `${data.duration} ${data.durationType}` : undefined,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      deliverables: data.deliverables,
      selectedClauses: data.selectedClauses,
      customRequests: data.customRequests,
      generatedContent: generatedContract,
      hasWatermark: !isPro,
    }, `contratto-${data.type}-${Date.now()}`);
  };

  const ProBadge = () => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
      <Crown className="w-3 h-3" /> PRO
    </span>
  );

  // Helper per mostrare campo PRO - SENZA wrapper che causa re-render
  const renderProField = (
    label: string, 
    field: keyof ContractData,
    type: "text" | "email" | "date" | "number" | "select" | "textarea" = "text",
    placeholder?: string,
    options?: { value: string; label: string }[]
  ) => {
    if (!isPro) {
      return (
        <div className="relative">
          <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
            {label} <ProBadge />
          </label>
          <div 
            className="relative cursor-pointer"
            onClick={() => startCheckout("pro")}
          >
            <div className="absolute inset-0 bg-[#030014]/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-xs text-gray-400">🔓 Sblocca (€19/mese)</span>
              </div>
            </div>
            <div className="opacity-30 pointer-events-none">
              <input type="text" className="input-dark" placeholder={placeholder} readOnly />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
          {label} <ProBadge />
        </label>
        {type === "select" && options ? (
          <select
            value={data[field] as string}
            onChange={(e) => setData(prev => ({ ...prev, [field]: e.target.value }))}
            className="input-dark"
          >
            <option value="">Seleziona...</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            value={data[field] as string}
            onChange={(e) => setData(prev => ({ ...prev, [field]: e.target.value }))}
            rows={3}
            className="input-dark"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            value={data[field] as string}
            onChange={(e) => setData(prev => ({ ...prev, [field]: e.target.value }))}
            className="input-dark"
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  const stepLabels = ["Tipo", "Parti", "Dettagli", "Clausole"];
  const steps: Step[] = ["type", "parties", "details", "clauses"];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Progress */}
          {step !== "preview" && step !== "generate" && (
            <div className="mb-12">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {stepLabels.map((label, index) => {
                  const isActive = index === currentIndex;
                  const isCompleted = index < currentIndex;
                  return (
                    <div key={label} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                          isCompleted ? "bg-green-500 text-white" :
                          isActive ? "bg-violet-500 text-white" :
                          "bg-white/5 text-gray-500"
                        }`}>
                          {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                        </div>
                        <span className={`text-xs mt-2 ${isActive ? "text-white" : "text-gray-500"}`}>
                          {label}
                        </span>
                      </div>
                      {index < 3 && (
                        <div className={`w-12 h-0.5 mx-2 -mt-4 ${isCompleted ? "bg-green-500" : "bg-white/10"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: TIPO */}
          {step === "type" && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-white mb-3">
                  Che Contratto Ti Serve?
                </h1>
                <p className="text-gray-400">500+ template • L'AI genera il resto</p>
              </div>

              <div className="space-y-8">
                {contractCategories.map((category) => {
                  const contracts = contractTypes.filter((c) => c.category === category.id);
                  if (contracts.length === 0) return null;
                  return (
                    <div key={category.id}>
                      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-xl">{category.icon}</span>
                        {category.name}
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {contracts.map((contract) => {
                          const needsPro = !contract.free;
                          return (
                            <button
                              key={contract.id}
                              onClick={() => {
                                if (needsPro && !isPro) {
                                  startCheckout("pro");
                                  return;
                                }
                                setData({ ...data, type: contract.id });
                                handleNext();
                              }}
                              className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-left transition-all hover:bg-white/10 hover:border-white/20 ${
                                needsPro && !isPro ? "opacity-60" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{contract.icon}</span>
                                  <div>
                                    <h3 className="font-semibold text-white flex items-center gap-2">
                                      {contract.name}
                                      {needsPro && <ProBadge />}
                                    </h3>
                                    <p className="text-sm text-gray-500">{contract.description}</p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PARTI */}
          {step === "parties" && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <span className="text-4xl mb-4 block">{selectedContract?.icon}</span>
                <h1 className="text-3xl font-black text-white mb-2">Chi Firma il Contratto?</h1>
                <p className="text-gray-400">Inserisci i dati delle parti coinvolte</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* PARTE 1 */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-violet-400" />
                    Parte 1 (Tu / Committente)
                  </h3>
                  
                  {/* Tipo - FREE */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Tipo</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setData({ ...data, party1Type: "persona" })}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          data.party1Type === "persona" ? "bg-violet-500 text-white" : "bg-white/5 text-gray-400"
                        }`}
                      >
                        Persona Fisica
                      </button>
                      <button
                        onClick={() => setData({ ...data, party1Type: "azienda" })}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          data.party1Type === "azienda" ? "bg-violet-500 text-white" : "bg-white/5 text-gray-400"
                        }`}
                      >
                        Azienda
                      </button>
                    </div>
                  </div>

                  {/* Nome - FREE */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      {data.party1Type === "azienda" ? "Ragione Sociale *" : "Nome e Cognome *"}
                    </label>
                    <input
                      type="text"
                      value={data.party1Name}
                      onChange={(e) => setData({ ...data, party1Name: e.target.value })}
                      className="input-dark"
                      placeholder={data.party1Type === "azienda" ? "Acme S.r.l." : "Mario Rossi"}
                    />
                  </div>

                  {/* P.IVA / CF - FREE */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      {data.party1Type === "azienda" ? "P.IVA *" : "Codice Fiscale *"}
                    </label>
                    <input
                      type="text"
                      value={data.party1Vat}
                      onChange={(e) => setData({ ...data, party1Vat: e.target.value })}
                      className="input-dark"
                      placeholder={data.party1Type === "azienda" ? "IT12345678901" : "RSSMRA80A01H501Z"}
                    />
                  </div>

                  {/* Indirizzo - PRO */}
                  {renderProField("Indirizzo", "party1Address", "text", "Via Roma 1")}

                  {/* Città - PRO */}
                  <div className="mt-4">
                    {renderProField("Città", "party1City", "text", "Milano")}
                  </div>

                  {/* Email - PRO */}
                  <div className="mt-4">
                    {renderProField("Email", "party1Email", "email", "mario@email.com")}
                  </div>
                </div>

                {/* PARTE 2 */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Parte 2 (Controparte)
                  </h3>
                  
                  {/* Tipo - FREE */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Tipo</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setData({ ...data, party2Type: "persona" })}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          data.party2Type === "persona" ? "bg-cyan-500 text-white" : "bg-white/5 text-gray-400"
                        }`}
                      >
                        Persona Fisica
                      </button>
                      <button
                        onClick={() => setData({ ...data, party2Type: "azienda" })}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                          data.party2Type === "azienda" ? "bg-cyan-500 text-white" : "bg-white/5 text-gray-400"
                        }`}
                      >
                        Azienda
                      </button>
                    </div>
                  </div>

                  {/* Nome - FREE */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      {data.party2Type === "azienda" ? "Ragione Sociale *" : "Nome e Cognome *"}
                    </label>
                    <input
                      type="text"
                      value={data.party2Name}
                      onChange={(e) => setData({ ...data, party2Name: e.target.value })}
                      className="input-dark"
                      placeholder={data.party2Type === "azienda" ? "Cliente S.p.A." : "Giulia Bianchi"}
                    />
                  </div>

                  {/* P.IVA / CF - FREE */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      {data.party2Type === "azienda" ? "P.IVA *" : "Codice Fiscale *"}
                    </label>
                    <input
                      type="text"
                      value={data.party2Vat}
                      onChange={(e) => setData({ ...data, party2Vat: e.target.value })}
                      className="input-dark"
                      placeholder={data.party2Type === "azienda" ? "IT98765432101" : "BNCGLI85B45F205W"}
                    />
                  </div>

                  {/* Indirizzo - PRO */}
                  {renderProField("Indirizzo", "party2Address", "text", "Via Milano 10")}

                  <div className="mt-4">
                    {renderProField("Città", "party2City", "text", "Roma")}
                  </div>

                  <div className="mt-4">
                    {renderProField("Email", "party2Email", "email", "giulia@email.com")}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button onClick={handleBack} className="btn-outline">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Indietro
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!data.party1Name || !data.party2Name || !data.party1Vat || !data.party2Vat}
                  className="btn-primary disabled:opacity-50"
                >
                  Avanti <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETTAGLI */}
          {step === "details" && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-white mb-2">Dettagli del Contratto</h1>
                <p className="text-gray-400">Definisci oggetto, compenso e durata</p>
              </div>

              <div className="space-y-6">
                {/* Oggetto - FREE */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Oggetto del Contratto *</h3>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    rows={4}
                    className="input-dark"
                    placeholder="Descrivi l'oggetto del contratto: cosa deve essere fatto, quali servizi vengono forniti, ecc."
                  />
                </div>

                {/* Compenso - FREE */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Compenso *</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Importo</label>
                      <div className="relative">
                        <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="number"
                          value={data.amount}
                          onChange={(e) => setData({ ...data, amount: e.target.value })}
                          className="input-dark pl-12"
                          placeholder="3000"
                        />
                      </div>
                    </div>
                    {renderProField("Metodo di pagamento", "paymentMethod", "select", undefined, [
                      { value: "bonifico", label: "Bonifico Bancario" },
                      { value: "contanti", label: "Contanti" },
                      { value: "assegno", label: "Assegno" },
                      { value: "paypal", label: "PayPal" },
                    ])}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    {renderProField("Termini di pagamento", "paymentTerms", "select", undefined, [
                      { value: "anticipato", label: "100% Anticipato" },
                      { value: "50-50", label: "50% anticipo + 50% saldo" },
                      { value: "30-70", label: "30% anticipo + 70% saldo" },
                      { value: "posticipato", label: "100% a completamento" },
                      { value: "rate", label: "Rate mensili" },
                    ])}
                    {renderProField("Scadenza pagamento", "paymentSchedule", "select", undefined, [
                      { value: "immediato", label: "Immediato" },
                      { value: "15gg", label: "Entro 15 giorni" },
                      { value: "30gg", label: "Entro 30 giorni" },
                      { value: "60gg", label: "Entro 60 giorni" },
                    ])}
                  </div>
                </div>

                {/* Durata - MIX */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Durata</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Data inizio</label>
                      <input
                        type="date"
                        value={data.startDate}
                        onChange={(e) => setData({ ...data, startDate: e.target.value })}
                        className="input-dark"
                      />
                    </div>
                    {renderProField("Data fine", "endDate", "date")}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    {renderProField("Rinnovo automatico", "autoRenewal", "select", undefined, [
                      { value: "true", label: "Sì" },
                      { value: "false", label: "No" },
                    ])}
                    {renderProField("Preavviso disdetta", "noticePeriod", "select", undefined, [
                      { value: "15", label: "15 giorni" },
                      { value: "30", label: "30 giorni" },
                      { value: "60", label: "60 giorni" },
                      { value: "90", label: "90 giorni" },
                    ])}
                  </div>
                </div>

                {/* Deliverables - PRO */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    Deliverables e Milestone <ProBadge />
                  </h3>
                  {renderProField("Cosa verrà consegnato", "deliverables", "textarea", "Elenca i deliverables: es. sito web, logo, report...")}
                  <div className="mt-4">
                    {renderProField("Milestone e scadenze", "milestones", "textarea", "Definisci le tappe: es. 15/02 - Bozza, 01/03 - Revisione...")}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button onClick={handleBack} className="btn-outline">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Indietro
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!data.description || !data.amount}
                  className="btn-primary disabled:opacity-50"
                >
                  Avanti <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CLAUSOLE */}
          {step === "clauses" && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-white mb-2">Clausole Aggiuntive</h1>
                <p className="text-gray-400">Seleziona le clausole per il tuo contratto</p>
              </div>

              <div className="space-y-3">
                {commonClauses.map((clause) => {
                  const isSelected = data.selectedClauses.includes(clause.id) || clause.required;
                  const needsPro = clause.pro && !isPro;
                  
                  return (
                    <div
                      key={clause.id}
                      onClick={() => {
                        if (clause.required) return;
                        if (needsPro) {
                          startCheckout("pro");
                          return;
                        }
                        setData({
                          ...data,
                          selectedClauses: isSelected
                            ? data.selectedClauses.filter((id) => id !== clause.id)
                            : [...data.selectedClauses, clause.id],
                        });
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-violet-500 bg-violet-500/10"
                          : needsPro
                          ? "border-white/10 bg-white/5 opacity-60"
                          : "border-white/10 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white flex items-center gap-2">
                            {clause.title}
                            {clause.required && <span className="text-xs text-gray-500">(Obbligatoria)</span>}
                            {clause.pro && <ProBadge />}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{clause.description}</p>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-violet-400" />}
                        {needsPro && <Lock className="w-5 h-5 text-amber-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom - PRO */}
              <div className="mt-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                {renderProField("Richieste personalizzate", "customRequests", "textarea", "Clausole o richieste particolari che vuoi includere...")}
              </div>

              {/* Legal - PRO */}
              <div className="mt-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  Clausole Legali <ProBadge />
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {renderProField("Foro competente", "jurisdictionCity", "text", "Milano")}
                  {renderProField("Penale inadempimento (€)", "penaltyAmount", "number", "500")}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button onClick={handleBack} className="btn-outline">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Indietro
                </button>
                <button onClick={handleGenerate} className="btn-primary">
                  <Sparkles className="w-4 h-4 mr-2" /> Genera Contratto
                </button>
              </div>

              {!isPro && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Piano Free</p>
                      <p className="text-sm text-gray-400">
                        Il contratto avrà un watermark. <button onClick={() => startCheckout("pro")} className="text-amber-400 hover:underline font-medium">Passa a PRO (€19/mese)</button> per rimuoverlo e sbloccare tutte le opzioni.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GENERATING */}
          {step === "generate" && (
            <div className="text-center py-20">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-ping" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white mb-3">L'AI sta generando...</h2>
              <p className="text-gray-400">Circa 30 secondi</p>
            </div>
          )}

          {/* PREVIEW */}
          {step === "preview" && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 mb-4">
                  <Check className="w-4 h-4" /> Contratto Generato
                </div>
                <h1 className="text-3xl font-black text-white">Ecco il Tuo Contratto</h1>
                {!isPro && (
                  <p className="text-amber-400 text-sm mt-2">⚠️ Il PDF avrà un watermark</p>
                )}
              </div>

              {/* Azioni principali */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button onClick={handleDownload} className="btn-primary flex-1 py-4 text-lg">
                  <Download className="w-5 h-5 mr-2" /> Scarica PDF
                </button>
                <button 
                  onClick={() => setStep("revision")} 
                  className="btn-outline flex-1 py-4 text-lg"
                  disabled={revisionUsed && !isPro}
                >
                  <Sparkles className="w-5 h-5 mr-2" /> 
                  {revisionUsed && !isPro ? "Revisione usata" : "Revisione"}
                  {!revisionUsed && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">1 gratis</span>}
                </button>
              </div>

              {/* Preview contratto */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 mb-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <FileText className="w-6 h-6 text-violet-400" />
                  <div>
                    <h3 className="font-bold text-white">{selectedContract?.name}</h3>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString("it-IT")} • {data.party1Name} ↔ {data.party2Name}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-white text-gray-900 text-sm overflow-auto max-h-[600px] whitespace-pre-wrap leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  {cleanMarkdown(generatedContract)}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Link href="/dashboard" className="btn-outline">
                  Vai alla Dashboard
                </Link>
                <button onClick={() => { setData(initialData); setGeneratedContract(""); setRevisionUsed(false); setStep("type"); }} className="btn-secondary">
                  Nuovo Contratto
                </button>
              </div>
            </div>
          )}

          {/* REVISION */}
          {step === "revision" && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-white mb-2">Revisiona il Contratto</h1>
                <p className="text-gray-400">
                  Descrivi cosa vuoi modificare e l'AI correggerà il contratto
                </p>
                {!isPro && !revisionUsed && (
                  <p className="text-green-400 text-sm mt-2">✨ Hai 1 revisione gratuita</p>
                )}
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 mb-6">
                <label className="block text-sm text-gray-400 mb-3">
                  Cosa vuoi modificare?
                </label>
                <textarea
                  value={revisionPrompt}
                  onChange={(e) => setRevisionPrompt(e.target.value)}
                  rows={4}
                  className="input-dark"
                  placeholder="Es: Aggiungi una clausola sulla proprietà intellettuale, cambia la penale a €1000, specifica che il pagamento è in 3 rate..."
                />
              </div>

              {/* Preview mini */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 max-h-[200px] overflow-auto">
                <p className="text-xs text-gray-500 mb-2">Contratto attuale:</p>
                <p className="text-sm text-gray-400 whitespace-pre-wrap">
                  {cleanMarkdown(generatedContract).substring(0, 500)}...
                </p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep("preview")} className="btn-outline flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Annulla
                </button>
                <button 
                  onClick={handleRevision} 
                  disabled={!revisionPrompt.trim() || revising}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {revising ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Revisionando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> Applica Revisione
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
