import React from "react";
import { useQueryClient } from "@tanstack/react-query";

const Logout = () => {
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
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default Logout;
