import { Request, Response } from 'express';
import { query } from '../config/database.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

// Get all rooms
export const getRooms = asyncHandler(async (req: Request, res: Response) => {
  const result = await query(`
    SELECT r.*, 
           ARRAY_AGG(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'description', a.description, 'icon_name', a.icon_name)) AS amenities
    FROM rooms r
    LEFT JOIN room_amenities ra ON r.id = ra.room_id
    LEFT JOIN amenities a ON ra.amenity_id = a.id
    GROUP BY r.id
    ORDER BY r.price_per_night ASC
  `);

  const rooms = result.rows.map(room => ({
    id: room.id,
    name: room.name,
    description: room.description,
    pricePerNight: parseFloat(room.price_per_night),
    capacity: room.capacity,
    roomType: room.room_type,
    imageUrl: room.image_url,
    isAvailable: room.is_available,
    amenities: room.amenities[0].id ? room.amenities : [],
    createdAt: room.created_at,
    updatedAt: room.updated_at
  }));

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms
  });
});

// Get single room
export const getRoom = asyncHandler(async (req: Request, res: Response) => {
  const roomId = req.params.id;

  const result = await query(`
    SELECT r.*, 
           ARRAY_AGG(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'description', a.description, 'icon_name', a.icon_name)) AS amenities
    FROM rooms r
    LEFT JOIN room_amenities ra ON r.id = ra.room_id
    LEFT JOIN amenities a ON ra.amenity_id = a.id
    WHERE r.id = $1
    GROUP BY r.id
  `, [roomId]);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Room not found');
  }

  const room = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: room.id,
      name: room.name,
      description: room.description,
      pricePerNight: parseFloat(room.price_per_night),
      capacity: room.capacity,
      roomType: room.room_type,
      imageUrl: room.image_url,
      isAvailable: room.is_available,
      amenities: room.amenities[0].id ? room.amenities : [],
      createdAt: room.created_at,
      updatedAt: room.updated_at
    }
  });
});

// Create room (admin only)
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const { 
    name, 
    description, 
    pricePerNight, 
    capacity, 
    roomType, 
    imageUrl, 
    isAvailable,
    amenities 
  } = req.body;

  const client = await query.pool.connect();

  try {
    await client.query('BEGIN');

    // Insert room
    const roomResult = await client.query(
      `INSERT INTO rooms (name, description, price_per_night, capacity, room_type, image_url, is_available) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, description, pricePerNight, capacity, roomType, imageUrl, isAvailable ?? true]
    );

    const room = roomResult.rows[0];

    // Add amenities if provided
    if (amenities && amenities.length > 0) {
      for (const amenityId of amenities) {
        await client.query(
          'INSERT INTO room_amenities (room_id, amenity_id) VALUES ($1, $2)',
          [room.id, amenityId]
        );
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: {
        id: room.id,
        name: room.name,
        description: room.description,
        pricePerNight: parseFloat(room.price_per_night),
        capacity: room.capacity,
        roomType: room.room_type,
        imageUrl: room.image_url,
        isAvailable: room.is_available,
        amenities: amenities || [],
        createdAt: room.created_at,
        updatedAt: room.updated_at
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

// Update room (admin only)
export const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const roomId = req.params.id;
  const { 
    name, 
    description, 
    pricePerNight, 
    capacity, 
    roomType, 
    imageUrl, 
    isAvailable,
    amenities 
  } = req.body;

  const client = await query.pool.connect();

  try {
    await client.query('BEGIN');

    // Check if room exists
    const roomExists = await client.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
    
    if (roomExists.rows.length === 0) {
      throw new ApiError(404, 'Room not found');
    }

    // Update room
    const roomResult = await client.query(
      `UPDATE rooms 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description), 
           price_per_night = COALESCE($3, price_per_night), 
           capacity = COALESCE($4, capacity), 
           room_type = COALESCE($5, room_type), 
           image_url = COALESCE($6, image_url), 
           is_available = COALESCE($7, is_available),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [
        name || null, 
        description || null, 
        pricePerNight || null, 
        capacity || null, 
        roomType || null, 
        imageUrl || null, 
        isAvailable === undefined ? null : isAvailable,
        roomId
      ]
    );

    // Update amenities if provided
    if (amenities) {
      // Remove existing amenities
      await client.query('DELETE FROM room_amenities WHERE room_id = $1', [roomId]);
      
      // Add new amenities
      if (amenities.length > 0) {
        for (const amenityId of amenities) {
          await client.query(
            'INSERT INTO room_amenities (room_id, amenity_id) VALUES ($1, $2)',
            [roomId, amenityId]
          );
        }
      }
    }

    await client.query('COMMIT');

    // Get updated room with amenities
    const result = await query(`
      SELECT r.*, 
             ARRAY_AGG(DISTINCT jsonb_build_object('id', a.id, 'name', a.name, 'description', a.description, 'icon_name', a.icon_name)) AS amenities
      FROM rooms r
      LEFT JOIN room_amenities ra ON r.id = ra.room_id
      LEFT JOIN amenities a ON ra.amenity_id = a.id
      WHERE r.id = $1
      GROUP BY r.id
    `, [roomId]);

    const room = result.rows[0];

    res.status(200).json({
      success: true,
      data: {
        id: room.id,
        name: room.name,
        description: room.description,
        pricePerNight: parseFloat(room.price_per_night),
        capacity: room.capacity,
        roomType: room.room_type,
        imageUrl: room.image_url,
        isAvailable: room.is_available,
        amenities: room.amenities[0].id ? room.amenities : [],
        createdAt: room.created_at,
        updatedAt: room.updated_at
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

// Delete room (admin only)
export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const roomId = req.params.id;

  // Check if room exists
  const roomExists = await query('SELECT * FROM rooms WHERE id = $1', [roomId]);
  
  if (roomExists.rows.length === 0) {
    throw new ApiError(404, 'Room not found');
  }

  // Delete room (cascade will delete related room_amenities)
  await query('DELETE FROM rooms WHERE id = $1', [roomId]);

  res.status(200).json({
    success: true,
    data: {}
  });
});

export default {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
};
