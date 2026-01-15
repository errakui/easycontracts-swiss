export interface ContractType {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  popular?: boolean;
  free?: boolean; // true = disponibile nel piano Free
}

export interface ContractClause {
  id: string;
  title: string;
  description: string;
  required: boolean;
  pro?: boolean; // true = richiede piano PRO
}

export const contractCategories = [
  { id: "lavoro", name: "Lavoro & Freelance", icon: "💼" },
  { id: "business", name: "Business", icon: "🏢" },
  { id: "immobiliare", name: "Immobiliare", icon: "🏠" },
  { id: "tech", name: "Tech & Digital", icon: "💻" },
  { id: "privati", name: "Privati", icon: "📄" },
];

export const contractTypes: ContractType[] = [
  // LAVORO & FREELANCE (Free: solo questi 3)
  {
    id: "freelance",
    name: "Contratto Freelance Base",
    description: "Collaborazione professionale con partita IVA",
    category: "lavoro",
    icon: "💼",
    popular: true,
    free: true,
  },
  {
    id: "nda",
    name: "Accordo di Riservatezza (NDA)",
    description: "Protezione dati sensibili e confidenziali",
    category: "lavoro",
    icon: "🔒",
    popular: true,
    free: true,
  },
  {
    id: "lettera-incarico",
    name: "Lettera di Incarico",
    description: "Incarico professionale semplice",
    category: "lavoro",
    icon: "📋",
    free: true,
  },
  
  // LAVORO - PRO (bloccati)
  {
    id: "contratto-progetto",
    name: "Contratto a Progetto",
    description: "Collaborazione a progetto con scadenza",
    category: "lavoro",
    icon: "📊",
    popular: true,
  },
  {
    id: "consulenza",
    name: "Contratto di Consulenza",
    description: "Prestazione consulenziale professionale",
    category: "lavoro",
    icon: "💡",
  },
  {
    id: "collaborazione-continuativa",
    name: "Collaborazione Coordinata e Continuativa",
    description: "Co.co.co. secondo normativa italiana",
    category: "lavoro",
    icon: "📝",
  },
  {
    id: "lavoro-autonomo",
    name: "Contratto Lavoro Autonomo Occasionale",
    description: "Prestazione occasionale senza P.IVA",
    category: "lavoro",
    icon: "⚡",
  },
  {
    id: "contratto-tempo-determinato",
    name: "Contratto a Tempo Determinato",
    description: "Assunzione dipendente con scadenza",
    category: "lavoro",
    icon: "📅",
  },
  {
    id: "contratto-apprendistato",
    name: "Contratto di Apprendistato",
    description: "Formazione e lavoro per giovani",
    category: "lavoro",
    icon: "🎓",
  },
  {
    id: "patto-non-concorrenza",
    name: "Patto di Non Concorrenza",
    description: "Vincolo post-collaborazione",
    category: "lavoro",
    icon: "⛔",
  },
  {
    id: "contratto-stage",
    name: "Convenzione di Stage/Tirocinio",
    description: "Esperienza formativa aziendale",
    category: "lavoro",
    icon: "🎯",
  },

  // BUSINESS (Free: solo 1)
  {
    id: "accordo-collaborazione",
    name: "Accordo di Collaborazione Base",
    description: "Collaborazione semplice tra parti",
    category: "business",
    icon: "🤝",
    free: true,
  },
  
  // BUSINESS - PRO (bloccati)
  {
    id: "fornitura",
    name: "Contratto di Fornitura",
    description: "Accordo per fornitura beni/servizi",
    category: "business",
    icon: "📦",
    popular: true,
  },
  {
    id: "partnership",
    name: "Accordo di Partnership",
    description: "Collaborazione strategica tra aziende",
    category: "business",
    icon: "🤝",
    popular: true,
  },
  {
    id: "distribuzione",
    name: "Contratto di Distribuzione",
    description: "Accordo per distribuzione prodotti",
    category: "business",
    icon: "🚚",
  },
  {
    id: "agenzia",
    name: "Contratto di Agenzia",
    description: "Mandato di rappresentanza commerciale",
    category: "business",
    icon: "🎭",
  },
  {
    id: "franchising",
    name: "Contratto di Franchising",
    description: "Licenza modello business",
    category: "business",
    icon: "🏪",
  },
  {
    id: "mandato",
    name: "Contratto di Mandato",
    description: "Rappresentanza con procura",
    category: "business",
    icon: "⚖️",
  },
  {
    id: "consorzio",
    name: "Contratto di Consorzio",
    description: "Aggregazione tra imprese",
    category: "business",
    icon: "🏢",
  },
  {
    id: "joint-venture",
    name: "Joint Venture Agreement",
    description: "Società comune per progetto specifico",
    category: "business",
    icon: "🔗",
  },
  {
    id: "cessione-azienda",
    name: "Preliminare Cessione Azienda",
    description: "Vendita attività commerciale",
    category: "business",
    icon: "💼",
  },
  {
    id: "cessione-quote",
    name: "Cessione Quote Sociali",
    description: "Trasferimento partecipazioni societarie",
    category: "business",
    icon: "📊",
  },
  {
    id: "sponsorizzazione",
    name: "Contratto di Sponsorizzazione",
    description: "Accordo pubblicitario e visibilità",
    category: "business",
    icon: "📢",
  },

  // IMMOBILIARE - PRO (tutti bloccati)
  {
    id: "affitto",
    name: "Contratto di Affitto Residenziale",
    description: "Locazione immobile residenziale",
    category: "immobiliare",
    icon: "🏠",
    popular: true,
  },
  {
    id: "affitto-commerciale",
    name: "Affitto Commerciale/Uso Ufficio",
    description: "Locazione per attività commerciali",
    category: "immobiliare",
    icon: "🏢",
  },
  {
    id: "comodato",
    name: "Comodato d'Uso Gratuito",
    description: "Concessione immobile senza canone",
    category: "immobiliare",
    icon: "🔑",
  },
  {
    id: "preliminare-vendita",
    name: "Preliminare di Vendita Immobiliare",
    description: "Compromesso acquisto casa",
    category: "immobiliare",
    icon: "📝",
  },
  {
    id: "sublocazione",
    name: "Contratto di Sublocazione",
    description: "Riaffitto da parte del conduttore",
    category: "immobiliare",
    icon: "🔄",
  },
  {
    id: "affitto-breve",
    name: "Locazione Breve Turistico",
    description: "Airbnb e affitti turistici <30gg",
    category: "immobiliare",
    icon: "🏖️",
  },

  // TECH & DIGITAL - PRO (tutti bloccati)
  {
    id: "sviluppo-software",
    name: "Sviluppo Software Custom",
    description: "Contratto per sviluppo applicazioni",
    category: "tech",
    icon: "💻",
    popular: true,
  },
  {
    id: "sviluppo-website",
    name: "Sviluppo Sito Web",
    description: "Creazione e design website",
    category: "tech",
    icon: "🌐",
  },
  {
    id: "manutenzione-software",
    name: "Manutenzione e Supporto Software",
    description: "Assistenza tecnica continuativa",
    category: "tech",
    icon: "🔧",
  },
  {
    id: "licenza-software",
    name: "Licenza d'Uso Software",
    description: "Concessione diritti utilizzo",
    category: "tech",
    icon: "📜",
  },
  {
    id: "saas-subscription",
    name: "SaaS Subscription Agreement",
    description: "Servizio software in abbonamento",
    category: "tech",
    icon: "☁️",
  },
  {
    id: "privacy-policy",
    name: "Privacy Policy GDPR",
    description: "Informativa privacy conforme",
    category: "tech",
    icon: "🛡️",
  },
  {
    id: "cookie-policy",
    name: "Cookie Policy",
    description: "Informativa utilizzo cookie",
    category: "tech",
    icon: "🍪",
  },
  {
    id: "terms-conditions",
    name: "Termini e Condizioni E-commerce",
    description: "T&C per shop online",
    category: "tech",
    icon: "🛒",
  },
  {
    id: "app-tos",
    name: "Terms of Service App Mobile",
    description: "Condizioni utilizzo applicazione",
    category: "tech",
    icon: "📱",
  },
  {
    id: "api-agreement",
    name: "API Service Agreement",
    description: "Accesso e utilizzo API",
    category: "tech",
    icon: "🔌",
  },
  {
    id: "hosting-agreement",
    name: "Web Hosting Agreement",
    description: "Servizi di hosting e server",
    category: "tech",
    icon: "🖥️",
  },
  {
    id: "digital-marketing",
    name: "Contratto Digital Marketing",
    description: "Servizi SEO, ADS, Social Media",
    category: "tech",
    icon: "📈",
  },
  {
    id: "influencer-contract",
    name: "Contratto Influencer Marketing",
    description: "Collaborazione con creator",
    category: "tech",
    icon: "📸",
  },

  // PRIVATI - PRO (tutti bloccati)
  {
    id: "prestito",
    name: "Prestito tra Privati",
    description: "Accordo per prestito di denaro",
    category: "privati",
    icon: "💰",
  },
  {
    id: "compravendita-auto",
    name: "Compravendita Veicolo",
    description: "Vendita auto, moto, mezzo",
    category: "privati",
    icon: "🚗",
  },
  {
    id: "separazione",
    name: "Accordo di Separazione Consensuale",
    description: "Separazione coniugi",
    category: "privati",
    icon: "💔",
  },
  {
    id: "donazione",
    name: "Contratto di Donazione",
    description: "Trasferimento gratuito beni",
    category: "privati",
    icon: "🎁",
  },
  {
    id: "mantenimento",
    name: "Accordo di Mantenimento",
    description: "Obblighi economici familiari",
    category: "privati",
    icon: "👨‍👩‍👧",
  },
  {
    id: "testamento",
    name: "Testamento Olografo (Guida)",
    description: "Disposizioni successorie",
    category: "privati",
    icon: "📄",
  },
];

