"use client";

import StudentIdCard from "@/components/StudentID";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";

interface Card {
  id: string;
  fullName: string;
  year: string;
  program: string;
  gender: string;
  imagelink: string;
  profilelink: string;
  userId: string;
}

const DashboardHome = () => {
  // Filter state
  const [yearFilter, setYearFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");

  // Fetch all cards
  const {
    data: cards,
    isLoading,
    isError,
  } = useQuery<Card[]>({
    queryKey: ["all-cards"],
    queryFn: async () => {
      const response = await fetch("/api/cards/all");
      const data = await response.json();
      return data.cards;
    },
  });

  // Apply filters
  const filteredCards = cards?.filter((card) => {
    const matchesYear = !yearFilter || card.year === yearFilter;
    const matchesGender = !genderFilter || card.gender === genderFilter;
    const matchesProgram =
      !programFilter || card.program.toLowerCase().includes(programFilter);
    const matchesName =
      !nameFilter ||
      card.fullName.toLowerCase().includes(nameFilter.toLowerCase());
    return matchesYear && matchesGender && matchesProgram && matchesName;
  });

  if (isLoading) {
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

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">Error fetching cards</div>
    );
  }

  return (
    <div>
      {/* Filter Form */}
      <div className="mb-4 px-2">
        <div className="flex flex-wrap md:justify-end gap-4 sticky top-0 ">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="p-2 text-sm md:text-base rounded border w-full md:w-auto"
          >
            <option value="">All Years</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="p-2 text-sm md:text-base rounded border w-full md:w-auto"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Filter by Program"
            value={programFilter.toLowerCase()}
            onChange={(e) => setProgramFilter(e.target.value.toLowerCase())}
            className="p-2  text-sm md:text-base rounded border w-full md:w-auto "
          />
          <input
            type="text"
            placeholder="Filter by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="p-2 text-sm md:text-base rounded border w-full md:w-auto"
          />
          <button
            type="button"
            onClick={() => {
              setYearFilter("");
              setGenderFilter("");
              setProgramFilter("");
              setNameFilter("");
            }}
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded text-sm md:text-base w-full md:w-auto"
          >
            Reset
          </button>
        </div>
      </div>

      {filteredCards?.length === 0 ? (
        <div className="py-20 text-center">No cards match the filters</div>
      ) : (
        <div className="flex flex-col   items-center md:flex-row flex-wrap gap-3 md:justify-center">
          {filteredCards?.map((card) => (
            <Link key={card.id} href={`/dashboard/${card.userId}`}>
              <StudentIdCard
                key={card.id}
                studentImage={card.imagelink}
                studentName={card.fullName}
                year={card.year}
                program={card.program}
                profileLink={`${window.location.origin}/dashboard/${card.id}`}
                gender={card.gender}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
