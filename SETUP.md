# 🚀 Setup Rapido - easycontract

## ✅ Installazione Completata!

Tutte le dipendenze sono state installate con successo.

---

## 🎯 Avvia l'Applicazione

### Opzione 1: Modalità Sviluppo

```bash
npm run dev
```

Poi apri il browser su: **http://localhost:3000**

### Opzione 2: Build Production

```bash
npm run build
npm start
```

---

## 🎨 Cosa Troverai

### Homepage (/)
- **Hero Section Provocatorio**: "Smetti di Pagare €800 per un Contratto"
- **Sezione Problema**: Pain points evidenziati
- **Come Funziona**: 5 step chiari
- **Contratti Popolari**: Con link diretti
- **Pricing**: 3 piani (Free, Pro, Business)
- **CTA Finale**: Call-to-action forte

### Generatore Contratti (/generate)
1. **Step 1 - Tipo**: Scegli tra 30+ template categorizzati
2. **Step 2 - Parti**: Inserisci dati di chi firma
3. **Step 3 - Dettagli**: Oggetto, compenso, durata
4. **Step 4 - Clausole**: Personalizza con clausole opzionali
5. **Step 5 - Generazione**: AI genera il contratto (simulato)
6. **Step 6 - Preview**: Visualizza e scarica PDF

---

## 🎨 Colori Brand

### Verde (Primario)
- `#22c55e` - Verde principale
- `#16a34a` - Verde scuro
- `#4ade80` - Verde chiaro

### Grigio (Secondario)
- `#111827` - Grigio scurissimo
- `#1f2937` - Grigio scuro
- `#6b7280` - Grigio medio
- `#f3f4f6` - Grigio chiaro

---

## 📱 Features Implementate

✅ Design responsive (mobile + desktop)
✅ Homepage provocatoria e coinvolgente
✅ Flow completo generazione contratti (5 step)
✅ 30+ template contratti categorizzati
✅ Sistema di clausole personalizzabili
✅ Generazione contratto (simulata)
✅ Preview e download contratto
✅ Navbar con navigazione smooth
✅ Footer completo
✅ Animazioni e transizioni
✅ Sistema di colori grigio-verde professionale

---

## 🔮 Prossime Features da Implementare

### Fase 2 (Integrazioni Reali)
- [ ] Integrazione OpenAI/Claude API per generazione AI reale
- [ ] Autenticazione con NextAuth
- [ ] Database Supabase per salvare contratti
- [ ] Stripe per pagamenti
- [ ] Export PDF professionale con firma digitale

### Fase 3 (Advanced)
- [ ] Dashboard utente
- [ ] Storico contratti
- [ ] Team workspace
- [ ] Analisi contratti con upload
- [ ] Multi-lingua

---

## 📂 Struttura File Principali

```
app/
├── page.tsx              # Homepage con hero, features, pricing
├── generate/page.tsx     # Flow generazione contratti (5 step)
├── layout.tsx           # Layout con metadata
└── globals.css          # Stili globali + utility classes

components/
├── Navbar.tsx           # Navigazione top
├── Footer.tsx           # Footer con link e disclaimer
├── StatsBar.tsx         # Barra statistiche
└── ContractPrompt.tsx   # Componente prompt AI

lib/
├── contracts.ts         # Database contratti e categorie
└── utils.ts            # Utility functions
```

---

## 🎯 Obiettivi Progetto

### Business
- **Target**: Freelancer, PMI, Startup, Privati
- **Problema**: Contratti costosi (€800) e lenti (7 giorni)
- **Soluzione**: Generazione AI in 30 secondi a €19/mese
- **Mercato**: Italia (50-100M€), espandibile EU

### Tecnico
- **Stack**: Next.js 14 + TypeScript + Tailwind
- **AI**: OpenAI GPT-4 / Anthropic Claude
- **Hosting**: Vercel
- **Database**: Supabase
- **Payments**: Stripe

---

## 💡 Tips

### Personalizzazione Colori
Modifica `tailwind.config.ts` per cambiare la palette:
```typescript
colors: {
  primary: { ... },  // Cambia qui per altri colori
  gray: { ... },
}
```

### Aggiungere Nuovi Contratti
Modifica `lib/contracts.ts`:
```typescript
export const contractTypes: ContractType[] = [
  {
    id: "nuovo-contratto",
    name: "Nome Contratto",
    description: "Descrizione",
    category: "lavoro",
    icon: "🔥",
  },
  // ... altri
];
```

### Modificare Homepage
Tutto in `app/page.tsx` - modifica sezioni, testi, CTA

---

## 🐛 Troubleshooting

### Port già in uso
```bash
# Cambia porta
PORT=3001 npm run dev
```

### Cache problematica
```bash
rm -rf .next
npm run dev
```

### Dipendenze mancanti
```bash
rm -rf node_modules
npm install
```

---

## 📞 Supporto

Per domande o problemi:
- **Email**: info@easycontract.it
- **GitHub Issues**: (questo repo)

---

**Buon divertimento! 🚀💚**

