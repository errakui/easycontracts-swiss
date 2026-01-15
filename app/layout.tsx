import type { Metadata } from "next";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.easycontracts.ch"),
  title: {
    default: "easycontracts Swiss - Verträge mit KI in 30 Sekunden | Contrats Suisses",
    template: "%s | easycontracts Swiss"
  },
  description: "Erstellen Sie rechtsgültige Schweizer Verträge in 30 Sekunden mit KI. 500+ Vorlagen konform zum OR und ZGB. Arbeitsvertrag, Mietvertrag, NDA und mehr. Ab CHF 29/Monat.",
  keywords: [
    "Schweizer Verträge",
    "Vertragsgenerator",
    "Arbeitsvertrag Schweiz",
    "Mietvertrag Schweiz",
    "NDA Schweiz",
    "contrats suisses",
    "contrat de travail",
    "contrat de bail",
    "contratti svizzeri",
    "contratto di lavoro Svizzera",
    "Swiss contracts AI",
    "OR ZGB Verträge"
  ],
  authors: [{ name: "easycontracts Swiss", url: "https://www.easycontracts.ch" }],
  creator: "easycontracts Swiss",
  publisher: "easycontracts Swiss",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.easycontracts.ch",
  },
  openGraph: {
    title: "easycontracts Swiss - Schweizer Verträge mit KI 🇨🇭",
    description: "Generieren Sie professionelle Schweizer Verträge mit KI. 500+ Vorlagen konform zu OR & ZGB. Arbeitsvertrag, Mietvertrag, NDA. Jetzt gratis testen!",
    url: "https://www.easycontracts.ch",
    siteName: "easycontracts Swiss",
    locale: "de_CH",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "easycontracts Swiss - Verträge mit KI 🇨🇭",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "easycontracts Swiss - Schweizer Verträge mit KI 🇨🇭",
    description: "Schweizer Verträge mit KI. 500+ Vorlagen. Jetzt gratis testen!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-CH" className="dark">
      <head>
        {/* Preload Fonts */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&f[]=cabinet-grotesk@400,500,700,800,900&display=swap" 
          rel="stylesheet"
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-[#0a0505] text-gray-100 antialiased">
        <JsonLd />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
