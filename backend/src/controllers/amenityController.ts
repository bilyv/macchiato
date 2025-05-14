import { Request, Response } from 'express';
import { query } from '../config/database.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

// Get all amenities
export const getAmenities = asyncHandler(async (req: Request, res: Response) => {
  const result = await query('SELECT * FROM amenities ORDER BY name');

  const amenities = result.rows.map(amenity => ({
    id: amenity.id,
    name: amenity.name,
    description: amenity.description,
    iconName: amenity.icon_name,
    createdAt: amenity.created_at,
    updatedAt: amenity.updated_at
  }));

  res.status(200).json({
    success: true,
    count: amenities.length,
    data: amenities
  });
});

// Get single amenity
export const getAmenity = asyncHandler(async (req: Request, res: Response) => {
  const amenityId = req.params.id;

  const result = await query('SELECT * FROM amenities WHERE id = $1', [amenityId]);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Amenity not found');
  }

  const amenity = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: amenity.id,
      name: amenity.name,
      description: amenity.description,
      iconName: amenity.icon_name,
      createdAt: amenity.created_at,
      updatedAt: amenity.updated_at
    }
  });
});

// Create amenity (admin only)
export const createAmenity = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, iconName } = req.body;

  // Check if amenity with the same name already exists
  const amenityExists = await query('SELECT * FROM amenities WHERE name = $1', [name]);
  
  if (amenityExists.rows.length > 0) {
    throw new ApiError(400, 'Amenity with this name already exists');
  }

  // Create amenity
  const result = await query(
    'INSERT INTO amenities (name, description, icon_name) VALUES ($1, $2, $3) RETURNING *',
    [name, description, iconName]
  );

  const amenity = result.rows[0];

  res.status(201).json({
    success: true,
    data: {
      id: amenity.id,
      name: amenity.name,
      description: amenity.description,
      iconName: amenity.icon_name,
      createdAt: amenity.created_at,
      updatedAt: amenity.updated_at
    }
  });
});

// Update amenity (admin only)
export const updateAmenity = asyncHandler(async (req: Request, res: Response) => {
  const amenityId = req.params.id;
  const { name, description, iconName } = req.body;

  // Check if amenity exists
  const amenityExists = await query('SELECT * FROM amenities WHERE id = $1', [amenityId]);
  
  if (amenityExists.rows.length === 0) {
    throw new ApiError(404, 'Amenity not found');
  }

  // Check if name is being changed and if it conflicts with an existing amenity
  if (name && name !== amenityExists.rows[0].name) {
    const nameExists = await query(
      'SELECT * FROM amenities WHERE name = $1 AND id != $2',
      [name, amenityId]
    );
    
    if (nameExists.rows.length > 0) {
      throw new ApiError(400, 'Amenity with this name already exists');
    }
  }

  // Update amenity
  const result = await query(
    `UPDATE amenities 
     SET name = COALESCE($1, name), 
         description = COALESCE($2, description), 
         icon_name = COALESCE($3, icon_name),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4 
     RETURNING *`,
    [name || null, description || null, iconName || null, amenityId]
  );

  const amenity = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: amenity.id,
      name: amenity.name,
      description: amenity.description,
      iconName: amenity.icon_name,
      createdAt: amenity.created_at,
      updatedAt: amenity.updated_at
    }
  });
});

// Delete amenity (admin only)
export const deleteAmenity = asyncHandler(async (req: Request, res: Response) => {
  const amenityId = req.params.id;

  // Check if amenity exists
  const amenityExists = await query('SELECT * FROM amenities WHERE id = $1', [amenityId]);
  
  if (amenityExists.rows.length === 0) {
    throw new ApiError(404, 'Amenity not found');
  }

  // Delete amenity (cascade will delete related room_amenities)
  await query('DELETE FROM amenities WHERE id = $1', [amenityId]);

  res.status(200).json({
    success: true,
    data: {}
  });
});

export default {
  getAmenities,
  getAmenity,
  createAmenity,
  updateAmenity,
  deleteAmenity
};
