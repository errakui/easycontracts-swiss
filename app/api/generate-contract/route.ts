import { NextRequest, NextResponse } from "next/server";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

interface ContractData {
  type: string;
  typeName: string;
  party1Name: string;
  party1Email: string;
  party1Vat: string;
  party1Address: string;
  party1City: string;
  party2Name: string;
  party2Email: string;
  party2Vat: string;
  party2Address: string;
  party2City: string;
  amount: string;
  paymentMethod: string;
  paymentTerms: string;
  duration: string;
  durationType: string;
  startDate: string;
  endDate: string;
  description: string;
  deliverables: string;
  workLocation: string;
  workHours: string;
  selectedClauses: string[];
  customRequests: string;
}

// PROMPT PROFESSIONALE - Stile Studio Legale Italiano
const SYSTEM_PROMPT = `Sei un avvocato civilista italiano con 30 anni di esperienza nella redazione di contratti commerciali e professionali.

LA TUA SPECIALIZZAZIONE:
- Diritto civile italiano (Codice Civile)
- Diritto commerciale e societario
- Contrattualistica d'impresa
- Tutela della proprietà intellettuale
- Normativa fiscale italiana
- GDPR e protezione dati personali
- Diritto del lavoro autonomo e parasubordinato

STILE DI SCRITTURA:
- Linguaggio giuridico MEDIO-ALTO: formale ma comprensibile
- Frasi strutturate, mai ambigue
- Terminologia tecnico-giuridica appropriata
- Evita arcaismi inutili, ma mantieni la formalità
- Ogni clausola deve essere chiara e applicabile

STRUTTURA OBBLIGATORIA DEL CONTRATTO:
1. INTESTAZIONE con tipo contratto e data
2. PREMESSE (Visto che..., Considerato che..., Tutto ciò premesso...)
3. ARTICOLI NUMERATI (Art. 1, Art. 2, ecc.)
4. CLAUSOLE FINALI (foro competente, comunicazioni, modifiche)
5. DATA, LUOGO E FIRME

RIFERIMENTI NORMATIVI DA INCLUDERE (quando appropriati):
- Art. 1321-1469 c.c. (Contratti in generale)
- Art. 2222-2228 c.c. (Contratto d'opera)
- Art. 2229-2238 c.c. (Professioni intellettuali)
- Art. 1655-1677 c.c. (Appalto)
- Art. 1571-1654 c.c. (Locazione)
- Art. 1470-1547 c.c. (Vendita)
- D.Lgs. 81/2015 (Jobs Act - collaborazioni)
- Reg. UE 2016/679 (GDPR)
- L. 633/1941 (Diritto d'autore)

REGOLE INDEROGABILI:
1. NON usare mai placeholder come [inserire], [specificare], [...]
2. Compila TUTTO con i dati forniti dal cliente
3. Se manca un dato, scrivi "da definirsi tra le parti" o ometti la clausola
4. Ogni articolo deve avere un TITOLO chiaro
5. Usa numerazione progressiva coerente
6. Il contratto deve essere PRONTO PER LA FIRMA
7. Includi sempre la clausola sulla privacy/GDPR
8. Specifica SEMPRE il foro competente`;

export async function POST(req: NextRequest) {
  try {
    const data: ContractData = await req.json();

    if (!PERPLEXITY_API_KEY) {
      console.log("⚠️ PERPLEXITY_API_KEY non configurata, uso template fallback");
      return NextResponse.json({ 
        contract: generateProfessionalFallback(data),
        source: "template"
      });
    }

    const userPrompt = buildIntelligentPrompt(data);

    console.log("🤖 Chiamata Perplexity AI con sonar-pro...");

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro", // Modello più avanzato
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1, // Bassa per precisione legale
        max_tokens: 8000, // Contratti lunghi
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ Errore Perplexity API:", error);
      return NextResponse.json({ 
        contract: generateProfessionalFallback(data),
        source: "template"
      });
    }

    const result = await response.json();
    const contractText = result.choices[0]?.message?.content;

    if (!contractText) {
      console.error("❌ Risposta vuota da Perplexity");
      return NextResponse.json({ 
        contract: generateProfessionalFallback(data),
        source: "template"
      });
    }

    console.log("✅ Contratto generato con AI");

    return NextResponse.json({ 
      contract: contractText,
      source: "ai"
    });

  } catch (error: any) {
    console.error("❌ Errore generazione contratto:", error);
    return NextResponse.json(
      { error: "Errore nella generazione del contratto. Riprova." },
      { status: 500 }
    );
  }
}

