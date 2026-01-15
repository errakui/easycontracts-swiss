import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lista email admin autorizzate
const ADMIN_EMAILS = [
  "admin@easycontracts.ai",
  process.env.ADMIN_EMAIL,
].filter(Boolean);

export async function GET(req: NextRequest) {
  try {
    // Verifica autorizzazione admin
    const adminEmail = req.headers.get("x-admin-email");
    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail)) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
    }

    // Recupera tutti gli utenti
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        contractsUsed: true,
        contractsLimit: true,
        createdAt: true,
        _count: {
          select: { contracts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calcola statistiche
    const totalUsers = users.length;
    const proUsers = users.filter(u => u.plan === "PRO").length;
    const businessUsers = users.filter(u => u.plan === "BUSINESS").length;
    
    const totalContracts = await prisma.contract.count();
    
    // Revenue stimata (PRO = €19, BUSINESS = €49)
    const estimatedRevenue = (proUsers * 19) + (businessUsers * 49);

    return NextResponse.json({
      users: users.map(u => ({
        ...u,
        totalContracts: u._count.contracts,
      })),
      stats: {
        totalUsers,
        proUsers,
        businessUsers,
        totalContracts,
        estimatedRevenue,
        activeSubscriptions: proUsers + businessUsers,
      },
    });
  } catch (error) {
    console.error("Errore admin users:", error);
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
