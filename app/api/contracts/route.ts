import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disabilita cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Recupera tutti i contratti dell'utente
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const userEmail = req.headers.get("x-user-email");
    
    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    // Trova utente per ID o email
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user && userEmail) {
      user = await prisma.user.findUnique({ where: { email: userEmail } });
    }
    
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    const contracts = await prisma.contract.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        typeName: true,
        party1Name: true,
        party2Name: true,
        amount: true,
        status: true,
        hasWatermark: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ contracts });
  } catch (error) {
    console.error("Errore recupero contratti:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

// POST - Crea nuovo contratto
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, contractData, generatedContent, isPro } = body;

    if (!userId) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    // Verifica limiti utente
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { contractsUsed: true, contractsLimit: true, plan: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    // Controlla se ha raggiunto il limite (tranne BUSINESS che è -1 = illimitato)
    if (user.contractsLimit !== -1 && user.contractsUsed >= user.contractsLimit) {
      return NextResponse.json({ 
        error: "Limite contratti raggiunto", 
        limit: user.contractsLimit,
        used: user.contractsUsed 
      }, { status: 403 });
    }

    // Crea il contratto
    const contract = await prisma.contract.create({
      data: {
        userId,
        type: contractData.type,
        typeName: contractData.typeName || "Contratto",
        party1Name: contractData.party1Name,
        party1Email: contractData.party1Email || null,
        party1Vat: contractData.party1Vat || null,
        party1Address: contractData.party1Address || null,
        party2Name: contractData.party2Name,
        party2Email: contractData.party2Email || null,
        party2Vat: contractData.party2Vat || null,
        party2Address: contractData.party2Address || null,
        amount: contractData.amount,
        paymentTerms: contractData.paymentTerms || null,
        paymentMethod: contractData.paymentMethod || null,
        duration: contractData.duration || null,
        startDate: contractData.startDate || null,
        endDate: contractData.endDate || null,
        description: contractData.description,
        deliverables: contractData.deliverables || null,
        workLocation: contractData.workLocation || null,
        workHours: contractData.workHours || null,
        selectedClauses: contractData.selectedClauses || [],
        customRequests: contractData.customRequests || null,
        generatedContent,
        hasWatermark: !isPro,
        status: "DRAFT",
      },
    });

    // Aggiorna contatore utente
    await prisma.user.update({
      where: { id: userId },
      data: { contractsUsed: { increment: 1 } },
    });

    return NextResponse.json({ 
      contract,
      remaining: user.contractsLimit === -1 ? "illimitati" : user.contractsLimit - user.contractsUsed - 1
    });
  } catch (error) {
    console.error("Errore creazione contratto:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

