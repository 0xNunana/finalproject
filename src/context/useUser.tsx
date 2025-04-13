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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: user,
    isLoading,
    isError,
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
  });
  const contextUser = user ?? null;
  return (
    <UserContext.Provider
      value={{
        user: contextUser,
        loading: isLoading,
        error: isError ? "Failed to load user" : null,
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