function buildIntelligentPrompt(data: ContractData): string {
  // Mappa clausole a descrizioni legali complete
  const clauseMap: Record<string, string> = {
    "riservatezza": "Clausola di riservatezza e non divulgazione (NDA) - Le parti si impegnano a non divulgare informazioni confidenziali acquisite durante l'esecuzione del contratto",
    "proprieta-intellettuale": "Clausola sulla proprietà intellettuale - Definizione della titolarità dei diritti d'autore, brevetti, marchi e know-how derivanti dall'esecuzione del contratto",
    "penale": "Clausola penale ex art. 1382 c.c. - Predeterminazione del risarcimento in caso di inadempimento",
    "recesso": "Clausola di recesso unilaterale - Facoltà di scioglimento anticipato del vincolo contrattuale con preavviso",
    "forza-maggiore": "Clausola di forza maggiore - Esonero da responsabilità per eventi imprevedibili e inevitabili (art. 1218 c.c.)",
    "esclusiva": "Clausola di esclusiva - Impegno a non instaurare rapporti analoghi con soggetti concorrenti",
    "garanzia": "Clausola di garanzia - Impegni del prestatore sulla qualità e conformità delle prestazioni",
    "limitazione-responsabilita": "Limitazione di responsabilità - Tetto massimo al risarcimento danni (nel rispetto dell'art. 1229 c.c.)",
    "gdpr": "Clausola GDPR - Trattamento dei dati personali conforme al Reg. UE 2016/679",
    "audit": "Clausola di audit - Diritto di verifica e controllo sull'esecuzione delle prestazioni",
  };

  const selectedClausesText = data.selectedClauses
    .map(c => clauseMap[c] || c)
    .join("\n- ");

  // Determina tipo specifico di contratto per istruzioni mirate
  const contractInstructions = getContractSpecificInstructions(data.type);

  return `GENERA UN CONTRATTO PROFESSIONALE ITALIANO

═══════════════════════════════════════════════════════════════
TIPO CONTRATTO: ${data.typeName.toUpperCase()}
═══════════════════════════════════════════════════════════════

DATI PARTE PRIMA (COMMITTENTE/CLIENTE/LOCATORE):
• Denominazione: ${data.party1Name}
• Codice Fiscale/P.IVA: ${data.party1Vat || "persona fisica"}
• Sede/Residenza: ${data.party1Address ? `${data.party1Address}, ${data.party1City}` : "da specificare in sede di firma"}
• Email PEC/ordinaria: ${data.party1Email || "da comunicare"}

DATI PARTE SECONDA (PRESTATORE/FORNITORE/CONDUTTORE):
• Denominazione: ${data.party2Name}
• Codice Fiscale/P.IVA: ${data.party2Vat || "persona fisica"}
• Sede/Residenza: ${data.party2Address ? `${data.party2Address}, ${data.party2City}` : "da specificare in sede di firma"}
• Email PEC/ordinaria: ${data.party2Email || "da comunicare"}

═══════════════════════════════════════════════════════════════
OGGETTO E CONTENUTO DELLA PRESTAZIONE:
═══════════════════════════════════════════════════════════════
${data.description}

${data.deliverables ? `DELIVERABLES/OUTPUT ATTESI:\n${data.deliverables}` : ""}

═══════════════════════════════════════════════════════════════
ASPETTI ECONOMICI:
═══════════════════════════════════════════════════════════════
• Corrispettivo pattuito: € ${data.amount} (+ IVA se dovuta)
• Modalità di pagamento: ${data.paymentMethod || "bonifico bancario"}
• Termini di pagamento: ${data.paymentTerms || "30 giorni data fattura"}

═══════════════════════════════════════════════════════════════
DURATA E TEMPISTICHE:
═══════════════════════════════════════════════════════════════
• Durata: ${data.duration ? `${data.duration} ${data.durationType || ""}` : "da definire"}
• Decorrenza: ${data.startDate ? new Date(data.startDate).toLocaleDateString("it-IT") : "dalla sottoscrizione"}
• Scadenza: ${data.endDate ? new Date(data.endDate).toLocaleDateString("it-IT") : "come da durata"}
${data.workLocation ? `• Luogo di esecuzione: ${data.workLocation}` : ""}
${data.workHours ? `• Orari/disponibilità: ${data.workHours}` : ""}

═══════════════════════════════════════════════════════════════
CLAUSOLE SPECIFICHE RICHIESTE DAL CLIENTE:
═══════════════════════════════════════════════════════════════
${selectedClausesText ? `- ${selectedClausesText}` : "Clausole standard per questo tipo di contratto"}

${data.customRequests ? `
═══════════════════════════════════════════════════════════════
RICHIESTE PERSONALIZZATE:
═══════════════════════════════════════════════════════════════
${data.customRequests}
` : ""}

═══════════════════════════════════════════════════════════════
ISTRUZIONI PER LA REDAZIONE:
═══════════════════════════════════════════════════════════════
${contractInstructions}

STRUTTURA RICHIESTA:
1. Intestazione formale con tipo contratto
2. Identificazione completa delle parti
3. PREMESSE dettagliate (almeno 3-4 "Visto che..." / "Considerato che...")
4. ARTICOLI numerati (minimo 10-12 articoli):
   - Art. 1: Premesse (valore contrattuale)
   - Art. 2: Oggetto del contratto
   - Art. 3: Modalità di esecuzione
   - Art. 4: Durata e termini
   - Art. 5: Corrispettivo e pagamenti
   - Art. 6: Obblighi del Committente
   - Art. 7: Obblighi del Prestatore
   - Art. 8: Riservatezza (se richiesta)
   - Art. 9: Proprietà intellettuale (se applicabile)
   - Art. 10: Responsabilità e manleva
   - Art. 11: Risoluzione e recesso
   - Art. 12: Trattamento dati personali (GDPR)
   - Art. 13: Comunicazioni tra le parti
   - Art. 14: Clausola di salvaguardia
   - Art. 15: Foro competente e legge applicabile
   - Art. 16: Disposizioni finali
5. Data, luogo e spazio firme (con nome sotto ogni riga firma)

TONO: Giuridico formale ma LEGGIBILE. Un imprenditore deve capire cosa firma.
LUNGHEZZA: Contratto COMPLETO, non una bozza. Minimo 1500 parole.`;
}

