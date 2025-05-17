import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
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
    const result = await query(
      'SELECT * FROM amenities ORDER BY name ASC'
    );

    res.status(200).json({
      status: 'success',
      results: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    next(new AppError('Error fetching amenities', 500));
  }
};

// Get amenity by ID
export const getAmenityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM amenities WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Amenity not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error fetching amenity', 500));
    }
  }
};

// Create new amenity (admin only)
export const createAmenity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const amenityData = amenitySchema.parse(req.body);

    // Insert amenity into database
    const result = await query(
      `INSERT INTO amenities (
        name, description, category, icon, image_url, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        amenityData.name,
        amenityData.description,
        amenityData.category,
        amenityData.icon || null,
        amenityData.image_url || null,
        amenityData.is_featured
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
      next(new AppError('Error creating amenity', 500));
    }
  }
};

// Update amenity (admin only)
export const updateAmenity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate request body
    const amenityData = amenitySchema.partial().parse(req.body);

    // Build the SET part of the query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Add each field that exists in amenityData to the updates array
    if (amenityData.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(amenityData.name);
    }
    if (amenityData.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(amenityData.description);
    }
    if (amenityData.category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(amenityData.category);
    }
    if (amenityData.icon !== undefined) {
      updates.push(`icon = $${paramIndex++}`);
      values.push(amenityData.icon);
    }
    if (amenityData.image_url !== undefined) {
      updates.push(`image_url = $${paramIndex++}`);
      values.push(amenityData.image_url);
    }
    if (amenityData.is_featured !== undefined) {
      updates.push(`is_featured = $${paramIndex++}`);
      values.push(amenityData.is_featured);
    }

    // Add updated_at to always update the timestamp
    updates.push(`updated_at = NOW()`);

    // If no fields to update, return the current amenity
    if (updates.length === 1) { // Only updated_at
      const result = await query('SELECT * FROM amenities WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        throw new AppError('Amenity not found', 404);
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
      `UPDATE amenities SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      throw new AppError('Amenity not found', 404);
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
      next(new AppError('Error updating amenity', 500));
    }
  }
};

// Delete amenity (admin only)
export const deleteAmenity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Delete amenity from database
    const result = await query(
      'DELETE FROM amenities WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Amenity not found', 404);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error deleting amenity', 500));
    }
  }
};
