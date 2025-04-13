// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth"; // Ensure this function exists

export async function POST(request: Request) {
  // Destroy the session (e.g., clear cookies, invalidate tokens)
  await destroySession();

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}
