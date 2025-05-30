import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import cloudinary, { getPublicIdFromUrl } from '../config/cloudinary.js';

// Define Request type with file property for multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Validation schemas
const menuItemSchema = z.object({
  item_name: z.string().min(1, 'Item name is required'),
  category: z.enum(['breakfast', 'lunch', 'dinner'], {
    errorMap: () => ({ message: 'Category must be breakfast, lunch, or dinner' })
  }),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  preparation_time: z.number().positive('Preparation time must be positive'),
  tags: z.array(z.string()).default([])
});

const menuImageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['drinks', 'desserts', 'others'], {
    errorMap: () => ({ message: 'Category must be drinks, desserts, or others' })
  })
});

// Menu Items Controllers

// Get all menu items
export const getAllMenuItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;

    let queryText = 'SELECT * FROM menu_items ORDER BY created_at DESC';
    let queryParams: any[] = [];

    if (category) {
      queryText = 'SELECT * FROM menu_items WHERE category = $1 ORDER BY created_at DESC';
      queryParams = [category];
    }

    const result = await query(queryText, queryParams);

    // Convert price and preparation_time to numbers for proper frontend handling
    const processedRows = result.rows.map((row: any) => ({
      ...row,
      price: parseFloat(row.price) || 0,
      preparation_time: parseInt(row.preparation_time) || 0
    }));

    res.status(200).json({
      status: 'success',
      data: processedRows
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    next(new AppError('Error fetching menu items', 500));
  }
};

// Get menu item by ID
export const getMenuItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM menu_items WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Menu item not found', 404);
    }

    // Convert price and preparation_time to numbers for proper frontend handling
    const processedItem = {
      ...result.rows[0],
      price: parseFloat(result.rows[0].price) || 0,
      preparation_time: parseInt(result.rows[0].preparation_time) || 0
    };

    res.status(200).json({
      status: 'success',
      data: processedItem
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      console.error('Error fetching menu item:', error);
      next(new AppError('Error fetching menu item', 500));
    }
  }
};

// Create new menu item (admin only)
export const createMenuItem = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Parse tags if they come as a string
    if (typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (error) {
        req.body.tags = [];
      }
    }

    // Convert string numbers to actual numbers
    if (typeof req.body.price === 'string') {
      req.body.price = parseFloat(req.body.price);
    }
    if (typeof req.body.preparation_time === 'string') {
      req.body.preparation_time = parseInt(req.body.preparation_time);
    }

    // Validate request body
    const validatedData = menuItemSchema.parse(req.body);

    // Get image URL if file was uploaded
    const imageUrl = req.file ? req.file.path : null;

    // Insert menu item into database
    const result = await query(
      `INSERT INTO menu_items (item_name, category, description, price, preparation_time, tags, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        validatedData.item_name,
        validatedData.category,
        validatedData.description,
        validatedData.price,
        validatedData.preparation_time,
        validatedData.tags,
        imageUrl
      ]
    );

    // Convert price and preparation_time to numbers for proper frontend handling
    const processedItem = {
      ...result.rows[0],
      price: parseFloat(result.rows[0].price) || 0,
      preparation_time: parseInt(result.rows[0].preparation_time) || 0
    };

    res.status(201).json({
      status: 'success',
      data: processedItem
    });
  } catch (error) {
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
      next(new AppError(error.message, 400));
    } else {
      console.error('Error creating menu item:', error);
      next(new AppError('Error creating menu item', 500));
    }
  }
};

// Update menu item (admin only)
export const updateMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Parse tags if they come as a string
    if (typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (error) {
        req.body.tags = [];
      }
    }

    // Validate request body
    const validatedData = menuItemSchema.parse(req.body);

    // Update menu item in database
    const result = await query(
      `UPDATE menu_items
       SET item_name = $1, category = $2, description = $3, price = $4,
           preparation_time = $5, tags = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        validatedData.item_name,
        validatedData.category,
        validatedData.description,
        validatedData.price,
        validatedData.preparation_time,
        validatedData.tags,
        id
      ]
    );

    if (result.rowCount === 0) {
      throw new AppError('Menu item not found', 404);
    }

    // Convert price and preparation_time to numbers for proper frontend handling
    const processedItem = {
      ...result.rows[0],
      price: parseFloat(result.rows[0].price) || 0,
      preparation_time: parseInt(result.rows[0].preparation_time) || 0
    };

    res.status(200).json({
      status: 'success',
      data: processedItem
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.message, 400));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      console.error('Error updating menu item:', error);
      next(new AppError('Error updating menu item', 500));
    }
  }
};

// Delete menu item (admin only)
export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Get the menu item to check if it has an image
    const menuItemResult = await query(
      'SELECT image_url FROM menu_items WHERE id = $1',
      [id]
    );

    if (menuItemResult.rowCount === 0) {
      throw new AppError('Menu item not found', 404);
    }

    const menuItem = menuItemResult.rows[0];

    // Delete the menu item from database
    await query('DELETE FROM menu_items WHERE id = $1', [id]);

    // Delete image from Cloudinary if it exists
    if (menuItem.image_url) {
      try {
        const publicId = getPublicIdFromUrl(menuItem.image_url);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Don't fail the request if image deletion fails
      }
    }

    res.status(204).json({});
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      console.error('Error deleting menu item:', error);
      next(new AppError('Error deleting menu item', 500));
    }
  }
};

// Menu Images Controllers

// Get all menu images
export const getAllMenuImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;

    let queryText = 'SELECT * FROM menu_images ORDER BY created_at DESC';
    let queryParams: any[] = [];

    if (category) {
      queryText = 'SELECT * FROM menu_images WHERE category = $1 ORDER BY created_at DESC';
      queryParams = [category];
    }

    const result = await query(queryText, queryParams);

    res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching menu images:', error);
    next(new AppError('Error fetching menu images', 500));
  }
};

// Get menu image by ID
export const getMenuImageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM menu_images WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Menu image not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      console.error('Error fetching menu image:', error);
      next(new AppError('Error fetching menu image', 500));
    }
  }
};

// Create new menu image (admin only)
export const createMenuImage = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    if (!req.file) {
      throw new AppError('Image file is required', 400);
    }

    // Validate request body
    const validatedData = menuImageSchema.parse(req.body);

    // Insert menu image into database
    const result = await query(
      `INSERT INTO menu_images (title, category, image_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        validatedData.title,
        validatedData.category,
        req.file.path
      ]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
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
      next(new AppError(error.message, 400));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      console.error('Error creating menu image:', error);
      next(new AppError('Error creating menu image', 500));
    }
  }
};

// Delete menu image (admin only)
export const deleteMenuImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Get the menu image to get the image URL
    const menuImageResult = await query(
      'SELECT image_url FROM menu_images WHERE id = $1',
      [id]
    );

    if (menuImageResult.rowCount === 0) {
      throw new AppError('Menu image not found', 404);
    }

    const menuImage = menuImageResult.rows[0];

    // Delete the menu image from database
    await query('DELETE FROM menu_images WHERE id = $1', [id]);

    // Delete image from Cloudinary
    try {
      const publicId = getPublicIdFromUrl(menuImage.image_url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (cloudinaryError) {
      console.error('Error deleting image from Cloudinary:', cloudinaryError);
      // Don't fail the request if image deletion fails
    }

    res.status(204).json({});
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      console.error('Error deleting menu image:', error);
      next(new AppError('Error deleting menu image', 500));
    }
  }
};
