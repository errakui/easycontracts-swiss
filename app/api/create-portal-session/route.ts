import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID mancante" }, { status: 400 });
    }

    const session = await createCustomerPortalSession(customerId);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Errore creazione portal session:", error);
    return NextResponse.json(
      { error: error.message || "Errore nella creazione del portal" },
      { status: 500 }
    );
  }
}

