# 🚀 easycontract

**Contratti Intelligenti per Tutti** - Genera contratti legali professionali in 30 secondi con l'intelligenza artificiale.

![easycontract](https://img.shields.io/badge/version-1.0.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)

---

## 📋 Caratteristiche

- ⚡ **Generazione AI**: Contratti professionali in 30 secondi
- 🎨 **Design Moderno**: UI grigio-verde pulita e professionale
- 📝 **30+ Template**: Freelance, NDA, Business, Tech, Immobiliare
- 🔒 **Conforme**: Segue la legge italiana
- 💰 **Accessibile**: Da €19/mese invece di €800 per contratto
- 📱 **Responsive**: Funziona su desktop e mobile

---

## 🛠️ Stack Tecnologico

| Tecnologia | Utilizzo |
|------------|----------|
| **Next.js 14** | Framework React con SSR |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling utility-first |
| **Lucide Icons** | Icone moderne |
| **Framer Motion** | Animazioni fluide |

---

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+ installato
- npm o yarn

### Installazione

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia il server di sviluppo
npm run dev

# 3. Apri il browser
# http://localhost:3000
```

L'app sarà disponibile su **http://localhost:3000** 🎉

---

## 📁 Struttura del Progetto

```
easycontracts/
├── app/
│   ├── page.tsx              # Homepage provocatoria
│   ├── generate/
│   │   └── page.tsx          # Flow generazione contratti
│   ├── layout.tsx            # Layout principale
│   └── globals.css           # Stili globali
├── components/
│   ├── Navbar.tsx            # Navigazione
│   ├── Footer.tsx            # Footer
│   └── StatsBar.tsx          # Barra statistiche
├── lib/
│   ├── utils.ts              # Utility functions
│   └── contracts.ts          # Database contratti
└── public/                   # Asset statici
```

---

## 🎨 Palette Colori

### Verde Primario
- `primary-400`: `#4ade80`
- `primary-500`: `#22c55e` ✨
- `primary-600`: `#16a34a`
- `primary-700`: `#15803d`

### Grigi
- `gray-50`: `#f9fafb`
- `gray-100`: `#f3f4f6`
- `gray-800`: `#1f2937`
- `gray-900`: `#111827`

---

## 📝 Come Funziona

### 1. **Seleziona il Tipo di Contratto**
Scegli tra 30+ template: Freelance, NDA, Partnership, Affitto, Software, ecc.

### 2. **Inserisci le Parti**
Nome, email, P.IVA di chi firma il contratto.

### 3. **Compila i Dettagli**
Oggetto, compenso, durata, data di inizio.

### 4. **Scegli le Clausole**
Riservatezza, proprietà intellettuale, risoluzione anticipata, ecc.

### 5. **Genera con AI**
L'intelligenza artificiale crea il contratto completo in 30 secondi.

### 6. **Scarica & Firma**
PDF pronto per il download e la firma digitale.

---

## 🔥 Funzionalità Principali

### Homepage Provocatoria
- Hero section impattante con CTA forte
- Sezione "Problema" che evidenzia i pain points
- "Come Funziona" con 5 step chiari
- Contratti popolari in evidenza
- Testimonianze utenti
- Pricing trasparente

### Flow di Generazione
- **Step 1**: Selezione tipologia (categorizzata)
- **Step 2**: Dati delle parti contraenti
- **Step 3**: Dettagli del contratto
- **Step 4**: Clausole personalizzabili
- **Step 5**: Generazione AI con animazione
- **Step 6**: Preview e download PDF

### Template Contratti

#### 💼 Lavoro & Freelance
- Contratto Freelance
- NDA (Accordo di Riservatezza)
- Lettera di Incarico
- Contratto a Progetto

#### 🏢 Business
- Contratto di Fornitura
- Accordo di Partnership
- Termini e Condizioni
- Contratto di Agenzia

#### 🏠 Immobiliare
- Contratto di Affitto
- Comodato d'Uso
- Preliminare di Vendita

#### 💻 Tech & Digital
- Sviluppo Software
- Licenza Software
- Privacy Policy GDPR
- Cookie Policy

#### 📄 Privati
- Prestito tra Privati
- Compravendita Veicolo
- Accordo Separazione

---

## 🎯 Roadmap

### ✅ Fase 1 - MVP (COMPLETATA)
- [x] Homepage provocatoria
- [x] Flow generazione completo
- [x] 30+ template contratti
- [x] Sistema clausole
- [x] Design responsive

### 🚧 Fase 2 - Launch (Next)
- [ ] Integrazione OpenAI/Claude API
- [ ] Sistema autenticazione
- [ ] Database Supabase
- [ ] Stripe payments
- [ ] Export PDF professionale

### 🔮 Fase 3 - Growth
- [ ] Firma digitale eIDAS
- [ ] Analisi contratti upload
- [ ] Team workspace
- [ ] Referral program
- [ ] Partnership commercialisti

### 🌍 Fase 4 - Scale
- [ ] Multi-lingua (EN, DE, FR, ES)
- [ ] API pubblica
- [ ] White label
- [ ] App mobile
- [ ] Marketplace template community

---

## 💰 Modello di Business

| Piano | Prezzo | Features |
|-------|--------|----------|
| **Free** | €0 | 1 contratto, watermark |
| **Pro** | €19/mese | 10 contratti/mese, AI illimitata |
| **Business** | €49/mese | Illimitato, team, white label |
| **Enterprise** | Custom | API, SLA, account manager |

**Target ROI**: Break-even in 6-12 mesi con 400-800 utenti paganti.

---

## 🚀 Deploy

### Vercel (Raccomandato)

```bash
# 1. Installa Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Production
vercel --prod
```

### Build Locale

```bash
npm run build
npm start
```

---

## 🔐 Variabili d'Ambiente

Crea un file `.env.local`:

```env
# OpenAI (per AI generation - Fase 2)
OPENAI_API_KEY=sk-...

# Supabase (per database - Fase 2)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Stripe (per pagamenti - Fase 2)
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

---

## ⚠️ Disclaimer Legale

**easycontract non fornisce consulenza legale.**

I contratti generati sono template informativi basati su intelligenza artificiale. Per questioni legali complesse, si consiglia sempre di consultare un avvocato professionista.

---

## 📞 Contatti

- **Website**: (da definire)
- **Email**: info@easycontract.it
- **GitHub**: (questo repository)

---

## 📄 Licenza

© 2024 easycontract - Errakui Holding Ltd. Tutti i diritti riservati.

---

## 🙏 Ringraziamenti

Sviluppato con ❤️ usando:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Vercel](https://vercel.com/)

---

**Made with 💚 in Italy**

