import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID richiesto" }, { status: 400 });
    }

    // Elimina prima i contratti dell'utente
    await prisma.contract.deleteMany({
      where: { userId },
    });

    // Elimina la subscription
    await prisma.subscription.deleteMany({
      where: { userId },
    });

    // Elimina l'utente
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Utente eliminato con successo" 
    });

  } catch (error: any) {
    console.error("Errore eliminazione utente:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contracts: true,
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error: any) {
    console.error("Errore recupero utente:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
