import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Validation schema for booking creation
const createBookingSchema = z.object({
  guest_name: z.string().min(2, 'Guest name must be at least 2 characters'),
  guest_email: z.string().email('Invalid email address'),
  guest_phone: z.string().optional(),
  room_id: z.string().uuid('Invalid room ID'),
  check_in_date: z.string().refine((date) => {
    const checkIn = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkIn >= today;
  }, 'Check-in date must be today or in the future'),
  check_out_date: z.string(),
  number_of_guests: z.number().int().min(1, 'Number of guests must be at least 1'),
  special_requests: z.string().optional()
}).refine((data) => {
  const checkIn = new Date(data.check_in_date);
  const checkOut = new Date(data.check_out_date);
  return checkOut > checkIn;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['check_out_date']
});

// Validation schema for booking status update
const updateBookingStatusSchema = z.object({
  booking_status: z.enum(['pending', 'confirmed', 'cancelled', 'completed'])
});

// Get all bookings (admin) or user's bookings
export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, room_id, guest_email, page = 1, limit = 10 } = req.query;

    // Build base query for bookings
    let bookingsQuery = 'SELECT * FROM bookings WHERE 1=1';
    const queryParams: any[] = [];
    let paramCount = 0;

    // Add filters
    if (status) {
      paramCount++;
      bookingsQuery += ` AND booking_status = $${paramCount}`;
      queryParams.push(status);
    }

    if (room_id) {
      paramCount++;
      bookingsQuery += ` AND room_id = $${paramCount}`;
      queryParams.push(room_id);
    }

    if (guest_email) {
      paramCount++;
      bookingsQuery += ` AND guest_email ILIKE $${paramCount}`;
      queryParams.push(`%${guest_email}%`);
    }

    // Add pagination
    bookingsQuery += ` ORDER BY created_at DESC`;

    const offset = (Number(page) - 1) * Number(limit);
    paramCount++;
    bookingsQuery += ` LIMIT $${paramCount}`;
    queryParams.push(Number(limit));

    paramCount++;
    bookingsQuery += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const bookingsResult = await query(bookingsQuery, queryParams);
    const bookings = bookingsResult.rows;

    // Get room details for each booking separately (to avoid complex JOINs)
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking: any) => {
        try {
          const roomResult = await query('SELECT room_number, room_type, price_per_night FROM rooms WHERE id = $1', [booking.room_id]);
          const room = roomResult.rows[0];
          return {
            ...booking,
            room_number: room?.room_number,
            room_type: room?.room_type,
            price_per_night: room?.price_per_night
          };
        } catch (error) {
          console.error('Error fetching room details for booking:', booking.id, error);
          return booking; // Return booking without room details if room fetch fails
        }
      })
    );

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 0;

    if (status) {
      countParamCount++;
      countQuery += ` AND booking_status = $${countParamCount}`;
      countParams.push(status);
    }

    if (room_id) {
      countParamCount++;
      countQuery += ` AND room_id = $${countParamCount}`;
      countParams.push(room_id);
    }

    if (guest_email) {
      countParamCount++;
      countQuery += ` AND guest_email ILIKE $${countParamCount}`;
      countParams.push(`%${guest_email}%`);
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.status(200).json({
      status: 'success',
      data: enrichedBookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    next(new AppError('Failed to fetch bookings', 500));
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Get booking details
    const bookingResult = await query('SELECT * FROM bookings WHERE id = $1', [id]);

    if (bookingResult.rows.length === 0) {
      return next(new AppError('Booking not found', 404));
    }

    const booking = bookingResult.rows[0];

    // Get room details separately
    try {
      const roomResult = await query(`
        SELECT room_number, room_type, price_per_night, description, image_url
        FROM rooms WHERE id = $1
      `, [booking.room_id]);

      const room = roomResult.rows[0];

      const enrichedBooking = {
        ...booking,
        room_number: room?.room_number,
        room_type: room?.room_type,
        price_per_night: room?.price_per_night,
        room_description: room?.description,
        room_image_url: room?.image_url
      };

      res.status(200).json({
        status: 'success',
        data: enrichedBooking
      });
    } catch (roomError) {
      console.error('Error fetching room details:', roomError);
      // Return booking without room details if room fetch fails
      res.status(200).json({
        status: 'success',
        data: booking
      });
    }
  } catch (error) {
    console.error('Error fetching booking:', error);
    next(new AppError('Failed to fetch booking', 500));
  }
};

// Create a new booking
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('=== BOOKING CREATION REQUEST ===');
    console.log('Raw request body:', req.body);
    console.log('Request body type:', typeof req.body);
    console.log('Request headers:', req.headers);

    // Handle potential double-encoded JSON
    let parsedBody = req.body;

    // If the body is a string, try to parse it as JSON
    if (typeof req.body === 'string') {
      try {
        console.log('Body is string, attempting to parse JSON...');
        parsedBody = JSON.parse(req.body);
        console.log('Successfully parsed JSON from string:', parsedBody);
      } catch (parseError) {
        console.error('Failed to parse JSON from string:', parseError);
        return next(new AppError('Invalid JSON format in request body', 400));
      }
    }

    // If the body has a nested structure (like from form data), extract the data
    if (parsedBody && typeof parsedBody === 'object' && parsedBody.data) {
      try {
        console.log('Found nested data property, attempting to parse...');
        if (typeof parsedBody.data === 'string') {
          parsedBody = JSON.parse(parsedBody.data);
          console.log('Successfully parsed nested JSON data:', parsedBody);
        } else {
          parsedBody = parsedBody.data;
          console.log('Using nested data object directly:', parsedBody);
        }
      } catch (parseError) {
        console.error('Failed to parse nested JSON data:', parseError);
        return next(new AppError('Invalid JSON format in nested data', 400));
      }
    }

    console.log('Final parsed body for validation:', parsedBody);

    // Validate request body
    const bookingData = createBookingSchema.parse(parsedBody);

    // Check if room exists and is available
    const roomResult = await query(`
      SELECT id, price_per_night, capacity, is_available
      FROM rooms
      WHERE id = $1 AND is_available = true
    `, [bookingData.room_id]);

    if (roomResult.rows.length === 0) {
      return next(new AppError('Room not found or not available', 404));
    }

    const room = roomResult.rows[0];

    // Check if number of guests exceeds room capacity
    if (bookingData.number_of_guests > room.capacity) {
      return next(new AppError(`Room capacity is ${room.capacity} guests`, 400));
    }

    // Calculate total amount (number of nights * price per night)
    const checkInDate = new Date(bookingData.check_in_date);
    const checkOutDate = new Date(bookingData.check_out_date);
    const numberOfNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = numberOfNights * parseFloat(room.price_per_night);

    // Check for overlapping bookings
    const overlapResult = await query(`
      SELECT id FROM bookings
      WHERE room_id = $1
      AND booking_status IN ('pending', 'confirmed')
      AND (
        (check_in_date <= $2 AND check_out_date > $2) OR
        (check_in_date < $3 AND check_out_date >= $3) OR
        (check_in_date >= $2 AND check_out_date <= $3)
      )
    `, [bookingData.room_id, bookingData.check_in_date, bookingData.check_out_date]);

    if (overlapResult.rows.length > 0) {
      return next(new AppError('Room is not available for the selected dates', 409));
    }

    // Create the booking
    const result = await query(`
      INSERT INTO bookings (
        guest_name, guest_email, guest_phone, room_id,
        check_in_date, check_out_date, number_of_guests,
        special_requests, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      bookingData.guest_name,
      bookingData.guest_email,
      bookingData.guest_phone || null,
      bookingData.room_id,
      bookingData.check_in_date,
      bookingData.check_out_date,
      bookingData.number_of_guests,
      bookingData.special_requests || null,
      totalAmount
    ]);

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('=== BOOKING CREATION ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error details:', error);

    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return next(new AppError(`Validation error: ${errorMessages}`, 400));
    }

    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.error('JSON parsing error in booking creation');
      return next(new AppError('Invalid JSON format in request body', 400));
    }

    console.error('Unexpected error creating booking:', error);
    next(new AppError('Failed to create booking', 500));
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { booking_status } = updateBookingStatusSchema.parse(req.body);

    const result = await query(`
      UPDATE bookings
      SET booking_status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [booking_status, id]);

    if (result.rows.length === 0) {
      return next(new AppError('Booking not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking status updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0].message, 400));
    }
    console.error('Error updating booking status:', error);
    next(new AppError('Failed to update booking status', 500));
  }
};

// Cancel booking
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(`
      UPDATE bookings
      SET booking_status = 'cancelled', updated_at = NOW()
      WHERE id = $1 AND booking_status IN ('pending', 'confirmed')
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return next(new AppError('Booking not found or cannot be cancelled', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    next(new AppError('Failed to cancel booking', 500));
  }
};

// Delete booking (admin only)
export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(`
      DELETE FROM bookings
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return next(new AppError('Booking not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    next(new AppError('Failed to delete booking', 500));
  }
};