export const commonClauses: ContractClause[] = [
  // OBBLIGATORIE (sempre incluse)
  {
    id: "oggetto",
    title: "Oggetto del Contratto",
    description: "Definizione chiara dell'attività o servizio",
    required: true,
  },
  {
    id: "durata",
    title: "Durata e Scadenza",
    description: "Periodo di validità del contratto",
    required: true,
  },
  {
    id: "compenso",
    title: "Compenso e Pagamento",
    description: "Importo, modalità e tempi di pagamento",
    required: true,
  },
  
  // FREE - Selezionabili gratis
  {
    id: "obblighi",
    title: "Obblighi delle Parti",
    description: "Responsabilità di ciascuna parte",
    required: false,
  },
  {
    id: "riservatezza",
    title: "Clausola di Riservatezza",
    description: "Protezione informazioni sensibili",
    required: false,
  },
  
  // PRO - Richiedono abbonamento
  {
    id: "risoluzione",
    title: "Risoluzione Anticipata",
    description: "Condizioni per interrompere il contratto",
    required: false,
    pro: true,
  },
  {
    id: "controversie",
    title: "Risoluzione Controversie",
    description: "Foro competente e modalità di arbitrato",
    required: false,
    pro: true,
  },
  {
    id: "proprieta-intellettuale",
    title: "Proprietà Intellettuale",
    description: "Diritti su opere e creazioni",
    required: false,
    pro: true,
  },
  {
    id: "penale",
    title: "Clausola Penale",
    description: "Penalità economica per inadempimento",
    required: false,
    pro: true,
  },
  {
    id: "forza-maggiore",
    title: "Forza Maggiore",
    description: "Eventi imprevedibili che impediscono l'esecuzione",
    required: false,
    pro: true,
  },
  {
    id: "esclusiva",
    title: "Clausola di Esclusiva",
    description: "Divieto di collaborare con concorrenti",
    required: false,
    pro: true,
  },
  {
    id: "recesso",
    title: "Diritto di Recesso",
    description: "Possibilità di uscire dal contratto con preavviso",
    required: false,
    pro: true,
  },
  {
    id: "garanzia",
    title: "Garanzia sui Risultati",
    description: "Impegno sulla qualità del lavoro svolto",
    required: false,
    pro: true,
  },
  {
    id: "limitazione-responsabilita",
    title: "Limitazione di Responsabilità",
    description: "Tetto massimo ai danni risarcibili",
    required: false,
    pro: true,
  },
  {
    id: "gdpr",
    title: "Conformità GDPR",
    description: "Trattamento dati personali secondo normativa",
    required: false,
    pro: true,
  },
];

export function getContractsByCategory(categoryId: string): ContractType[] {
  return contractTypes.filter((c) => c.category === categoryId);
}

export function getPopularContracts(): ContractType[] {
  return contractTypes.filter((c) => c.popular);
}

export function getFreeContracts(): ContractType[] {
  return contractTypes.filter((c) => c.free);
}

export function getProContracts(): ContractType[] {
  return contractTypes.filter((c) => !c.free);
}

