"use client";

import Link from "next/link";
import { FileText, Menu, X, Sparkles, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check for logged in user
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("contracts");
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/#demo", label: "Come Funziona" },
    { href: "/#prezzi", label: "Prezzi" },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-[#0a0505]/80 backdrop-blur-xl border-b border-white/5" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-red-600 to-rose-600 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">easy</span>
              <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">contracts</span>
              <span className="text-xs ml-1">🇨🇭</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="w-px h-6 bg-white/10 mx-4"></div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <User className="w-4 h-4 text-red-400" />
                  <span className="text-white font-medium">{user.name?.split(' ')[0] || 'Account'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                  title="Esci"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                  Accedi
                </Link>
                <Link 
                  href="/generate" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  Prova Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0505]/95 backdrop-blur-xl border-b border-white/5 animate-fade-in">
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 px-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-white/10 my-4"></div>
              
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block py-3 px-4 text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full py-3 px-4 text-left text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-3 px-4 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Accedi
                  </Link>
                  <Link 
                    href="/generate" 
                    className="block py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Prova Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
