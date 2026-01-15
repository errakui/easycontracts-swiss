"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  FileText, Plus, Crown, Download, Eye, Trash2,
  Calendar, TrendingUp, Sparkles, Settings,
  ChevronRight, Loader2, ArrowUpRight, X,
  CreditCard, AlertCircle, Check
} from "lucide-react";
import { downloadContractPDF } from "@/lib/pdf-generator";
import { startCheckout } from "@/lib/checkout";

interface Contract {
  id: string;
  type: string;
  typeName: string;
  party1Name: string;
  party1Email?: string;
  party1Vat?: string;
  party1Address?: string;
  party2Name: string;
  party2Email?: string;
  party2Vat?: string;
  party2Address?: string;
  amount: string;
  paymentTerms?: string;
  paymentMethod?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  deliverables?: string;
  selectedClauses?: string[];
  customRequests?: string;
  status: string;
  hasWatermark: boolean;
  createdAt: string;
  generatedContent?: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  plan: string;
  contractsUsed: number;
  contractsLimit: number;
  contractsRemaining: number | string;
  totalContracts: number;
  stripeCustomerId?: string;
  subscription?: {
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const handleUpgrade = async () => {
    if (!user?.email) return;
    setCheckingOut(true);
    await startCheckout("pro", user.email);
    setCheckingOut(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Recupera dati utente da localStorage (per ora)
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    
    const localUser = JSON.parse(userStr);
    
    try {
      // Prova a recuperare dati aggiornati dal server
      const userRes = await fetch("/api/user/me", {
        headers: { 
          "x-user-id": localUser.id,
          "x-user-email": localUser.email,
        },
      });
      
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
        // Aggiorna localStorage con dati freschi
        localStorage.setItem("user", JSON.stringify(userData.user));
      } else {
        // Fallback a dati locali
        setUser({
          ...localUser,
          contractsRemaining: localUser.contractsLimit === -1 ? "illimitati" : localUser.contractsLimit - localUser.contractsUsed,
          totalContracts: 0,
        });
      }

      // Recupera contratti (usa anche email per sicurezza)
      const contractsRes = await fetch("/api/contracts", {
        headers: { 
          "x-user-id": localUser.id || "",
          "x-user-email": localUser.email || "",
        },
      });
      
      if (contractsRes.ok) {
        const data = await contractsRes.json();
        setContracts(data.contracts || []);
      } else {
        // Fallback a localStorage (per retrocompatibilità)
        const localContracts = JSON.parse(localStorage.getItem("contracts") || "[]");
        setContracts(localContracts);
      }
    } catch (error) {
      console.error("Errore caricamento:", error);
      // Fallback completo a localStorage
      setUser({
        ...localUser,
        contractsRemaining: localUser.contractsLimit === -1 ? "illimitati" : localUser.contractsLimit - localUser.contractsUsed,
        totalContracts: 0,
      });
      const localContracts = JSON.parse(localStorage.getItem("contracts") || "[]");
      setContracts(localContracts);
    } finally {
      setLoading(false);
    }
  };

  const viewContract = async (contract: Contract) => {
    try {
      const userStr = localStorage.getItem("user");
      const localUser = userStr ? JSON.parse(userStr) : null;
      
      const res = await fetch(`/api/contracts/${contract.id}`, {
        headers: { "x-user-id": localUser?.id || "" },
      });
      
      if (res.ok) {
        const data = await res.json();
        setSelectedContract(data.contract);
      } else {
        // Fallback: usa il contratto dalla lista
        setSelectedContract(contract);
      }
      setShowModal(true);
    } catch {
      setSelectedContract(contract);
      setShowModal(true);
    }
  };

  const downloadContract = (contract: Contract) => {
    downloadContractPDF({
      typeName: contract.typeName || contract.type,
      party1Name: contract.party1Name,
      party1Email: contract.party1Email,
      party1Vat: contract.party1Vat,
      party1Address: contract.party1Address,
      party2Name: contract.party2Name,
      party2Email: contract.party2Email,
      party2Vat: contract.party2Vat,
      party2Address: contract.party2Address,
      amount: contract.amount,
      paymentTerms: contract.paymentTerms,
      paymentMethod: contract.paymentMethod,
      duration: contract.duration,
      startDate: contract.startDate,
      endDate: contract.endDate,
      description: contract.description || "",
      deliverables: contract.deliverables,
      selectedClauses: contract.selectedClauses || [],
      customRequests: contract.customRequests,
      generatedContent: contract.generatedContent || "",
      hasWatermark: contract.hasWatermark,
    }, `${contract.typeName || contract.type}-${contract.id}`);
  };

  const deleteContract = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo contratto?")) return;
    
    setDeleting(id);
    try {
      const userStr = localStorage.getItem("user");
      const localUser = userStr ? JSON.parse(userStr) : null;
      
      const res = await fetch(`/api/contracts/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": localUser?.id || "" },
      });
      
      if (res.ok) {
        setContracts(contracts.filter(c => c.id !== id));
      } else {
        // Fallback localStorage
        const updated = contracts.filter(c => c.id !== id);
        localStorage.setItem("contracts", JSON.stringify(updated));
        setContracts(updated);
      }
    } catch {
      const updated = contracts.filter(c => c.id !== id);
      localStorage.setItem("contracts", JSON.stringify(updated));
      setContracts(updated);
    } finally {
      setDeleting(null);
    }
  };

  const manageSubscription = async () => {
    try {
      const res = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: user?.stripeCustomerId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url;
      } else {
        alert("Errore. Contatta il supporto.");
      }
    } catch {
      alert("Errore. Contatta il supporto.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014]">
        <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isPro = user.plan === "PRO" || user.plan === "BUSINESS";
  const limitReached = user.contractsLimit !== -1 && user.contractsUsed >= user.contractsLimit;

  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                Ciao, {user.name?.split(' ')[0] || 'Utente'}! 👋
              </h1>
              <p className="text-gray-500">Gestisci i tuoi contratti</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              {user.stripeCustomerId && (
                <button
                  onClick={manageSubscription}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  Gestisci Abbonamento
                </button>
              )}
              <Link
                href="/generate"
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-2xl hover:opacity-90 transition-all ${limitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => limitReached && e.preventDefault()}
              >
                <Plus className="w-5 h-5" />
                Nuovo Contratto
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">Piano</span>
                <Crown className={`w-5 h-5 ${isPro ? 'text-yellow-500' : 'text-gray-500'}`} />
              </div>
              <p className="text-2xl font-bold text-white mb-2">{user.plan}</p>
              {!isPro && (
                <button 
                  onClick={handleUpgrade}
                  disabled={checkingOut}
                  className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  {checkingOut ? "Caricamento..." : "Passa a Pro"} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">Contratti Usati</span>
                <FileText className="w-5 h-5 text-violet-500" />
              </div>
              <p className="text-2xl font-bold text-white">{user.contractsUsed}</p>
              <p className="text-sm text-gray-500">
                di {user.contractsLimit === -1 ? '∞' : user.contractsLimit}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500">Rimanenti</span>
                <Sparkles className="w-5 h-5 text-cyan-500" />
              </div>
              <p className="text-2xl font-bold text-white">
                {user.contractsRemaining === "illimitati" ? "∞" : user.contractsRemaining}
              </p>
              <p className="text-sm text-gray-500">questo mese</p>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Risparmio</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white">€{contracts.length * 600}</p>
              <p className="text-sm text-gray-400">vs avvocato</p>
            </div>
          </div>

          {/* Limite raggiunto alert */}
          {limitReached && (
            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Limite raggiunto!
                    </h3>
                    <p className="text-gray-400">
                      Hai usato tutti i tuoi {user.contractsLimit} contratti questo mese.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUpgrade}
                  disabled={checkingOut}
                  className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-2xl hover:bg-amber-400 transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {checkingOut ? "Caricamento..." : "Passa a Pro"}
                </button>
              </div>
            </div>
          )}

          {/* Abbonamento info */}
          {user.subscription && (
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white mb-1">Abbonamento {user.plan}</h3>
                  <p className="text-gray-500 text-sm">
                    {user.subscription.cancelAtPeriodEnd 
                      ? `Si disattiverà il ${new Date(user.subscription.currentPeriodEnd).toLocaleDateString("it-IT")}`
                      : `Rinnovo: ${new Date(user.subscription.currentPeriodEnd).toLocaleDateString("it-IT")}`
                    }
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.subscription.status === "ACTIVE" 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {user.subscription.status === "ACTIVE" ? "Attivo" : user.subscription.status}
                </div>
              </div>
            </div>
          )}

          {/* Contracts List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">I Tuoi Contratti</h2>

            {contracts.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white/5 border border-white/10 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Nessun contratto</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Genera il tuo primo contratto in 30 secondi!
                </p>
                <Link 
                  href="/generate" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-2xl"
                >
                  <Sparkles className="w-5 h-5" />
                  Crea Contratto
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contracts.map((contract) => (
                  <div key={contract.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 rounded-2xl bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                        <FileText className="w-6 h-6 text-violet-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        {contract.hasWatermark && (
                          <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                            Watermark
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contract.status === "SIGNED" ? "bg-green-500/20 text-green-400" :
                          contract.status === "FINALIZED" ? "bg-blue-500/20 text-blue-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {contract.status === "SIGNED" ? "Firmato" : 
                           contract.status === "FINALIZED" ? "Finalizzato" : "Bozza"}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-white text-lg mb-2">
                      {contract.typeName || contract.type}
                    </h3>
                    <p className="text-gray-500 text-sm mb-1">
                      {contract.party1Name} ↔ {contract.party2Name}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      €{contract.amount} • {new Date(contract.createdAt).toLocaleDateString("it-IT")}
                    </p>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => viewContract(contract)}
                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Vedi
                      </button>
                      <button 
                        onClick={() => downloadContract(contract)}
                        className="flex-1 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                      <button 
                        onClick={() => deleteContract(contract.id)}
                        disabled={deleting === contract.id}
                        className="py-3 px-3 rounded-xl border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-all"
                      >
                        {deleting === contract.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          {!isPro && contracts.length > 0 && (
            <div className="mt-16 p-10 rounded-3xl bg-gradient-to-br from-violet-600/10 via-fuchsia-600/10 to-indigo-600/10 border border-violet-500/20 text-center">
              <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Sblocca Tutto
              </h3>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Con Pro hai 10 contratti/mese, tutti i template e nessun watermark.
              </p>
              <button
                onClick={handleUpgrade}
                disabled={checkingOut}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                {checkingOut ? "Caricamento..." : "Passa a Pro"}
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Visualizza Contratto */}
      {showModal && selectedContract && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a14] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedContract.typeName}</h3>
                <p className="text-gray-500 text-sm">
                  {selectedContract.party1Name} ↔ {selectedContract.party2Name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => downloadContract(selectedContract)}
                  className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Scarica
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
              <pre className="p-6 rounded-2xl bg-black/50 text-gray-300 text-sm whitespace-pre-wrap font-mono">
                {selectedContract.generatedContent || "Contenuto non disponibile"}
              </pre>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
