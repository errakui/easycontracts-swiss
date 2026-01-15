import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email mancante" }, { status: 400 });
    }

    // Trova l'utente
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    // Verifica se ha un token di login valido
    if (user.image && user.image.startsWith('login_token:')) {
      const [, token, expiryStr] = user.image.split(':');
      const expiry = parseInt(expiryStr);

      if (Date.now() < expiry) {
        // Token valido! Rimuovilo e restituisci i dati utente
        await prisma.user.update({
          where: { id: user.id },
          data: { image: null },
        });

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            plan: user.plan,
          },
        });
      }
    }

    return NextResponse.json({ error: "Token non valido o scaduto" }, { status: 401 });
  } catch (error: any) {
    console.error("Errore auto-login:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