function getContractSpecificInstructions(type: string): string {
  const instructions: Record<string, string> = {
    "freelance": `CONTRATTO DI COLLABORAZIONE PROFESSIONALE (Art. 2222 c.c.)
- Specifica che si tratta di lavoro AUTONOMO senza vincolo di subordinazione
- Indica libertà di organizzazione del lavoro
- Prevedi possibilità di avvalersi di collaboratori
- Includi clausola su assenza di esclusiva (salvo diversa richiesta)
- Cita D.Lgs. 81/2015 art. 2 per escludere etero-organizzazione`,

    "nda": `ACCORDO DI RISERVATEZZA (Non-Disclosure Agreement)
- Definisci con precisione cosa sono le "Informazioni Confidenziali"
- Specifica durata dell'obbligo (anche post-contrattuale)
- Prevedi eccezioni (info già pubbliche, ordine autorità)
- Indica penale per violazione
- Prevedi restituzione/distruzione documenti alla cessazione`,

    "consulenza": `CONTRATTO DI CONSULENZA PROFESSIONALE
- Specifica natura intellettuale della prestazione (art. 2229 c.c.)
- Indica eventuale iscrizione ad albo professionale
- Prevedi relazioni periodiche sull'attività
- Definisci limiti della consulenza vs decisioni operative
- Clausola su indipendenza di giudizio`,

    "affitto": `CONTRATTO DI LOCAZIONE (Art. 1571 c.c. e ss.)
- Specifica destinazione d'uso (abitativa/commerciale)
- Indica dati catastali dell'immobile
- Prevedi deposito cauzionale (max 3 mensilità)
- Clausola su spese condominiali e utenze
- Riferimento a L. 392/1978 o L. 431/1998 se applicabili
- Registro contratto e imposta di registro`,

    "vendita": `CONTRATTO DI COMPRAVENDITA (Art. 1470 c.c. e ss.)
- Descrivi dettagliatamente il bene oggetto di vendita
- Specifica garanzie del venditore (art. 1490 c.c.)
- Indica momento del trasferimento proprietà
- Prevedi passaggio del rischio
- Clausola su vizi occulti`,

    "appalto": `CONTRATTO D'APPALTO (Art. 1655 c.c. e ss.)
- Specifica opera da realizzare con dettaglio
- Indica materiali (a carico di chi)
- Prevedi stati avanzamento lavori (SAL)
- Clausola su varianti in corso d'opera
- Termine e penale per ritardo
- Collaudo e accettazione`,

    "partnership": `ACCORDO DI PARTNERSHIP COMMERCIALE
- Definisci obiettivi comuni della collaborazione
- Specifica apporti di ciascuna parte
- Prevedi governance (decisioni, riunioni)
- Clausola su ripartizione costi e ricavi
- Durata e rinnovo automatico
- Exit strategy`,

    "sviluppo-software": `CONTRATTO DI SVILUPPO SOFTWARE
- Specifica requisiti tecnici e funzionali
- Definisci milestone e deliverables
- Prevedi fase di testing e UAT
- Clausola su bug fixing post-consegna
- Proprietà del codice sorgente
- Licenze di terze parti utilizzate
- Manutenzione evolutiva/correttiva`,

    "social-media": `CONTRATTO DI GESTIONE SOCIAL MEDIA
- Definisci piattaforme gestite
- Specifica frequenza pubblicazioni
- Clausola su approvazione contenuti
- Proprietà dei contenuti creati
- Metriche e reportistica
- Gestione crisi reputazionale`,
  };

  return instructions[type] || `Genera un contratto completo e professionale per "${type}" secondo le best practice del diritto civile italiano.`;
}

