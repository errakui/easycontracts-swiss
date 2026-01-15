import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e password richiesti" }, { status: 400 });
    }

    // Trova utente
    const user = await prisma.user.findUnique({
      where: { email },
      include: { subscription: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }

    // Verifica password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        contractsLimit: user.contractsLimit,
        contractsUsed: user.contractsUsed,
      },
    });
  } catch (error: any) {
    console.error("Errore login:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

