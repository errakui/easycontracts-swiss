import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, plan } = await req.json();

    if (!userId || !plan) {
      return NextResponse.json({ error: "UserId e plan richiesti" }, { status: 400 });
    }

    const validPlans = ["FREE", "PRO", "BUSINESS"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
    }

    // Determina limiti contratti
    let contractsLimit = 1;
    if (plan === "PRO") contractsLimit = 10;
    if (plan === "BUSINESS") contractsLimit = 999999;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        contractsLimit,
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    });

  } catch (error: any) {
    console.error("Errore aggiornamento piano:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