// FALLBACK TEMPLATE PROFESSIONALE
function generateProfessionalFallback(data: ContractData): string {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long", 
    year: "numeric"
  });

  const startDateFormatted = data.startDate 
    ? new Date(data.startDate).toLocaleDateString("it-IT")
    : "dalla data di sottoscrizione del presente contratto";

  const endDateFormatted = data.endDate
    ? new Date(data.endDate).toLocaleDateString("it-IT")
    : "come da durata pattuita";

  return `
══════════════════════════════════════════════════════════════════════════════════
                              ${data.typeName?.toUpperCase() || "CONTRATTO"}
══════════════════════════════════════════════════════════════════════════════════
                              
                              Redatto in ${data.party1City || "___________"}
                              il ${formattedDate}

══════════════════════════════════════════════════════════════════════════════════
                              TRA LE PARTI
══════════════════════════════════════════════════════════════════════════════════

La presente scrittura privata viene stipulata

TRA

${data.party1Name}${data.party1Vat ? `, C.F./P.IVA ${data.party1Vat}` : ""}
${data.party1Address ? `con sede in ${data.party1Address}, ${data.party1City}` : ""}
${data.party1Email ? `PEC/email: ${data.party1Email}` : ""}
(di seguito denominata "COMMITTENTE" o "PARTE PRIMA")

E

${data.party2Name}${data.party2Vat ? `, C.F./P.IVA ${data.party2Vat}` : ""}
${data.party2Address ? `con sede in ${data.party2Address}, ${data.party2City}` : ""}
${data.party2Email ? `PEC/email: ${data.party2Email}` : ""}
(di seguito denominato/a "PRESTATORE" o "PARTE SECONDA")

congiuntamente definite le "Parti"

══════════════════════════════════════════════════════════════════════════════════
                              PREMESSE
══════════════════════════════════════════════════════════════════════════════════

VISTO CHE il COMMITTENTE necessita delle prestazioni professionali di seguito 
meglio descritte per il conseguimento dei propri scopi;

VISTO CHE il PRESTATORE dichiara di possedere le competenze tecniche, 
professionali e l'esperienza necessarie per l'espletamento dell'incarico;

CONSIDERATO CHE le Parti intendono regolamentare i reciproci rapporti in 
conformità alla normativa vigente ed in particolare agli artt. 2222 e seguenti 
del Codice Civile in materia di contratto d'opera;

CONSIDERATO CHE il PRESTATORE svolgerà la propria attività in piena autonomia 
organizzativa, senza alcun vincolo di subordinazione nei confronti del COMMITTENTE;

TUTTO CIÒ PREMESSO, le Parti come sopra identificate

                              CONVENGONO E STIPULANO QUANTO SEGUE

══════════════════════════════════════════════════════════════════════════════════
                              ARTICOLI
══════════════════════════════════════════════════════════════════════════════════

                    Art. 1 - VALORE DELLE PREMESSE

Le premesse e gli eventuali allegati costituiscono parte integrante e sostanziale 
del presente contratto e ne formano il primo patto.


                    Art. 2 - OGGETTO DEL CONTRATTO

Il COMMITTENTE conferisce al PRESTATORE, che accetta, l'incarico di svolgere 
la seguente prestazione professionale:

${data.description}

${data.deliverables ? `
Il PRESTATORE si impegna a consegnare i seguenti deliverables:
${data.deliverables}
` : ""}

Il PRESTATORE svolgerà l'incarico con la diligenza richiesta dalla natura 
dell'attività esercitata e dalle specifiche competenze professionali.


                    Art. 3 - MODALITÀ DI ESECUZIONE

Il PRESTATORE eseguirà le prestazioni oggetto del presente contratto:
- In piena autonomia organizzativa e operativa
- Senza alcun vincolo di subordinazione gerarchica
- Con facoltà di determinare liberamente tempi e modalità di esecuzione
- ${data.workLocation ? `Presso: ${data.workLocation}` : "Presso la propria sede o in modalità remota"}
${data.workHours ? `- Disponibilità: ${data.workHours}` : ""}

È facoltà del PRESTATORE avvalersi, sotto la propria responsabilità, di 
collaboratori e ausiliari per l'espletamento dell'incarico.


                    Art. 4 - DURATA DEL CONTRATTO

Il presente contratto ha durata di ${data.duration || "tempo determinato"} ${data.durationType || ""}.

Decorrenza: ${startDateFormatted}
Scadenza: ${endDateFormatted}

Alla scadenza, il contratto potrà essere rinnovato previo accordo scritto 
tra le Parti con congruo anticipo rispetto al termine.


                    Art. 5 - CORRISPETTIVO E MODALITÀ DI PAGAMENTO

5.1 Per le prestazioni oggetto del presente contratto, il COMMITTENTE si obbliga 
a corrispondere al PRESTATORE un compenso complessivo pari a:

                    € ${data.amount} (euro ${numberToWords(parseFloat(data.amount) || 0)}/00)

oltre IVA se dovuta ai sensi di legge e contributi previdenziali se applicabili.

5.2 Il pagamento avverrà con le seguenti modalità:
- Metodo: ${data.paymentMethod || "bonifico bancario su conto corrente intestato al PRESTATORE"}
- Termini: ${data.paymentTerms || "entro 30 (trenta) giorni dalla presentazione di regolare fattura"}

5.3 In caso di ritardo nel pagamento, saranno dovuti gli interessi di mora 
ai sensi del D.Lgs. 231/2002 (ritardi di pagamento nelle transazioni commerciali).


                    Art. 6 - OBBLIGHI DEL COMMITTENTE

Il COMMITTENTE si impegna a:
a) Fornire tempestivamente tutte le informazioni, i documenti e i materiali 
   necessari per il corretto svolgimento dell'incarico;
b) Collaborare attivamente con il PRESTATORE per il buon esito della prestazione;
c) Corrispondere il compenso pattuito nei termini e con le modalità convenute;
d) Comunicare tempestivamente eventuali variazioni o esigenze particolari;
e) Rispettare la professionalità e l'autonomia organizzativa del PRESTATORE.


                    Art. 7 - OBBLIGHI DEL PRESTATORE

Il PRESTATORE si impegna a:
a) Eseguire l'incarico con la massima diligenza, perizia e professionalità;
b) Rispettare i termini concordati per l'esecuzione delle prestazioni;
c) Informare tempestivamente il COMMITTENTE di eventuali impedimenti o ritardi;
d) Mantenere la massima riservatezza su tutte le informazioni acquisite;
e) Non delegare a terzi l'incarico senza il preventivo consenso scritto del COMMITTENTE;
f) Emettere regolare documentazione fiscale per i compensi ricevuti.


${data.selectedClauses.includes("riservatezza") ? `
                    Art. 8 - RISERVATEZZA

