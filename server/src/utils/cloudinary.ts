import { v2 as cloudinary } from 'cloudinary';
import {AppError} from "../types/custom.types.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'avatars'
): Promise<CloudinaryResponse> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 500, height: 500, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new AppError('Failed to upload image', 500);
  }
};