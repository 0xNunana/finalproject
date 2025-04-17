"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void; // Add refetch function to the context
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: user,
    isLoading,
    isError,
    refetch, // Destructure the refetch function
  } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/auth/session");
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      return data.user || null; // Return user or null if not found
    },
    retry: 3, // Optionally configure retry attempts
    refetchOnMount: true, // Refetch on component mount
    refetchOnWindowFocus: true, // Refetch when the window gains focus
    refetchInterval: 0, // Disable automatic refetching interval
    enabled: true, // Ensure the query is enabled
  });

  const contextUser = user ?? null;

  return (
    <UserContext.Provider
      value={{
        user: contextUser,
        loading: isLoading,
        error: isError ? "Failed to load user" : null,
        refetch: refetch, // Provide the refetch function in the context
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
