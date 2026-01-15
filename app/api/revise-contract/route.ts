import { NextRequest, NextResponse } from "next/server";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

const REVISION_PROMPT = `Sei un avvocato italiano esperto. Ti viene fornito un contratto già redatto e una richiesta di modifica.

COMPITO:
1. Leggi attentamente il contratto esistente
2. Applica SOLO le modifiche richieste dal cliente
3. Mantieni TUTTO il resto del contratto identico
4. Non riscrivere l'intero contratto, modifica solo le parti necessarie
5. Mantieni lo stesso stile, formattazione e tono legale
6. Se la richiesta non è chiara, interpreta nel modo più ragionevole

REGOLE:
- Non aggiungere markdown (no #, **, ecc.)
- Mantieni la struttura esistente
- Scrivi in italiano formale
- Non rimuovere clausole esistenti a meno che non sia esplicitamente richiesto
`;

export async function POST(req: NextRequest) {
  try {
    const { originalContract, revisionRequest, contractType } = await req.json();

    if (!originalContract || !revisionRequest) {
      return NextResponse.json(
        { error: "Contratto originale e richiesta di revisione sono obbligatori" },
        { status: 400 }
      );
    }

    if (!PERPLEXITY_API_KEY) {
      // Fallback semplice senza AI
      return NextResponse.json({
        contract: originalContract + "\n\n[NOTA: Revisione richiesta: " + revisionRequest + "]",
        source: "fallback"
      });
    }

    const userPrompt = `CONTRATTO ORIGINALE:
---
${originalContract}
---

RICHIESTA DI MODIFICA:
${revisionRequest}

Restituisci il contratto completo con le modifiche applicate. Non usare markdown.`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          { role: "system", content: REVISION_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Errore API Perplexity");
    }

    const result = await response.json();
    const revisedContract = result.choices?.[0]?.message?.content;

    if (!revisedContract) {
      throw new Error("Nessuna risposta dall'AI");
    }

    // Pulisci markdown se presente
    const cleanContract = revisedContract
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .trim();

    return NextResponse.json({
      contract: cleanContract,
      source: "perplexity"
    });

  } catch (error: any) {
    console.error("Errore revisione contratto:", error);
    return NextResponse.json(
      { error: error.message || "Errore nella revisione" },
      { status: 500 }
    );
  }
}