8.1 Il PRESTATORE si impegna a mantenere la massima riservatezza su tutte le 
informazioni, i dati, i documenti e le notizie di cui venga a conoscenza in 
ragione o in occasione dell'esecuzione del presente contratto.

8.2 Tale obbligo di riservatezza permane anche dopo la cessazione del rapporto 
contrattuale, senza limiti di tempo, salvo che le informazioni diventino 
di pubblico dominio per causa non imputabile al PRESTATORE.

8.3 Il PRESTATORE si impegna altresì a far rispettare il presente obbligo ai 
propri eventuali collaboratori e ausiliari.

8.4 La violazione del presente articolo costituirà grave inadempimento e 
legittima causa di risoluzione del contratto, fatto salvo il risarcimento 
di ogni danno subito dal COMMITTENTE.
` : ""}

${data.selectedClauses.includes("proprieta-intellettuale") ? `
                    Art. 9 - PROPRIETÀ INTELLETTUALE

9.1 I diritti di proprietà intellettuale e industriale relativi ai risultati 
delle prestazioni oggetto del presente contratto (inclusi, a titolo 
esemplificativo: opere dell'ingegno, software, database, documenti, elaborati, 
know-how) saranno di esclusiva proprietà del COMMITTENTE.

9.2 Il PRESTATORE si impegna a compiere ogni atto necessario per consentire 
al COMMITTENTE il pieno godimento di tali diritti, ai sensi della Legge 
22 aprile 1941, n. 633 e successive modificazioni.

