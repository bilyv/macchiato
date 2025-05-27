import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import cloudinary, { getPublicIdFromUrl } from '../config/cloudinary.js';

// Define Request type with file property for multer
interface MulterRequest extends Request {
  file?: {
    path: string;
    filename: string;
    [key: string]: any;
  };
}

// Validation schema for gallery image
const galleryImageSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  category: z.enum(['attractions', 'neighbourhood', 'foods', 'events'], {
    errorMap: () => ({ message: 'Category must be one of: attractions, neighbourhood, foods, events' })
  })
});

// Get all gallery images
export const getAllGalleryImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category as string | undefined;

    let queryText = 'SELECT * FROM gallery_images';
    const queryParams: any[] = [];

    if (category) {
      queryText += ' WHERE category = $1';
      queryParams.push(category);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, queryParams);

    res.status(200).json({
      status: 'success',
      results: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(new AppError('Error fetching gallery images', 500));
  }
};

// Get gallery image by ID
export const getGalleryImageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM gallery_images WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      throw new AppError('Gallery image not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error fetching gallery image', 500));
    }
  }
};

// Create new gallery image
export const createGalleryImage = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Validate request body
    const imageData = galleryImageSchema.parse(req.body);

    // Check if image was uploaded
    if (!req.file) {
      throw new AppError('Image file is required', 400);
    }

    // Get image URL from Cloudinary
    const imageUrl = req.file.path;

    // Insert gallery image into database
    const result = await query(
      `INSERT INTO gallery_images (
        title, description, category, image_url
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        imageData.title,
        imageData.description || '',
        imageData.category,
        imageUrl
      ]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    // Log the actual error for debugging
    console.error('Gallery creation error:', error);

    // If there was an uploaded file but the database operation failed, delete the uploaded image
    if (req.file && req.file.path) {
      try {
        const publicId = getPublicIdFromUrl(req.file.path);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    }

    if (error instanceof z.ZodError) {
      next(new AppError(`Validation error: ${error.errors.map(e => e.message).join(', ')}`, 400));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(`Error creating gallery image: ${error instanceof Error ? error.message : 'Unknown error'}`, 500));
    }
  }
};

// Delete gallery image
export const deleteGalleryImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Get the image URL before deleting
    const imageResult = await query('SELECT image_url FROM gallery_images WHERE id = $1', [id]);

    if (imageResult.rowCount === 0) {
      throw new AppError('Gallery image not found', 404);
    }

    const imageUrl = imageResult.rows[0].image_url;

    // Delete from database
    await query('DELETE FROM gallery_images WHERE id = $1', [id]);

    // Delete from Cloudinary
    if (imageUrl) {
      try {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error deleting gallery image', 500));
    }
  }
};
