// components/AuthGuard.tsx
"use client";

import { useUser } from "@/context/useUser";
import { useRouter } from "next/navigation";
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
