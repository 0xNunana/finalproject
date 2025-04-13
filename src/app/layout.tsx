import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientProvider from "@/components/clientProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Student ID Generator | 0xNunana",
  description:
    "Generate student ID cards for your cs50 students | CS50 Final Project",

  keywords: [
    "cs50",
    "havard",
    "final project",
    "student ID",
    "student card",
    "card generator",
    "student ID generator",
    "cs50 student ID generator",
    "0xNunana",
    "Kudaya",
    "Paul",
    "Yao",
    "Nunana",
    "Kudaya Paul",
    "Paul Yao",
    "Kudaya Paul Yao",
    "Edx",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
