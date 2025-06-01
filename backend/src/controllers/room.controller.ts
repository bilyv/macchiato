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
const roomSchema = z.object({
  room_number: z.union([
    z.number().int().positive('Room number must be a positive integer'),
    z.string().transform(val => parseInt(val) || 0)
  ]).refine(val => val > 0, 'Room number must be a positive integer'),
  description: z.string().min(1, 'Description is required'),
  price_per_night: z.union([
    z.number().positive('Price must be positive'),
    z.string().transform(val => parseFloat(val) || 0)
  ]).refine(val => val > 0, 'Price must be positive'),
  capacity: z.union([
    z.number().int().positive('Capacity must be a positive integer'),
    z.string().transform(val => parseInt(val) || 0)
  ]).refine(val => val > 0, 'Capacity must be a positive integer'),
  room_type: z.string().min(1, 'Room type is required'),
  amenities: z.array(z.string()).optional(),
  is_available: z.boolean().default(true),
  is_website_visible: z.boolean().default(false)
});

// Get all rooms (admin access - includes all rooms regardless of visibility)
export const getAllRooms = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      'SELECT * FROM rooms ORDER BY room_number ASC'
    );

    res.status(200).json({
      status: 'success',
      results: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(new AppError('Error fetching rooms', 500));
  }
};

// Get website-visible rooms only (public access - only shows approved rooms)
export const getWebsiteRooms = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      'SELECT * FROM rooms WHERE is_website_visible = true ORDER BY room_number ASC'
    );

    res.status(200).json({
      status: 'success',
      results: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(new AppError('Error fetching website rooms', 500));
  }
};

// Get room by ID
export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM rooms WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Room not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error fetching room', 500));
    }
  }
};

// Get room by room number
export const getRoomByNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomNumber } = req.params;
    const roomNum = parseInt(roomNumber);

    if (isNaN(roomNum) || roomNum <= 0) {
      throw new AppError('Invalid room number', 400);
    }

    const result = await query(
      'SELECT * FROM rooms WHERE room_number = $1',
      [roomNum]
    );

    if (result.rowCount === 0) {
      throw new AppError('Room not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error fetching room', 500));
    }
  }
};

