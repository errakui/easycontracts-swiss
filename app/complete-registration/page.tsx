"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Loader2, Crown, Eye, EyeOff, User, Lock } from "lucide-react";

function CompleteRegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Recupera email da URL o localStorage
    const urlEmail = searchParams.get("email");
    const storedEmail = localStorage.getItem("checkout_email");
    
    if (urlEmail) {
      setEmail(urlEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Se non c'è email, redirect a homepage
      router.push("/");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Le password non coincidono");
      return;
    }

    if (formData.password.length < 8) {
      setError("La password deve avere almeno 8 caratteri");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: `${formData.name} ${formData.surname}`.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore nella registrazione");
      }

      // Salva utente in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("checkout_email");

      // Redirect alla generazione contratti
      router.push("/generate");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3">
              Pagamento Completato! 🎉
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 font-medium mb-4">
              <Crown className="w-4 h-4" />
              Sei PRO
            </div>
            <p className="text-gray-400">
              Completa il tuo profilo per iniziare a generare contratti
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="input-dark opacity-60 cursor-not-allowed"
                />
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nome *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-dark pl-12"
                    placeholder="Mario"
                    required
                  />
                </div>
              </div>

              {/* Cognome */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Cognome *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className="input-dark pl-12"
                    placeholder="Rossi"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-dark pl-12 pr-12"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimo 8 caratteri</p>
              </div>

              {/* Conferma Password */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Conferma Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-dark pl-12"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.name || !formData.surname || !formData.password}
              className="w-full btn-primary py-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Completamento...
                </>
              ) : (
                "Completa e Inizia a Generare →"
              )}
            </button>
          </form>

          {/* Features reminder */}
          <div className="mt-8 p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <p className="text-sm text-gray-300 text-center">
              Con il piano PRO hai accesso a:<br />
              <span className="text-violet-400">10 contratti/mese • Nessun watermark • Tutte le clausole</span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
    </div>
  );
}

// Main export with Suspense
export default function CompleteRegistrationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompleteRegistrationContent />
    </Suspense>
  );
}

