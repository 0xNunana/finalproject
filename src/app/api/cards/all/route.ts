import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch all cards (add permissions check if needed)
  const cards = await prisma.card.findMany({
    select: {
      id: true,
      gender: true,
      fullName: true,
      year: true,
      program: true,
      imagelink: true,
      profilelink: true,
      userId: true,
    },
  });

  return NextResponse.json({ cards }, { status: 200 });
}
