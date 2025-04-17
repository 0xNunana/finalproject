"use client";

import { useUser } from "@/context/useUser";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function LandingPage() {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Image
              src="/havard.png"
              width={100}
              height={100}
              alt="Harvard"
              className="max-sm:w-10"
            />
            <div className="text-left">
              <h1 className="text-lg font-bold sm:text-xl">CS50 Student ID</h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Academic Identity
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          {user ? (
            <Link
              href="/dashboard"
              className="hover:underline px-3 py-2 rounded-lg"
            >
              Dashboard
            </Link>
          ) : (
            <nav className="hidden md:block">
              <ul className="flex gap-4">
                <li>
                  <Link
                    href="/login"
                    className="hover:underline px-3 py-2 rounded-lg"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:underline px-3 py-2 rounded-lg"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </nav>
          )}

          {/* Mobile Menu Button */}
          {!user && (
            <button
              onClick={toggleMobileMenu}
              className="md:hidden focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          )}
          {user && (
            <Link
              href="/dashboard"
              className="md:hidden bg-blue-300 hover:bg-blue-400 px-3 py-2 rounded-lg"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        {!user && isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md rounded-b-md py-2 flex flex-col items-center">
            <Link
              href="/login"
              className="block py-2 px-4 hover:bg-gray-100 w-full text-center"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block py-2 px-4 hover:bg-gray-100 w-full text-center"
            >
              Sign Up
            </Link>
          </div>
        )}
      </header>

      {/* Only show content if there is a user */}

      <>
        {/* Hero Section */}
        <section className="text-center py-16 h-[30vh] md:h-[50vh] lg:h-[80vh] relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/cs50-harvard .png"
              layout="fill"
              objectFit="cover"
              priority
              alt="CS50"
            />
          </div>
          {/* <div className="relative z-10 flex flex-col justify-center items-center h-full">
            <h2 className="text-2xl font-bold text-red-900 mb-4 sm:text-3xl lg:text-4xl">
              Create Your CS50 Student ID Effortlessly
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-lg">
              Build and share your academic identity with a personalized digital
              student ID. Perfect for CS50 students to manage their identities.
            </p>
            <div>
              <Link
                href="/register"
                className="bg-black text-white font-semibold py-3 px-6 rounded-lg text-xl hover:bg-gray-800"
              >
                Get Started
              </Link>
            </div>
          </div> */}
        </section>
        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-transparent to-gray-200">
          <div className="max-w-6xl mx-auto text-center space-y-12 px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-semibold text-gray-900">Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="border p-6 rounded-xl shadow-lg bg-white">
                <h4 className="text-xl font-bold text-blue-600">
                  Personalized IDs
                </h4>
                <p className="text-gray-600 mt-4">
                  Create and manage your unique digital student ID tailored for
                  CS50.
                </p>
              </div>
              <div className="border p-6 rounded-xl shadow-lg bg-white">
                <h4 className="text-xl font-bold text-blue-600">
                  Easy Sharing
                </h4>
                <p className="text-gray-600 mt-4">
                  Effortlessly share your student ID with peers and faculty.
                </p>
              </div>
              <div className="border p-6 rounded-xl shadow-lg bg-white">
                <h4 className="text-xl font-bold text-blue-600">
                  Customizable Designs
                </h4>
                <p className="text-gray-600 mt-4">
                  Fully customize your student ID design, including colors and
                  logos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA for Students */}
        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Create Your Student ID?
            </h2>
            <p className="text-lg mb-8">
              If you're a CS50 student, sign up today and start managing your
              digital identity.
            </p>
            <Link
              href="/register"
              className="bg-blue-800 text-white py-2 px-6 rounded-lg text-xl hover:bg-blue-900"
            >
              Get Started as a CS50 Student
            </Link>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <p>
              &copy; {new Date().getFullYear()} CS50 Student ID, All rights
              reserved.
            </p>
            <p className="mt-2">Follow us on social media!</p>
            <div className="flex justify-center space-x-4 mt-4">
              <Link href="#" className="text-white hover:text-blue-400">
                Facebook
              </Link>
              <Link href="#" className="text-white hover:text-blue-400">
                Twitter
              </Link>
              <Link href="#" className="text-white hover:text-blue-400">
                LinkedIn
              </Link>
            </div>
          </div>
        </footer>
      </>
    </div>
  );
}