// Create new room (admin only)
export const createRoom = async (req: MulterRequest, res: Response, next: NextFunction) => {
  let roomData: any = null; // Declare roomData outside try block

  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Parse and validate the request body
    try {
      const parsedData = JSON.parse(req.body.data || '{}');
      console.log('Parsed data for create:', parsedData);
      roomData = roomSchema.parse(parsedData);
    } catch (parseError) {
      console.error('Error parsing room data:', parseError);
      if (parseError instanceof SyntaxError) {
        throw new AppError('Invalid JSON format in room data', 400);
      } else if (parseError instanceof z.ZodError) {
        const errorDetails = parseError.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new AppError(`Validation error: ${errorDetails}`, 400);
      } else {
        throw new AppError('Invalid room data format', 400);
      }
    }

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      // Image was uploaded, store the path
      imageUrl = req.file.path;
      console.log('Image uploaded to:', imageUrl);
    }

    // Insert room into database
    const result = await query(
      `INSERT INTO rooms (
        room_number, description, price_per_night, capacity,
        room_type, image_url, amenities, is_available, is_website_visible
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        roomData.room_number,
        roomData.description,
        roomData.price_per_night,
        roomData.capacity,
        roomData.room_type,
        imageUrl,
        roomData.amenities || [],
        roomData.is_available,
        roomData.is_website_visible || false
      ]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in createRoom:', error);

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
      const errorDetails = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      next(new AppError(`Validation error: ${errorDetails}`, 400));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      console.error('Unexpected error creating room:', error);

      // Handle specific database errors
      if (error instanceof Error) {
        if (error.message.includes('duplicate key value violates unique constraint "rooms_room_number_key"')) {
          const roomNumber = roomData?.room_number || 'unknown';
          next(new AppError(`Room number ${roomNumber} already exists. Please choose a different room number.`, 409));
        } else {
          next(new AppError(`Error creating room: ${error.message}`, 500));
        }
      } else if (error && typeof error === 'object' && 'code' in error) {
        // Handle Supabase-specific errors
        const supabaseError = error as any;
        if (supabaseError.code === '23505' && supabaseError.message.includes('rooms_room_number_key')) {
          const roomNumber = roomData?.room_number || 'unknown';
          next(new AppError(`Room number ${roomNumber} already exists. Please choose a different room number.`, 409));
        } else {
          next(new AppError(`Error creating room: ${supabaseError.message || 'Database error'}`, 500));
        }
      } else {
        next(new AppError('Error creating room: Unknown error', 500));
      }
    }
  }
};

// Update room (admin only)
export const updateRoom = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    console.log('Update request body:', req.body);
    console.log('Update request file:', req.file);

    // Parse and validate the request body
    let roomData;
    try {
      const parsedData = JSON.parse(req.body.data || '{}');
      console.log('Parsed data for update:', parsedData);
      roomData = roomSchema.parse(parsedData);
    } catch (parseError) {
      console.error('Error parsing room data for update:', parseError);
      if (parseError instanceof SyntaxError) {
        throw new AppError('Invalid JSON format in room data', 400);
      } else if (parseError instanceof z.ZodError) {
        const errorDetails = parseError.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new AppError(`Validation error: ${errorDetails}`, 400);
      } else {
        throw new AppError('Invalid room data format', 400);
      }
    }

    // Check if room exists
    const checkResult = await query('SELECT * FROM rooms WHERE id = $1', [id]);
    if (checkResult.rowCount === 0) {
      throw new AppError('Room not found', 404);
    }

    const existingRoom = checkResult.rows[0];

    // Handle image upload
    let imageUrl = existingRoom.image_url;
    if (req.file) {
      // New image was uploaded, update the path
      imageUrl = req.file.path;

      // Delete old image if it exists
      if (existingRoom.image_url) {
        try {
          const publicId = getPublicIdFromUrl(existingRoom.image_url);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (cloudinaryError) {
          console.error('Error deleting old image from Cloudinary:', cloudinaryError);
        }
      }
    }

    // Update room in database
    const result = await query(
      `UPDATE rooms SET
        room_number = $1,
        description = $2,
        price_per_night = $3,
        capacity = $4,
        room_type = $5,
        image_url = $6,
        amenities = $7,
        is_available = $8,
        is_website_visible = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *`,
      [
        roomData.room_number,
        roomData.description,
        roomData.price_per_night,
        roomData.capacity,
        roomData.room_type,
        imageUrl,
        roomData.amenities || [],
        roomData.is_available,
        roomData.is_website_visible !== undefined ? roomData.is_website_visible : existingRoom.is_website_visible,
        id
      ]
    );

    res.status(200).json({
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
      next(new AppError('Error updating room', 500));
    }
  }
};

// Delete room (admin only)
export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if room exists and get image URL
    const checkResult = await query('SELECT image_url FROM rooms WHERE id = $1', [id]);
    if (checkResult.rowCount === 0) {
      throw new AppError('Room not found', 404);
    }

    const imageUrl = checkResult.rows[0].image_url;

    // Delete room from database
    await query(
      'DELETE FROM rooms WHERE id = $1 RETURNING id',
      [id]
    );

    // Delete image from Cloudinary if it exists
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
      next(new AppError('Error deleting room', 500));
    }
  }
};

// Add rooms to website (make them visible)
export const addRoomsToSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('addRoomsToSite - Request body:', req.body);
    console.log('addRoomsToSite - Request body type:', typeof req.body);

    const { roomIds } = req.body;
    console.log('addRoomsToSite - Extracted roomIds:', roomIds);
    console.log('addRoomsToSite - roomIds type:', typeof roomIds);

    // Validate input
    if (!Array.isArray(roomIds) || roomIds.length === 0) {
      throw new AppError('Room IDs array is required and cannot be empty', 400);
    }

    // Update rooms to make them website visible
    const placeholders = roomIds.map((_, index) => `$${index + 1}`).join(', ');
    const result = await query(
      `UPDATE rooms SET
        is_website_visible = true,
        updated_at = NOW()
      WHERE id IN (${placeholders})
      RETURNING *`,
      roomIds
    );

    if (result.rowCount === 0) {
      throw new AppError('No rooms found with the provided IDs', 404);
    }

    res.status(200).json({
      status: 'success',
      message: `${result.rowCount} room(s) added to website`,
      data: result.rows
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error adding rooms to website', 500));
    }
  }
};

// Remove rooms from website (make them not visible)
export const removeRoomsFromSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomIds } = req.body;

    // Validate input
    if (!Array.isArray(roomIds) || roomIds.length === 0) {
      throw new AppError('Room IDs array is required and cannot be empty', 400);
    }

    // Update rooms to make them not website visible
    const placeholders = roomIds.map((_, index) => `$${index + 1}`).join(', ');
    const result = await query(
      `UPDATE rooms SET
        is_website_visible = false,
        updated_at = NOW()
      WHERE id IN (${placeholders})
      RETURNING *`,
      roomIds
    );

    if (result.rowCount === 0) {
      throw new AppError('No rooms found with the provided IDs', 404);
    }

    res.status(200).json({
      status: 'success',
      message: `${result.rowCount} room(s) removed from website`,
      data: result.rows
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error removing rooms from website', 500));
    }
  }
};
