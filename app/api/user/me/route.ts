import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disabilita cache
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Ottieni dati utente corrente
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const userEmail = req.headers.get("x-user-email");

    // Prova prima con ID, poi con email
    let user = null;
    
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          plan: true,
          contractsUsed: true,
          contractsLimit: true,
          stripeCustomerId: true,
          createdAt: true,
          subscription: {
            select: {
              status: true,
              currentPeriodEnd: true,
              cancelAtPeriodEnd: true,
            },
          },
          _count: {
            select: { contracts: true },
          },
        },
      });
    } else if (userEmail) {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          plan: true,
          contractsUsed: true,
          contractsLimit: true,
          stripeCustomerId: true,
          createdAt: true,
          subscription: {
            select: {
              status: true,
              currentPeriodEnd: true,
              cancelAtPeriodEnd: true,
            },
          },
          _count: {
            select: { contracts: true },
          },
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    // Calcola contratti rimanenti
    const remaining = user.contractsLimit === -1 
      ? "illimitati" 
      : Math.max(0, user.contractsLimit - user.contractsUsed);

    return NextResponse.json({
      user: {
        ...user,
        contractsRemaining: remaining,
        totalContracts: user._count.contracts,
      },
    });
  } catch (error) {
    console.error("Errore recupero utente:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

// PATCH - Aggiorna profilo utente
export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const { name, image } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Errore aggiornamento utente:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

