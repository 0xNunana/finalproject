import React from "react";
import { useQueryClient } from "@tanstack/react-query";

interface LogoutProps {
  icon?: React.ReactNode;
}
const Logout = ({ icon }: LogoutProps) => {
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      // ✅ Correctly invalidate the user query
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Redirect after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      {icon && <span className="">{icon}</span>}
    </button>
  );
};

export default Logout;
