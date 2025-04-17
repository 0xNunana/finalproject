"use client";
import { UserProvider } from "@/context/useUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "./ui/sonner";

const ClientProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const query = new QueryClient();
  return (
    <QueryClientProvider client={query}>
      <UserProvider>
        {children}
        <Toaster richColors position="top-center" />
      </UserProvider>
    </QueryClientProvider>
  );
};

export default ClientProvider;
