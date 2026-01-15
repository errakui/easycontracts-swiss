import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Recupera singolo contratto
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get("x-user-id");
    const { id } = params;

    if (!userId) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const contract = await prisma.contract.findFirst({
      where: { 
        id,
        userId, // Assicura che l'utente possa vedere solo i suoi contratti
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contratto non trovato" }, { status: 404 });
    }

    return NextResponse.json({ contract });
  } catch (error) {
    console.error("Errore recupero contratto:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

// DELETE - Elimina contratto
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get("x-user-id");
    const { id } = params;

    if (!userId) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    // Verifica che il contratto appartenga all'utente
    const contract = await prisma.contract.findFirst({
      where: { id, userId },
    });

    if (!contract) {
      return NextResponse.json({ error: "Contratto non trovato" }, { status: 404 });
    }

    // Elimina il contratto
    await prisma.contract.delete({
      where: { id },
    });

    // Decrementa contatore (opzionale - potremmo non farlo)
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { contractsUsed: { decrement: 1 } },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore eliminazione contratto:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

// PATCH - Aggiorna status contratto
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.headers.get("x-user-id");
    const { id } = params;
    const { status } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const validStatuses = ["DRAFT", "FINALIZED", "SIGNED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status non valido" }, { status: 400 });
    }

    const contract = await prisma.contract.updateMany({
      where: { id, userId },
      data: { status },
    });

    if (contract.count === 0) {
      return NextResponse.json({ error: "Contratto non trovato" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore aggiornamento contratto:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

