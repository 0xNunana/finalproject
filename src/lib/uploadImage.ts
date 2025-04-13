// lib/uploadImage.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export async function uploadImage(file: File): Promise<string> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary credentials are not properly configured");
  }
  try {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed."
      );
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB.");
    }
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary with additional options
    const result = (await cloudinary.uploader.upload(base64File, {
      folder: "motivational-quotes",
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "gif", "webp"],
      transformation: [
        { quality: "auto:good" }, // Automatic quality optimization
        { fetch_format: "auto" }, // Automatic format selection
        { width: 1200, crop: "limit" }, // Limit maximum width
      ],
    })) as CloudinaryResponse;

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function uploadEventImage(file: File): Promise<string> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary credentials are not properly configured");
  }
  try {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed."
      );
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB.");
    }
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary with additional options
    const result = (await cloudinary.uploader.upload(base64File, {
      folder: "events",
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "gif", "webp"],
      transformation: [
        { quality: "auto:good" }, // Automatic quality optimization
        { fetch_format: "auto" }, // Automatic format selection
        { width: 1200, crop: "limit" }, // Limit maximum width
      ],
    })) as CloudinaryResponse;

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

// Optional: Function to delete image from Cloudinary
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

// Helper function to get public ID from URL
export function getPublicIdFromUrl(url: string): string {
  const splits = url.split("/");
  const lastPart = splits[splits.length - 1];
  return lastPart.split(".")[0];
}
