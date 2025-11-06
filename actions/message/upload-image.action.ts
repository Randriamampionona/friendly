"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const FOLDER_NAME = process.env.CLOUDINARY_FOLDER_NAME!;
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET!; // ?? your preset name

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  [key: string]: any;
};

export async function uploadImageAction(file: File): Promise<string | null> {
  try {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("Invalid file type");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: FOLDER_NAME,
            upload_preset: UPLOAD_PRESET, // ? using preset
            resource_type: "image",
            transformation: [
              { width: 1200, height: 1200, crop: "limit" },
              { fetch_format: "auto", quality: "auto" },
            ],
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );

        uploadStream.end(buffer);
      }
    );

    console.log("? Cloudinary upload success:", uploadResult.secure_url);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("? Cloudinary upload failed:", error);
    return null;
  }
}
