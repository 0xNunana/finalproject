// // app/api/cards/create/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getSession } from "@/lib/auth";
// import { uploadEventImage } from "@/lib/uploadImage";

// export async function POST(request: NextRequest) {
//   const session = await getSession();

//   if (!session) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   const formData = await request.formData();

//   // Extract data from form
//   const id = formData.get("id") as string; // Card ID to update
//   const year = formData.get("year") as string;
//   const program = formData.get("program") as string;
//   const gender = formData.get("gender") as string;
//   const fullName = formData.get("fullName") as string;
//   const profileLink = formData.get("profilelink") as string;
//   const image = formData.get("image") as File | null;
//   const user = await prisma.user.findUnique({
//     where: { email: session.email },
//   });

//   // Check if the user already has a card
//   const existingCard = await prisma.card.findUnique({
//     where: { userId: session.userId || user?.id },
//   });

//   if (existingCard) {
//     return NextResponse.json(
//       { error: "User can only have one card" },
//       { status: 400 }
//     );
//   }
//   let imageUrl = null;
//   if (image) {
//     try {
//       imageUrl = await uploadEventImage(image);
//     } catch (uploadError) {
//       console.error("Image upload error:", uploadError);
//       return NextResponse.json(
//         { error: "Failed to upload image" },
//         { status: 500 }
//       );
//     }
//   }
//   console.log("url", imageUrl);
//   // Create the card
//   const card = await prisma.card.create({
//     data: {
//       fullName,
//       year,
//       program,

//       profilelink: profileLink,
//       imagelink: imageUrl,

//       gender,
//       user: { connect: { id: user?.id } },
//     },
//   });

//   return NextResponse.json(card, { status: 201 });
// }

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { uploadEventImage } from "@/lib/uploadImage";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Use FormData to handle file uploads
  const formData = await request.formData();

  // Extract data from form
  const fullName = formData.get("fullName") as string;
  const year = formData.get("year") as string;
  const program = formData.get("program") as string;
  const gender = formData.get("gender") as string;
  const profileLink = formData.get("profileLink") as string;
  const image = formData.get("image") as File | null;

  // Fetch user details
  const user = await prisma.user.findUnique({
    where: { email: session.email },
  });

  // Check if the user already has a card
  const existingCard = await prisma.card.findUnique({
    where: { userId: session.userId || user?.id },
  });

  if (existingCard) {
    return NextResponse.json(
      { error: "User can only have one card" },
      { status: 400 }
    );
  }

  // Handle image upload
  let imageUrl: string | null = null;
  if (image) {
    try {
      imageUrl = await uploadEventImage(image); // Wait for the image upload
    } catch (uploadError) {
      console.error("Image upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }
  }

  // Create the card with the image URL (or null if no image)
  const card = await prisma.card.create({
    data: {
      fullName,
      year,
      program,
      profilelink: profileLink,
      imagelink: imageUrl,
      gender,
      user: { connect: { id: user?.id } },
    },
  });

  return NextResponse.json(card, { status: 201 });
}
