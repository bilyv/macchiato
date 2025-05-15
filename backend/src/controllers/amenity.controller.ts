import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseClient, supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

// Validation schemas
const amenitySchema = z.object({
  name: z.string().min(1, 'Amenity name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  icon: z.string().optional(),
  image_url: z.string().url('Image URL must be valid').optional(),
  is_featured: z.boolean().default(false)
});

// Get all amenities
export const getAllAmenities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabaseClient
      .from('amenities')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new AppError('Error fetching amenities', 500);
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

// Get amenity by ID
export const getAmenityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseClient
      .from('amenities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AppError('Amenity not found', 404);
      }
      throw new AppError('Error fetching amenity', 500);
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Create new amenity (admin only)
export const createAmenity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const amenityData = amenitySchema.parse(req.body);

    // Insert amenity into database
    const { data, error } = await supabaseAdmin
      .from('amenities')
      .insert(amenityData)
      .select()
      .single();

    if (error) {
      throw new AppError('Error creating amenity', 500);
    }

    res.status(201).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Update amenity (admin only)
export const updateAmenity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate request body
    const amenityData = amenitySchema.partial().parse(req.body);

    // Update amenity in database
    const { data, error } = await supabaseAdmin
      .from('amenities')
      .update(amenityData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Error updating amenity', 500);
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Delete amenity (admin only)
export const deleteAmenity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Delete amenity from database
    const { error } = await supabaseAdmin
      .from('amenities')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError('Error deleting amenity', 500);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