9.3 Il compenso pattuito all'Art. 5 include ogni corrispettivo per la cessione 
dei diritti di cui al presente articolo.
` : ""}

${data.selectedClauses.includes("penale") ? `
                    Art. 10 - CLAUSOLA PENALE

10.1 In caso di inadempimento delle obbligazioni previste dal presente contratto, 
la parte inadempiente sarà tenuta al pagamento, a titolo di penale ai sensi 
dell'art. 1382 c.c., di una somma pari al 10% (dieci per cento) del valore 
complessivo del contratto.

10.2 Resta in ogni caso salvo il diritto della parte adempiente al risarcimento 
del maggior danno eventualmente subito, ai sensi dell'art. 1382, comma 2, c.c.
` : ""}

                    Art. 11 - RISOLUZIONE E RECESSO

11.1 Ciascuna delle Parti potrà recedere dal presente contratto, in qualsiasi 
momento, mediante comunicazione scritta da inviarsi all'altra Parte con un 
preavviso di almeno 30 (trenta) giorni a mezzo PEC o raccomandata A/R.

11.2 Il contratto si risolverà di diritto, ai sensi dell'art. 1456 c.c., in 
caso di grave inadempimento da parte di uno dei contraenti alle obbligazioni 
previste dal presente accordo.

11.3 In caso di recesso anticipato, il PRESTATORE avrà diritto al compenso 
proporzionale alle prestazioni effettivamente rese fino alla data di cessazione.


                    Art. 12 - TRATTAMENTO DEI DATI PERSONALI

12.1 Le Parti si danno reciprocamente atto che i dati personali raccolti in 
esecuzione del presente contratto saranno trattati nel rispetto del 
Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 come modificato dal 
D.Lgs. 101/2018.

12.2 I dati saranno trattati esclusivamente per le finalità connesse 
all'esecuzione del presente contratto e per gli adempimenti di legge.

12.3 Ciascuna Parte si impegna ad adottare misure tecniche e organizzative 
adeguate a garantire la sicurezza dei dati personali trattati.


                    Art. 13 - COMUNICAZIONI TRA LE PARTI

Tutte le comunicazioni relative al presente contratto dovranno essere effettuate 
in forma scritta ai seguenti indirizzi:

Per il COMMITTENTE: ${data.party1Email || "indirizzo da comunicare"}
Per il PRESTATORE: ${data.party2Email || "indirizzo da comunicare"}

Eventuali variazioni degli indirizzi dovranno essere comunicate tempestivamente 
all'altra Parte per iscritto.


                    Art. 14 - CLAUSOLA DI SALVAGUARDIA

L'eventuale nullità o invalidità di una o più clausole del presente contratto 
non comporterà la nullità dell'intero accordo. Le clausole nulle o invalide 
saranno sostituite di diritto dalle norme di legge applicabili.


                    Art. 15 - FORO COMPETENTE E LEGGE APPLICABILE

15.1 Il presente contratto è regolato dalla legge italiana.

15.2 Per qualsiasi controversia derivante dall'interpretazione, esecuzione o 
risoluzione del presente contratto sarà competente in via esclusiva il 
Foro di ${data.party1City || "___________"}.


                    Art. 16 - DISPOSIZIONI FINALI

16.1 Il presente contratto costituisce l'intero accordo tra le Parti in 
relazione al suo oggetto e sostituisce ogni precedente intesa, dichiarazione 
o accordo, sia orale che scritto.

16.2 Eventuali modifiche al presente contratto dovranno essere concordate 
per iscritto e sottoscritte da entrambe le Parti.

16.3 Il presente contratto è redatto in duplice originale, uno per ciascuna 
delle Parti contraenti.

══════════════════════════════════════════════════════════════════════════════════
                              FIRME
══════════════════════════════════════════════════════════════════════════════════

Letto, confermato e sottoscritto in data ${formattedDate}
Luogo: ${data.party1City || "___________"}


IL COMMITTENTE                                    IL PRESTATORE

${data.party1Name.substring(0, 30).padEnd(40)}${data.party2Name}


_____________________________                    _____________________________
        (firma)                                          (firma)



Ai sensi e per gli effetti degli artt. 1341 e 1342 c.c., le Parti dichiarano 
di approvare specificamente le seguenti clausole: Art. 5 (Corrispettivo), 
Art. 11 (Risoluzione e Recesso), Art. 15 (Foro Competente).


IL COMMITTENTE                                    IL PRESTATORE


_____________________________                    _____________________________
        (firma)                                          (firma)


══════════════════════════════════════════════════════════════════════════════════
                    Documento generato da easycontracts.ai
                 Per rimuovere questo footer, passa al piano PRO
══════════════════════════════════════════════════════════════════════════════════
`;
}

function numberToWords(num: number): string {
  if (isNaN(num) || num === 0) return "zero";
  
  const units = ["", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove"];
  const teens = ["dieci", "undici", "dodici", "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove"];
  const tens = ["", "", "venti", "trenta", "quaranta", "cinquanta", "sessanta", "settanta", "ottanta", "novanta"];
  
  const convert = (n: number): string => {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      let result = tens[t];
      if (u === 1 || u === 8) result = result.slice(0, -1); // vent'uno, trent'otto
      return result + units[u];
    }
    if (n < 1000) {
      const h = Math.floor(n / 100);
      const r = n % 100;
      const prefix = h === 1 ? "cento" : units[h] + "cento";
      return prefix + (r ? convert(r) : "");
    }
    if (n < 1000000) {
      const t = Math.floor(n / 1000);
      const r = n % 1000;
      const prefix = t === 1 ? "mille" : convert(t) + "mila";
      return prefix + (r ? convert(r) : "");
    }
    return num.toString();
  };
  
  return convert(Math.floor(num));
}
