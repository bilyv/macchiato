import { Request, Response } from 'express';
import { query } from '../config/database.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

// Get all bookings (admin) or user bookings (customer)
export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  
  let result;
  
  if (userRole === 'admin') {
    // Admins can see all bookings
    result = await query(`
      SELECT b.*, 
             jsonb_build_object(
               'id', r.id, 
               'name', r.name, 
               'price_per_night', r.price_per_night,
               'image_url', r.image_url
             ) AS room,
             jsonb_build_object(
               'id', u.id, 
               'email', u.email, 
               'first_name', u.first_name, 
               'last_name', u.last_name
             ) AS user
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.check_in_date DESC
    `);
  } else {
    // Regular users can only see their own bookings
    result = await query(`
      SELECT b.*, 
             jsonb_build_object(
               'id', r.id, 
               'name', r.name, 
               'price_per_night', r.price_per_night,
               'image_url', r.image_url
             ) AS room
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.user_id = $1
      ORDER BY b.check_in_date DESC
    `, [userId]);
  }

  const bookings = result.rows.map(booking => ({
    id: booking.id,
    checkInDate: booking.check_in_date,
    checkOutDate: booking.check_out_date,
    totalPrice: parseFloat(booking.total_price),
    status: booking.status,
    room: booking.room,
    user: booking.user || undefined,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at
  }));

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// Get single booking
export const getBooking = asyncHandler(async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  let result;
  
  if (userRole === 'admin') {
    // Admins can see any booking
    result = await query(`
      SELECT b.*, 
             jsonb_build_object(
               'id', r.id, 
               'name', r.name, 
               'price_per_night', r.price_per_night,
               'image_url', r.image_url
             ) AS room,
             jsonb_build_object(
               'id', u.id, 
               'email', u.email, 
               'first_name', u.first_name, 
               'last_name', u.last_name
             ) AS user
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = $1
    `, [bookingId]);
  } else {
    // Regular users can only see their own bookings
    result = await query(`
      SELECT b.*, 
             jsonb_build_object(
               'id', r.id, 
               'name', r.name, 
               'price_per_night', r.price_per_night,
               'image_url', r.image_url
             ) AS room
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = $1 AND b.user_id = $2
    `, [bookingId, userId]);
  }

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Booking not found');
  }

  const booking = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: booking.id,
      checkInDate: booking.check_in_date,
      checkOutDate: booking.check_out_date,
      totalPrice: parseFloat(booking.total_price),
      status: booking.status,
      room: booking.room,
      user: booking.user || undefined,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }
  });
});

// Create booking
export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { roomId, checkInDate, checkOutDate } = req.body;

  // Validate dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  if (checkIn >= checkOut) {
    throw new ApiError(400, 'Check-out date must be after check-in date');
  }

  if (checkIn < new Date()) {
    throw new ApiError(400, 'Check-in date cannot be in the past');
  }

  // Check if room exists and is available
  const roomResult = await query('SELECT * FROM rooms WHERE id = $1', [roomId]);
  
  if (roomResult.rows.length === 0) {
    throw new ApiError(404, 'Room not found');
  }

  const room = roomResult.rows[0];
  
  if (!room.is_available) {
    throw new ApiError(400, 'Room is not available for booking');
  }

  // Check if room is already booked for the selected dates
  const conflictResult = await query(`
    SELECT * FROM bookings 
    WHERE room_id = $1 
    AND status != 'cancelled'
    AND (
      (check_in_date <= $2 AND check_out_date > $2) OR
      (check_in_date < $3 AND check_out_date >= $3) OR
      (check_in_date >= $2 AND check_out_date <= $3)
    )
  `, [roomId, checkInDate, checkOutDate]);

  if (conflictResult.rows.length > 0) {
    throw new ApiError(400, 'Room is already booked for the selected dates');
  }

  // Calculate number of nights and total price
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = parseFloat(room.price_per_night) * nights;

  // Create booking
  const bookingResult = await query(
    `INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price, status) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [userId, roomId, checkInDate, checkOutDate, totalPrice, 'confirmed']
  );

  const booking = bookingResult.rows[0];

  res.status(201).json({
    success: true,
    data: {
      id: booking.id,
      userId: booking.user_id,
      roomId: booking.room_id,
      checkInDate: booking.check_in_date,
      checkOutDate: booking.check_out_date,
      totalPrice: parseFloat(booking.total_price),
      status: booking.status,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }
  });
});

// Update booking status (admin only)
export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  // Check if booking exists
  const bookingExists = await query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
  
  if (bookingExists.rows.length === 0) {
    throw new ApiError(404, 'Booking not found');
  }

  // Update booking status
  const result = await query(
    `UPDATE bookings 
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 
     RETURNING *`,
    [status, bookingId]
  );

  const booking = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: booking.id,
      userId: booking.user_id,
      roomId: booking.room_id,
      checkInDate: booking.check_in_date,
      checkOutDate: booking.check_out_date,
      totalPrice: parseFloat(booking.total_price),
      status: booking.status,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }
  });
});

// Cancel booking (user can cancel their own booking)
export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  // Check if booking exists
  let bookingQuery = 'SELECT * FROM bookings WHERE id = $1';
  let queryParams = [bookingId];
  
  // Regular users can only cancel their own bookings
  if (userRole !== 'admin') {
    bookingQuery += ' AND user_id = $2';
    queryParams.push(userId);
  }
  
  const bookingResult = await query(bookingQuery, queryParams);
  
  if (bookingResult.rows.length === 0) {
    throw new ApiError(404, 'Booking not found');
  }

  const booking = bookingResult.rows[0];
  
  // Check if booking can be cancelled
  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Booking is already cancelled');
  }
  
  if (booking.status === 'completed') {
    throw new ApiError(400, 'Completed bookings cannot be cancelled');
  }

  // Check cancellation policy (e.g., 24 hours before check-in)
  const checkInDate = new Date(booking.check_in_date);
  const now = new Date();
  const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilCheckIn < 24 && userRole !== 'admin') {
    throw new ApiError(400, 'Bookings can only be cancelled at least 24 hours before check-in');
  }

  // Cancel booking
  const result = await query(
    `UPDATE bookings 
     SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 
     RETURNING *`,
    [bookingId]
  );

  const updatedBooking = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: updatedBooking.id,
      userId: updatedBooking.user_id,
      roomId: updatedBooking.room_id,
      checkInDate: updatedBooking.check_in_date,
      checkOutDate: updatedBooking.check_out_date,
      totalPrice: parseFloat(updatedBooking.total_price),
      status: updatedBooking.status,
      createdAt: updatedBooking.created_at,
      updatedAt: updatedBooking.updated_at
    }
  });
});

export default {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelBooking
};
