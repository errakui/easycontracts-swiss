"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Users, FileText, Crown, TrendingUp, Calendar,
  Search, ChevronLeft, ChevronRight, CreditCard,
  Ban, Euro, Shield, Home, LogOut, Loader2, RefreshCw,
  DollarSign, Activity, Clock, Zap, BarChart3, PieChart
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  contractsUsed: number;
  contractsLimit: number;
  createdAt: string;
  stripeCustomerId?: string;
}

interface Subscription {
  id: string;
  userEmail: string;
  userName: string;
  plan: string;
  status: string;
  amount: number;
  currentPeriodEnd: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  proUsers: number;
  businessUsers: number;
  freeUsers: number;
  totalContracts: number;
  activeSubscriptions: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  revenueTotal: number;
  newUsersToday: number;
  newUsersWeek: number;
  contractsToday: number;
  contractsWeek: number;
}

interface Payment {
  id: string;
  email: string;
  amount: number;
  status: string;
  plan: string;
  date: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "subscriptions" | "payments">("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, proUsers: 0, businessUsers: 0, freeUsers: 0,
    totalContracts: 0, activeSubscriptions: 0,
    revenueToday: 0, revenueWeek: 0, revenueMonth: 0, revenueTotal: 0,
    newUsersToday: 0, newUsersWeek: 0,
    contractsToday: 0, contractsWeek: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const usersPerPage = 10;

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = () => {
    const adminSession = localStorage.getItem("admin_session");
    if (!adminSession) {
      router.push("/admin/login");
      return;
    }
    
    const session = JSON.parse(adminSession);
    // Sessione valida per 24 ore
    if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("admin_session");
      router.push("/admin/login");
      return;
    }
    
    if (session.email !== "info@errakui.dev") {
      router.push("/admin/login");
      return;
    }
    
    loadData();
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Carica dati utenti e stats dal DB
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setSubscriptions(data.subscriptions || []);
        setPayments(data.payments || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Errore caricamento dati:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = async (userId: string, newPlan: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch("/api/admin/users/update-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
        loadData(); // Ricarica stats
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Eliminare questo utente? Questa azione è irreversibile.")) return;
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        loadData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin/login");
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/5 border-r border-white/10 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-bold">Admin Panel</span>
            <p className="text-xs text-gray-500">easycontracts</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "overview" ? "bg-violet-500/20 text-violet-400" : "text-gray-500 hover:bg-white/5"}`}
          >
            <BarChart3 className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "users" ? "bg-violet-500/20 text-violet-400" : "text-gray-500 hover:bg-white/5"}`}
          >
            <Users className="w-5 h-5" /> Utenti
          </button>
          <button 
            onClick={() => setActiveTab("subscriptions")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "subscriptions" ? "bg-violet-500/20 text-violet-400" : "text-gray-500 hover:bg-white/5"}`}
          >
            <Crown className="w-5 h-5" /> Abbonamenti
          </button>
          <button 
            onClick={() => setActiveTab("payments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "payments" ? "bg-violet-500/20 text-violet-400" : "text-gray-500 hover:bg-white/5"}`}
          >
            <CreditCard className="w-5 h-5" /> Pagamenti
          </button>
          
          <div className="pt-4 border-t border-white/10">
            <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/5 transition-colors">
              <Home className="w-5 h-5" /> Torna al Sito
            </Link>
          </div>
        </nav>

        <div className="pt-4 border-t border-white/10">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-gray-600">Loggato come</p>
            <p className="text-sm text-gray-400">info@errakui.dev</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Esci
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "users" && "Gestione Utenti"}
              {activeTab === "subscriptions" && "Abbonamenti Attivi"}
              {activeTab === "payments" && "Storico Pagamenti"}
            </h1>
            <p className="text-gray-500">
              Ultimo aggiornamento: {new Date().toLocaleString("it-IT")}
            </p>
          </div>
          <button onClick={loadData} className="btn-secondary">
            <RefreshCw className="w-4 h-4 mr-2" /> Aggiorna
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            {/* Revenue Stats */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" /> Incassi
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Oggi</span>
                  </div>
                  <p className="text-4xl font-black text-white">€{stats.revenueToday}</p>
                </div>
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Questa Settimana</span>
                  </div>
                  <p className="text-4xl font-black text-white">€{stats.revenueWeek}</p>
                </div>
                <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-medium">Questo Mese</span>
                  </div>
                  <p className="text-4xl font-black text-white">€{stats.revenueMonth}</p>
                </div>
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Totale</span>
                  </div>
                  <p className="text-4xl font-black text-white">€{stats.revenueTotal}</p>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" /> Utenti
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <Users className="w-6 h-6 text-violet-400 mb-4" />
                  <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
                  <p className="text-gray-500 text-sm">Totali</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <Crown className="w-6 h-6 text-amber-400 mb-4" />
                  <p className="text-3xl font-black text-white">{stats.proUsers}</p>
                  <p className="text-gray-500 text-sm">PRO</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <Zap className="w-6 h-6 text-purple-400 mb-4" />
                  <p className="text-3xl font-black text-white">{stats.businessUsers}</p>
                  <p className="text-gray-500 text-sm">Business</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <Users className="w-6 h-6 text-gray-400 mb-4" />
                  <p className="text-3xl font-black text-white">{stats.freeUsers}</p>
                  <p className="text-gray-500 text-sm">Free</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <Activity className="w-6 h-6 text-green-400 mb-4" />
                  <p className="text-3xl font-black text-white">+{stats.newUsersToday}</p>
                  <p className="text-gray-500 text-sm">Oggi</p>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> Attività
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <FileText className="w-6 h-6 text-cyan-400 mb-4" />
                  <p className="text-3xl font-black text-white">{stats.totalContracts}</p>
                  <p className="text-gray-500 text-sm">Contratti Totali</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <FileText className="w-6 h-6 text-green-400 mb-4" />
                  <p className="text-3xl font-black text-white">{stats.contractsToday}</p>
                  <p className="text-gray-500 text-sm">Contratti Oggi</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <FileText className="w-6 h-6 text-blue-400 mb-4" />
                  <p className="text-3xl font-black text-white">{stats.contractsWeek}</p>
                  <p className="text-gray-500 text-sm">Contratti Settimana</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <Crown className="w-6 h-6 text-amber-400 mb-4" />
                  <p className="text-3xl font-black text-white">{stats.activeSubscriptions}</p>
                  <p className="text-gray-500 text-sm">Abbonamenti Attivi</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ultimi Utenti */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Ultimi Utenti Registrati</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                          {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{user.name || user.email}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.plan === "BUSINESS" ? "bg-purple-500/20 text-purple-400" :
                        user.plan === "PRO" ? "bg-violet-500/20 text-violet-400" :
                        "bg-gray-500/20 text-gray-400"
                      }`}>{user.plan}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ultimi Pagamenti */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Ultimi Pagamenti</h3>
                <div className="space-y-3">
                  {payments.length > 0 ? payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div>
                        <p className="text-white text-sm font-medium">{payment.email}</p>
                        <p className="text-gray-500 text-xs">{new Date(payment.date).toLocaleDateString("it-IT")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">€{payment.amount}</p>
                        <p className="text-gray-500 text-xs">{payment.plan}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">Nessun pagamento recente</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <>
            {/* Filters */}
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 mb-6 flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Cerca per nome o email..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="input-dark pl-12 w-full" 
                />
              </div>
              <select 
                value={filterPlan} 
                onChange={(e) => setFilterPlan(e.target.value)} 
                className="input-dark w-full lg:w-48"
              >
                <option value="all">Tutti i piani</option>
                <option value="FREE">Free</option>
                <option value="PRO">Pro</option>
                <option value="BUSINESS">Business</option>
              </select>
            </div>

            {/* Table */}
            <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Utente</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Piano</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Contratti</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Registrato</th>
                      <th className="text-right px-6 py-4 text-gray-500 font-medium text-sm">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                              {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.name || "N/A"}</p>
                              <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.plan === "BUSINESS" ? "bg-purple-500/20 text-purple-400" :
                            user.plan === "PRO" ? "bg-violet-500/20 text-violet-400" :
                            "bg-gray-500/20 text-gray-400"
                          }`}>{user.plan}</span>
                        </td>
                        <td className="px-6 py-4 text-white">
                          {user.contractsUsed}/{user.contractsLimit === 999999 ? '∞' : user.contractsLimit}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("it-IT")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={user.plan}
                              onChange={(e) => handleChangePlan(user.id, e.target.value)}
                              disabled={actionLoading === user.id}
                              className="input-dark py-2 px-3 text-sm"
                            >
                              <option value="FREE">Free</option>
                              <option value="PRO">Pro</option>
                              <option value="BUSINESS">Business</option>
                            </select>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={actionLoading === user.id}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                            >
                              {actionLoading === user.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Ban className="w-5 h-5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                  <p className="text-gray-500 text-sm">{filteredUsers.length} utenti totali</p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                      disabled={currentPage === 1} 
                      className="p-2 rounded-lg hover:bg-white/5 text-gray-500 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-gray-500 px-4">{currentPage}/{totalPages}</span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                      disabled={currentPage === totalPages} 
                      className="p-2 rounded-lg hover:bg-white/5 text-gray-500 disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === "subscriptions" && (
          <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Utente</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Piano</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Stato</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Importo</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Scadenza</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscriptions.length > 0 ? subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{sub.userName}</p>
                          <p className="text-gray-500 text-sm">{sub.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sub.plan === "BUSINESS" ? "bg-purple-500/20 text-purple-400" :
                          "bg-violet-500/20 text-violet-400"
                        }`}>{sub.plan}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sub.status === "ACTIVE" ? "bg-green-500/20 text-green-400" :
                          sub.status === "PAST_DUE" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>{sub.status}</span>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">€{sub.amount}/mese</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(sub.currentPeriodEnd).toLocaleDateString("it-IT")}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        Nessun abbonamento attivo
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Email</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Piano</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Importo</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Stato</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-medium text-sm">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.length > 0 ? payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white">{payment.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.plan === "BUSINESS" ? "bg-purple-500/20 text-purple-400" :
                          "bg-violet-500/20 text-violet-400"
                        }`}>{payment.plan}</span>
                      </td>
                      <td className="px-6 py-4 text-green-400 font-bold">€{payment.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === "succeeded" ? "bg-green-500/20 text-green-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>{payment.status === "succeeded" ? "Completato" : payment.status}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(payment.date).toLocaleString("it-IT")}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        Nessun pagamento registrato
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
