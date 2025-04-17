"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/useUser";
import Logout from "@/components/Logout";
import {
  HomeIcon,
  UserGroupIcon,
  IdentificationIcon,
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline"; // Example icon library

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, loading, refetch } = useUser();

  if (user == null) {
    refetch();
  }
  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <h2 className="text-center text-white text-xl font-semibold">
          Loading...
        </h2>
        <p className="w-1/3 text-center text-white">
          This may take a few seconds, please don't close this page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-white shadow-md relative">
        <div className="p-4">
          <Link
            href="/"
            className="block mb-6 text-lg font-semibold text-gray-800 md:flex items-center space-x-2"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Dashboard</h2>
          <nav className="mt-2 space-y-5">
            <ul>
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  <span>Students</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/myID"
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <IdentificationIcon className="w-5 h-5 mr-2" />
                  <span>My Card</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/dashboard/${user?.id}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  <span>My Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="absolute bottom-0 p-4 w-full text-center text-gray-600 border-t flex items-center justify-between">
          <span className="font-semibold block mb-1">
            {user?.firstName} {user?.lastName || "Guest"}
          </span>
          <Logout
            icon={
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5 inline-block mr-1" />
            }
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:p-6">
        <div className="md:hidden bg-white shadow-md p-3 mb-4 rounded-md">
          <div className="flex justify-around items-center text-sm font-medium text-gray-600">
            <Link
              href="/"
              className="flex flex-col items-center hover:text-gray-800"
            >
              <HomeIcon className="w-5 h-5 mb-1" />
              Home
            </Link>
            <Link
              href="/dashboard"
              className="flex flex-col items-center hover:text-gray-800"
            >
              <UserGroupIcon className="w-5 h-5 mb-1" />
              Students
            </Link>
            <Link
              href="/dashboard/myID"
              className="flex flex-col items-center hover:text-gray-800"
            >
              <IdentificationIcon className="w-5 h-5 mb-1" />
              My Card
            </Link>
            <Link
              href={`/dashboard/${user?.id}`}
              className="flex flex-col items-center hover:text-gray-800"
            >
              <UserIcon className="w-5 h-5 mb-1" />
              My Profile
            </Link>
            <Logout
              icon={
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5 inline-block mr-1" />
              }
            />
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
