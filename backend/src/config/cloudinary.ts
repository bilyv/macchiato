import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary with validation
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dji23iymw';
const apiKey = process.env.CLOUDINARY_API_KEY || '153258216349693';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '8NOP8q7Rve2FjOomgk8j84sXFCk';

// Validate that we don't have placeholder values
if (apiKey === 'your_api_key' || apiSecret === 'your_api_secret') {
  console.warn('⚠️  Cloudinary is using placeholder credentials. Image uploads may fail.');
  console.warn('   Please update CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your .env file');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// Test Cloudinary connection
cloudinary.api.ping()
  .then(() => {
    console.log('✅ Cloudinary connection successful');
  })
  .catch((error) => {
    console.warn('⚠️  Cloudinary connection failed:', error.message);
    console.warn('   Image uploads will not work until Cloudinary is properly configured');
  });

// Define CloudinaryStorage params type
export interface CloudinaryStorageParams {
  folder: string;
  allowed_formats: string[];
  transformation: Array<{
    width: number;
    height: number;
    crop: string;
  }>;
}

// Create and export Cloudinary storage for rooms
export const roomsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'macchiato-rooms',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  } as CloudinaryStorageParams
});

// Create and export Cloudinary storage for gallery images
export const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'macchiato-gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  } as CloudinaryStorageParams
});

// Create and export Cloudinary storage for menu images
export const menuStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'macchiato-menu',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  } as CloudinaryStorageParams
});

/**
 * Helper function to extract public ID from Cloudinary URL
 * @param cloudinaryUrl - The full Cloudinary URL
 * @returns The public ID or null if not found
 */
export const getPublicIdFromUrl = (cloudinaryUrl: string | null): string | null => {
  if (!cloudinaryUrl) return null;

  try {
    // Extract the public ID from the URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    const urlParts = cloudinaryUrl.split('/');
    const fileNameWithExt = urlParts[urlParts.length - 1];
    const publicId = fileNameWithExt.split('.')[0];

    // If the URL includes a folder, include it in the public ID
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
      // Get all parts after 'upload' except the last one (which is the filename)
      const folderPath = urlParts.slice(uploadIndex + 1, urlParts.length - 1).join('/');
      if (folderPath) {
        return `${folderPath}/${publicId}`;
      }
    }

    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from Cloudinary URL:', error);
    return null;
  }
};

export default cloudinary;
