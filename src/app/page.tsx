"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white  p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col w-full md:flex-row gap-2 items-center">
            <Image src="/havard.png " width={100} height={100} alt="Harvard" />
            <div className="text-center">
              <h1 className="text-2xl font-bold">CS50 Student ID Creation</h1>
              <p>Empower Your Academic Identity</p>
            </div>
          </div>
          <nav className="hidden md:block w-[200px]  ">
            <ul className="flex gap-4">
              <li>
                <Link
                  href="/login"
                  className="  bg-blue-300 hover:bg-blue-400 px-3 py-2 rounded-lg"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="  bg-blue-300 hover:bg-blue-400 px-3 py-2 rounded-lg"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
          <nav className="md:hidden">menu</nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 h-[30vh] md:h-[50vh] lg:h-[80vh] relative">
        <div>
          <Image
            src="/cs50-harvard .png"
            width={1000}
            height={1000}
            priority
            alt="CS50"
            className="absolute inset-0 w-full h-full  object-cover "
          />
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto flex-col flex items-center   z-20 ">
          <h2 className="text-4xl font-bold text-red-900 mb-4">
            Create Your CS50 Student ID Effortlessly
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Build and share your academic identity with a personalized digital
            student ID. Perfect for CS50 students to manage their identities.
          </p>
          <div>
            <Link
              href="/register"
              className="bg-black text-white font-semibold  py-3 px-6 rounded-lg text-xl hover:bg-gray-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-gray-200">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h3 className="text-3xl font-semibold text-gray-900">Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="border p-6 rounded-xl shadow-lg  bg-white">
              <h4 className="text-xl font-bold text-blue-600">
                Personalized IDs
              </h4>
              <p className="text-gray-600 mt-4">
                Create and manage your unique digital student ID tailored for
                CS50.
              </p>
            </div>
            <div className="border p-6 rounded-xl shadow-lg bg-white">
              <h4 className="text-xl font-bold text-blue-600">Easy Sharing</h4>
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
        <div className="max-w-4xl mx-auto text-center">
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
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; newDate() CS50 Student ID, All rights reserved.</p>
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
    </div>
  );
}
