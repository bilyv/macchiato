import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseClient, supabaseAdmin } from '../config/supabase.js';
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
    const { data, error } = await supabaseClient
      .from('rooms')
      .select('*')
      .order('price_per_night', { ascending: true });

    if (error) {
      throw new AppError('Error fetching rooms', 500);
    }

    res.status(200).json({
      status: 'success',
      results: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Get room by ID
export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseClient
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AppError('Room not found', 404);
      }
      throw new AppError('Error fetching room', 500);
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Create new room (admin only)
export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const roomData = roomSchema.parse(req.body);

    // Insert room into database
    const { data, error } = await supabaseAdmin
      .from('rooms')
      .insert(roomData)
      .select()
      .single();

    if (error) {
      throw new AppError('Error creating room', 500);
    }

    res.status(201).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Update room (admin only)
export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate request body
    const roomData = roomSchema.partial().parse(req.body);

    // Update room in database
    const { data, error } = await supabaseAdmin
      .from('rooms')
      .update(roomData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Error updating room', 500);
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Delete room (admin only)
export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Delete room from database
    const { error } = await supabaseAdmin
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError('Error deleting room', 500);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
