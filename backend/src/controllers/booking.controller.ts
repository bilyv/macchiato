import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { query, transaction } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Validation schemas
const bookingSchema = z.object({
  room_id: z.string().uuid('Invalid room ID'),
  check_in_date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid check-in date format' }
  ),
  check_out_date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid check-out date format' }
  ),
  guests: z.number().int().positive('Number of guests must be positive'),
  special_requests: z.string().optional()
});

const bookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed'])
});

// Get all bookings (admin or user's own bookings)
export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    let sql = `
      SELECT
        b.*,
        r.name as room_name, r.price_per_night, r.capacity, r.image_url as room_image_url,
        u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
    `;

    const params: any[] = [];

    // If not admin, only show user's own bookings
    if (req.user.role !== 'admin') {
      sql += ' WHERE b.user_id = $1';
      params.push(req.user.id);
    }

    sql += ' ORDER BY b.created_at DESC';

    const result = await query(sql, params);

    // Transform the result to match the expected format
    const bookings = result.rows.map((row: any) => {
      const {
        room_name, price_per_night, capacity, room_image_url,
        user_email, user_first_name, user_last_name,
        ...booking
      } = row;

      return {
        ...booking,
        room: {
          id: booking.room_id,
          name: room_name,
          price_per_night,
          capacity,
          image_url: room_image_url
        },
        user: {
          id: booking.user_id,
          email: user_email,
          first_name: user_first_name,
          last_name: user_last_name
        }
      };
    });

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error fetching bookings', 500));
    }
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { id } = req.params;

    let sql = `
      SELECT
        b.*,
        r.name as room_name, r.description as room_description, r.price_per_night,
        r.capacity, r.size_sqm, r.bed_type, r.image_url as room_image_url, r.amenities as room_amenities,
        u.email as user_email, u.first_name as user_first_name, u.last_name as user_last_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = $1
    `;

    const params: any[] = [id];

    // If not admin, only allow access to user's own booking
    if (req.user.role !== 'admin') {
      sql += ' AND b.user_id = $2';
      params.push(req.user.id);
    }

    const result = await query(sql, params);

    if (result.rowCount === 0) {
      throw new AppError('Booking not found', 404);
    }

    // Transform the result to match the expected format
    const row = result.rows[0];
    const {
      room_name, room_description, price_per_night, capacity, size_sqm,
      bed_type, room_image_url, room_amenities,
      user_email, user_first_name, user_last_name,
      ...booking
    } = row;

    const bookingData = {
      ...booking,
      room: {
        id: booking.room_id,
        name: room_name,
        description: room_description,
        price_per_night,
        capacity,
        size_sqm,
        bed_type,
        image_url: room_image_url,
        amenities: room_amenities
      },
      user: {
        id: booking.user_id,
        email: user_email,
        first_name: user_first_name,
        last_name: user_last_name
      }
    };

    res.status(200).json({
      status: 'success',
      data: bookingData
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error fetching booking', 500));
    }
  }
};

// Create new booking
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Validate request body
    const validatedData = bookingSchema.parse(req.body);
    const { room_id, check_in_date, check_out_date, guests, special_requests } = validatedData;

    // Use a transaction for the booking process
    const bookingData = await transaction(async (client) => {
      // Check if room exists and get price
      const roomResult = await client.query(
        'SELECT id, price_per_night, capacity FROM rooms WHERE id = $1',
        [room_id]
      );

      if (roomResult.rowCount === 0) {
        throw new AppError('Room not found', 404);
      }

      const room = roomResult.rows[0];

      // Check if room capacity is sufficient
      if (guests > room.capacity) {
        throw new AppError(`Room capacity (${room.capacity}) exceeded`, 400);
      }

      // Calculate total price
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);

      // Validate dates
      if (checkIn >= checkOut) {
        throw new AppError('Check-out date must be after check-in date', 400);
      }

      if (checkIn < new Date()) {
        throw new AppError('Check-in date cannot be in the past', 400);
      }

      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * room.price_per_night;

      // Check if room is available for the selected dates
      const availabilityResult = await client.query(
        `SELECT id FROM bookings
         WHERE room_id = $1
         AND status != 'cancelled'
         AND (
           (check_in_date <= $2 AND check_out_date >= $2) OR
           (check_in_date <= $3 AND check_out_date >= $3) OR
           (check_in_date >= $2 AND check_out_date <= $3)
         )`,
        [room_id, check_out_date, check_in_date]
      );

      if (availabilityResult && availabilityResult.rowCount && availabilityResult.rowCount > 0) {
        throw new AppError('Room is not available for the selected dates', 400);
      }

      // Create booking
      const bookingResult = await client.query(
        `INSERT INTO bookings (
          user_id, room_id, check_in_date, check_out_date,
          guests, special_requests, total_price, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          req.user!.id, // We've already checked req.user exists above
          room_id,
          check_in_date,
          check_out_date,
          guests,
          special_requests || null,
          totalPrice,
          'pending'
        ]
      );

      return bookingResult.rows[0];
    });

    res.status(201).json({
      status: 'success',
      data: bookingData
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.message, 400));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error creating booking', 500));
    }
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = bookingStatusSchema.parse(req.body);

    // Update booking status
    const result = await query(
      `UPDATE bookings
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Booking not found', 404);
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
      next(new AppError('Error updating booking status', 500));
    }
  }
};

// Cancel booking (user can cancel their own booking)
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { id } = req.params;

    // Use a transaction for the cancellation process
    const bookingData = await transaction(async (client) => {
      // Get booking to check ownership
      let bookingQuery = 'SELECT id, user_id, status FROM bookings WHERE id = $1';
      const params = [id];

      // If not admin, only allow cancellation of user's own booking
      if (req.user!.role !== 'admin') {
        bookingQuery += ' AND user_id = $2';
        params.push(req.user!.id);
      }

      const bookingResult = await client.query(bookingQuery, params);

      if (bookingResult.rowCount === 0) {
        throw new AppError('Booking not found', 404);
      }

      const booking = bookingResult.rows[0];

      if (booking.status === 'cancelled') {
        throw new AppError('Booking is already cancelled', 400);
      }

      if (booking.status === 'completed') {
        throw new AppError('Cannot cancel a completed booking', 400);
      }

      // Update booking status to cancelled
      const updateResult = await client.query(
        `UPDATE bookings
         SET status = 'cancelled', updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      return updateResult.rows[0];
    });

    res.status(200).json({
      status: 'success',
      data: bookingData
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Error cancelling booking', 500));
    }
  }
};
