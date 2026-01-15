export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.easycontracts.tech/#website",
        url: "https://www.easycontracts.tech",
        name: "easycontracts",
        description: "Genera contratti legali italiani con intelligenza artificiale in 30 secondi",
        publisher: {
          "@id": "https://www.easycontracts.tech/#organization",
        },
        inLanguage: "it-IT",
      },
      {
        "@type": "Organization",
        "@id": "https://www.easycontracts.tech/#organization",
        name: "easycontracts",
        url: "https://www.easycontracts.tech",
        logo: {
          "@type": "ImageObject",
          url: "https://www.easycontracts.tech/logo.png",
        },
        sameAs: [],
      },
      {
        "@type": "SoftwareApplication",
        name: "easycontracts",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: [
          {
            "@type": "Offer",
            name: "Piano Free",
            price: "0",
            priceCurrency: "EUR",
            description: "1 contratto gratuito con watermark",
          },
          {
            "@type": "Offer",
            name: "Piano PRO",
            price: "19",
            priceCurrency: "EUR",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "19",
              priceCurrency: "EUR",
              unitText: "mese",
            },
            description: "10 contratti al mese senza watermark",
          },
          {
            "@type": "Offer",
            name: "Piano Business",
            price: "49",
            priceCurrency: "EUR",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "49",
              priceCurrency: "EUR",
              unitText: "mese",
            },
            description: "Contratti illimitati per aziende",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "127",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "I contratti generati sono legalmente validi?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "I contratti sono generati seguendo le linee guida del Codice Civile italiano. Sono bozze professionali che consigliamo di far verificare da un legale per situazioni particolarmente complesse.",
            },
          },
          {
            "@type": "Question",
            name: "Come funziona la generazione con AI?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Compili un form con i dati delle parti e i dettagli del contratto. La nostra AI, addestrata su 500+ template e la normativa italiana vigente, genera un contratto completo in circa 30 secondi.",
            },
          },
          {
            "@type": "Question",
            name: "Quali tipi di contratti posso generare?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Offriamo 500+ template: NDA, contratti freelance, consulenza, sviluppo software, affitto, compravendita, e-commerce, privacy policy, e molti altri.",
            },
          },
          {
            "@type": "Question",
            name: "Posso modificare i contratti dopo la generazione?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sì, ogni contratto include una revisione gratuita. Puoi descrivere le modifiche e l'AI aggiornerà il documento.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

