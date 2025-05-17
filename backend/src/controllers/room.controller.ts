import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { query, transaction } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Validation schemas
const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  description: z.string().min(1, 'Description is required'),
  price_per_night: z.number().positive('Price must be positive'),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  size_sqm: z.number().positive('Size must be positive'),
  bed_type: z.string().min(1, 'Bed type is required'),
  image_url: z.string().url('Image URL must be valid').optional(),
  amenities: z.array(z.string()).optional(),
  is_available: z.boolean().default(true)
});

// Get all rooms
export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(
      'SELECT * FROM rooms ORDER BY price_per_night ASC'
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

// Create new room (admin only)
export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const roomData = roomSchema.parse(req.body);

    // Insert room into database
    const result = await query(
      `INSERT INTO rooms (
        name, description, price_per_night, capacity, size_sqm,
        bed_type, image_url, amenities, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        roomData.name,
        roomData.description,
        roomData.price_per_night,
        roomData.capacity,
        roomData.size_sqm,
        roomData.bed_type,
        roomData.image_url || null,
        roomData.amenities || [],
        roomData.is_available
      ]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.message, 400));
    } else {
      next(new AppError('Error creating room', 500));
    }
  }
};

// Update room (admin only)
export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate request body
    const roomData = roomSchema.partial().parse(req.body);

    // Build the SET part of the query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Add each field that exists in roomData to the updates array
    if (roomData.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(roomData.name);
    }
    if (roomData.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(roomData.description);
    }
    if (roomData.price_per_night !== undefined) {
      updates.push(`price_per_night = $${paramIndex++}`);
      values.push(roomData.price_per_night);
    }
    if (roomData.capacity !== undefined) {
      updates.push(`capacity = $${paramIndex++}`);
      values.push(roomData.capacity);
    }
    if (roomData.size_sqm !== undefined) {
      updates.push(`size_sqm = $${paramIndex++}`);
      values.push(roomData.size_sqm);
    }
    if (roomData.bed_type !== undefined) {
      updates.push(`bed_type = $${paramIndex++}`);
      values.push(roomData.bed_type);
    }
    if (roomData.image_url !== undefined) {
      updates.push(`image_url = $${paramIndex++}`);
      values.push(roomData.image_url);
    }
    if (roomData.amenities !== undefined) {
      updates.push(`amenities = $${paramIndex++}`);
      values.push(roomData.amenities);
    }
    if (roomData.is_available !== undefined) {
      updates.push(`is_available = $${paramIndex++}`);
      values.push(roomData.is_available);
    }

    // Add updated_at to always update the timestamp
    updates.push(`updated_at = NOW()`);

    // If no fields to update, return the current room
    if (updates.length === 1) { // Only updated_at
      const result = await query('SELECT * FROM rooms WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        throw new AppError('Room not found', 404);
      }

      return res.status(200).json({
        status: 'success',
        data: result.rows[0]
      });
    }

    // Add the id parameter to the values array
    values.push(id);

    // Construct and execute the query
    const result = await query(
      `UPDATE rooms SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      throw new AppError('Room not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
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

    // Delete room from database
    const result = await query(
      'DELETE FROM rooms WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Room not found', 404);
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
