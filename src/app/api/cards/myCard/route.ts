import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import path as necessary
import { getSession } from "@/lib/auth"; // Adjust the import path as necessary

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.email },
  });

  const card = await prisma.card.findUnique({
    where: { userId: user?.id },
    select: {
      id: true,
      gender: true,
      fullName: true,
      year: true,
      program: true,
      imagelink: true,
      profilelink: true,
    },
  });

  if (!card) {
    return NextResponse.json({ card: null });
  }

  return NextResponse.json({ card });
}
