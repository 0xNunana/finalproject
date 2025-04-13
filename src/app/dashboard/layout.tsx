"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useUser } from "@/context/useUser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Logout from "@/components/Logout";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useUser();

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md relative">
          <div className="p-4">
            <Link href="/" className="block mb-4">
              Home
            </Link>
            <h2 className="text-xl font-bold">Dashboard</h2>
            <nav className="mt-4">
              <ul>
                <li>
                  <Link
                    href="/dashboard"
                    className="block p-2 text-gray-700 hover:bg-gray-200"
                  >
                    Students
                  </Link>
                </li>
              </ul>
            </nav>
            <nav className="mt-4">
              <ul>
                <li>
                  <Link
                    href="/dashboard/myID"
                    className="block p-2 text-gray-700 hover:bg-gray-200"
                  >
                    My Card
                  </Link>
                </li>
              </ul>
            </nav>
            <nav className="mt-4">
              <ul>
                <li>
                  <Link
                    href={`/dashboard/${user?.id}  `}
                    className="block p-2 text-gray-700 hover:bg-gray-200"
                  >
                    My Profile
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="absolute bottom-0 p-4 w-full text-center text-gray-600 border">
            <span className="font-semibold">
              {user?.firstName + " " + user?.lastName || "Guest"}
            </span>
            <Logout />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
