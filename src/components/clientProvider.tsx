"use client";
import { UserProvider } from "@/context/useUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const ClientProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const query = new QueryClient();
  return (
    <QueryClientProvider client={query}>
      <UserProvider>{children}</UserProvider>;
    </QueryClientProvider>
  );
};

export default ClientProvider;
