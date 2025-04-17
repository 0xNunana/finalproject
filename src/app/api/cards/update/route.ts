import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { uploadEventImage } from "@/lib/uploadImage";

export async function PUT(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get form data instead of JSON since we're using FormData in frontend
  const formData = await request.formData();

  // Extract data from form
  const id = formData.get("id") as string; // Card ID to update
  const year = formData.get("year") as string;
  const program = formData.get("program") as string;
  const gender = formData.get("gender") as string;
  const imageFile = formData.get("image") as File | null;

  // Fetch existing card to check ownership and get current image
  const existingCard = await prisma.card.findUnique({
    where: { id },
    include: { user: true }, // To check ownership
  });

  if (!existingCard) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  console.log("existingCard", existingCard);
  // Check if user owns the card
  if (existingCard.user.email !== session.email) {
    return NextResponse.json(
      { error: "Unauthorized to update this card" },
      { status: 403 }
    );
  }

  // Handle image upload
  let newImageUrl = existingCard.imagelink; // Default to existing image
  if (imageFile) {
    try {
      newImageUrl = await uploadEventImage(imageFile);
    } catch (error) {
      console.error("Image upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }
  }

  // Update the card in the database
  const updatedCard = await prisma.card.update({
    where: { id },
    data: {
      year,
      program,
      gender,
      imagelink: newImageUrl, // Update image only if new one provided
    },
  });

  return NextResponse.json(updatedCard, { status: 200 });
}
