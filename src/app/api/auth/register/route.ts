import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import path as necessary
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      // Unique constraint violation
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
