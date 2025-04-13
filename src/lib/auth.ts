import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { compare, hash } from "bcrypt";
import { cookies } from "next/headers";

export interface SessionData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
// Define session options
const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "id_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  },
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}
// Function to get the session

// Function to set the session
export async function setSession(user: any) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // Set session data
  session.userId = user.id;
  session.firstName = user.firstName;
  session.lastName = user.lastName;
  session.email = user.email;

  // Save the session
  await session.save();

  return session;
}

// Function to destroy the session (logout)
export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}

export async function destroySession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.destroy();
}
