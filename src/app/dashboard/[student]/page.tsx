"use client"; // Ensure this is a client component

import Image from "next/image";
import { useUser } from "@/context/useUser";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface StudentProfile {
  id: string;
  fullName?: string;
  gender?: string;
  year?: string;
  program?: string;
  imagelink?: string;
  hobbies?: string;
  bio?: string;
  facebook?: string;
  linkedin?: string;
  github?: string;
  certificate?: string;
}

const ProfilePage = ({ params }: { params: { student: string } }) => {
  const studentId = params.student as string;
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>({ id: studentId });
  const { user } = useUser();
  console.log("studentId", studentId);
  console.log("user", user);
  // Fetch student profile by ID
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery<StudentProfile>({
    queryKey: ["student-profile", studentId],
    queryFn: async () => {
      const response = await fetch(`/api/profile/${studentId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Profile not found
        }
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
    retry: true, // Do not retry on 404
  });

  // Function to fetch data from the card API
  const {
    data: card,
    isLoading: cardLoading,
    isError: cardError,
  } = useQuery({
    queryKey: ["card"], // Unique identifier for the query
    queryFn: async () => {
      const response = await fetch("/api/cards/myCard");
      if (!response.ok) {
        console.error("Failed to fetch card data");
        return null;
      }
      const data = await response.json();
      return data.card;
    },
    enabled: !profile && user?.id === studentId, // Only fetch card data if profile is not found
  });

  useEffect(() => {
    if (profile === null && user?.id === studentId && card) {
      setFormData((prev) => ({
        ...prev,
        fullName: card.fullName,
        gender: card.gender,
        year: card.year,
        program: card.program,
        imagelink: card.imagelink,
      }));
      setIsCreating(true);
    } else if (profile) {
      setFormData(profile);
      setIsCreating(false); // Ensure isCreating is false if profile exists
    } else if (profile === null && !cardLoading && cardError) {
      // Handle the case where fetching card data fails
      console.error("Error fetching card data:", cardError);
      setIsCreating(true); // Still show the form, but without pre-filled data
    }
  }, [profile, studentId, card, cardLoading, cardError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log("formData", formData);
    try {
      const response = await fetch(`/api/profile/${studentId}`, {
        method: profile ? "PUT" : "POST", // Use PUT to update if profile exists
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Profile saved successfully!");
        refetch(); // Re-fetch the updated profile
        setIsCreating(false);
        router.push(`/profile/${studentId}`); // Redirect to the updated profile page
      } else {
        console.error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };
  if (user?.id !== studentId && !profile) {
    return (
      <div className="py-20 text-center text-gray-600">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 1.274 4.057-1.178 7-5.042 7-3.86 0-6.27-2.943-5.042-7z"
          />
        </svg>
        <p className="mt-4 text-lg font-semibold">Profile Not Found</p>
        {user ? (
          <p className="mt-2">
            It seems this student doesn't have a public profile yet.
          </p>
        ) : (
          <p className="mt-2">
            You need to be logged in to see student profiles.
          </p>
        )}
      </div>
    );
  }
  if (isLoading || cardLoading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (isError && !isCreating) {
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load profile.
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create Your Profile
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden col-span-2">
            <Image
              src={card?.imagelink || "/default-avatar.png"}
              alt="Profile"
              width={120}
              height={120}
              className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-gray-300"
            />
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={card?.fullName || ""}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="program"
              className="block text-sm font-medium text-gray-700"
            >
              Program
            </label>
            <input
              type="text"
              id="program"
              name="program"
              value={card?.program || ""}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700"
            >
              Year
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={card?.year || ""}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={card?.gender || ""}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed"
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="hobbies"
              className="block text-sm font-medium text-gray-700"
            >
              Hobbies
            </label>
            <input
              type="text"
              id="hobbies"
              name="hobbies"
              value={formData.hobbies || ""}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="facebook"
              className="block text-sm font-medium text-gray-700"
            >
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              value={formData.facebook || ""}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-700"
            >
              LinkedIn
            </label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin || ""}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="github"
              className="block text-sm font-medium text-gray-700"
            >
              Github
            </label>
            <input
              type="text"
              id="github"
              name="github"
              value={formData.github || ""}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="certificate"
              className="block text-sm font-medium text-gray-700"
            >
              Certificate
            </label>
            <input
              type="text"
              id="certificate"
              name="certificate"
              value={formData.certificate || ""}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              rows={10}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 mt-4 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Profile
        </button>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-8 bg-white rounded-2xl shadow-2xl">
      {/* Hero Section */}
      <div className="flex items-center justify-between mb-12">
        {/* Profile Image */}
        <div className="w-48 h-48 rounded-full overflow-hidden mr-8">
          <Image
            src={profile?.imagelink || "/default-avatar.png"}
            alt="Student Profile"
            width={200}
            height={200}
            className="border-4 border-gray-200"
          />
        </div>

        {/* Hero Content */}
        <div className="flex gap-3">
          <Image src="/havard.png" alt="Havard Logo" width={200} height={200} />
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
              {profile?.fullName}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {profile?.program} | {profile?.year}
            </p>
            <div className="flex space-x-4">
              {profile?.facebook && (
                <Link
                  href={profile.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline transition"
                >
                  Facebook
                </Link>
              )}
              {profile?.linkedin && (
                <Link
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline transition"
                >
                  LinkedIn
                </Link>
              )}
              {profile?.github && (
                <Link
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline transition"
                >
                  GitHub
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          {/* Bio Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bio</h2>
            <p className="text-gray-700 leading-relaxed">
              {profile?.bio || "No bio provided"}
            </p>
          </div>

          {/* Hobbies Section */}
          {profile?.hobbies && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Hobbies</h2>
              <p className="text-gray-700 leading-relaxed">
                {profile.hobbies.split(",").map((hobby, index) => (
                  <span key={index} className="inline-block mr-2">
                    <span className="text-blue-500 font-medium">{hobby}</span>
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Academic Info */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Academic Info
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Program:</span>
                <span className="text-gray-800">{profile?.program}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Year:</span>
                <span className="text-gray-800">{profile?.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Gender:</span>
                <span className="text-gray-800">{profile?.gender}</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {profile?.certificate && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Certifications
              </h2>
              <a
                href={profile.certificate}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                View Certificate
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Featured Section */}
      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Social Media Cards */}
          {profile?.facebook && (
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-blue-600 mb-2">
                Facebook
              </h3>
              <p className="text-gray-700">{profile.facebook}</p>
            </div>
          )}
          {profile?.linkedin && (
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-blue-600 mb-2">
                LinkedIn
              </h3>
              <p className="text-gray-700">{profile.linkedin}</p>
            </div>
          )}
          {profile?.github && (
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-blue-600 mb-2">GitHub</h3>
              <p className="text-gray-700">{profile.github}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
