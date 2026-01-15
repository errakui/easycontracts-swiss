"use client";

import Link from "next/link";
import { FileText, Mail, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    prodotto: [
      { label: "Come Funziona", href: "/#demo" },
      { label: "Prezzi", href: "/#prezzi" },
      { label: "Template", href: "/generate" },
    ],
    legale: [
      { label: "Datenschutz", href: "/privacy" },
      { label: "AGB", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
    risorse: [
      { label: "Blog", href: "/blog" },
      { label: "Kontakt", href: "/contact" },
      { label: "Über Uns", href: "/about" },
    ],
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#0a0505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-16 text-center border-b border-white/5">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            🇨🇭 Bereit tausende Franken zu sparen?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Schliessen Sie sich 800+ Profis an, die bereits die Zukunft der Schweizer Verträge entdeckt haben.
          </p>
          <Link 
            href="/generate" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
          >
            Gratis starten
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Links Grid */}
        <div className="py-16 grid md:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-red-600 to-rose-600 p-2.5 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">easy</span>
                <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">contracts</span>
                <span className="ml-1">🇨🇭</span>
              </span>
            </Link>
            <p className="text-gray-500 mb-6 max-w-sm text-sm">
              Erstellen Sie professionelle Schweizer Verträge in 30 Sekunden mit KI. 
              Sparen Sie Zeit und Geld.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="mailto:info@easycontracts.ch" 
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Prodotto */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Produkt</h4>
            <ul className="space-y-3">
              {footerLinks.prodotto.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legale */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Rechtliches</h4>
            <ul className="space-y-3">
              {footerLinks.legale.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Risorse */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Ressourcen</h4>
            <ul className="space-y-3">
              {footerLinks.risorse.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} easycontracts Swiss. Alle Rechte vorbehalten.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-2">
            Entwickelt mit <span className="text-red-500">❤️</span> von{" "}
            <a 
              href="https://www.errakui.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 font-medium"
            >
              errakui.dev
            </a>
            {" "}🇨🇭
          </p>
        </div>
      </div>
    </footer>
  );
}
