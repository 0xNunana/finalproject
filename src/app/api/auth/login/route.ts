import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import path as necessary
import bcrypt from "bcrypt";
import { setSession } from "@/lib/auth"; // Import your session management function

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set the session for the logged-in user
  await setSession({
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
  return NextResponse.json(user, { status: 200 });
}
