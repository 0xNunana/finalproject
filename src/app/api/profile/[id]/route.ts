import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const student = await prisma.student.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      year: true,
      program: true,
      gender: true,
      imagelink: true,
      profilelink: true,
      bio: true,
      // hobbies: true,
      facebook: true,
      linkedin: true,
      github: true,
      certificate: true,
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(student, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      fullName,
      year,
      program,
      gender,
      imagelink,
      profilelink,
      bio,
      hobbies,
      facebook,
      linkedin,
      github,
      certificate,
    } = body;

    if (!id || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields (id and fullName)" },
        { status: 400 }
      );
    }

    const newStudent = await prisma.student.create({
      data: {
        id,
        fullName,
        year,
        program,
        gender,
        imagelink,
        profilelink,
        bio,
        hobbies,
        facebook,
        linkedin,
        github,
        certificate,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT route to update an existing student profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();
    const {
      fullName,
      year,
      program,
      gender,
      imagelink,
      profilelink,
      bio,
      hobbies,
      facebook,
      linkedin,
      github,
      certificate,
    } = body;

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        fullName,
        year,
        program,
        gender,
        imagelink,
        profilelink,
        bio,
        hobbies,
        facebook,
        linkedin,
        github,
        certificate,
      },
    });

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error: any) {
    console.error(`Error updating student with ID ${id}:`, error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: `Student with ID ${id} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
