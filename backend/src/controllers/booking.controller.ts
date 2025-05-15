import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseClient, supabaseAdmin } from '../config/supabase.js';
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

    let query = supabaseClient
      .from('bookings')
      .select(`
        *,
        room:rooms(*),
        user:users(id, email, first_name, last_name)
      `);

    // If not admin, only show user's own bookings
    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new AppError('Error fetching bookings', 500);
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

// Get booking by ID
export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { id } = req.params;

    let query = supabaseClient
      .from('bookings')
      .select(`
        *,
        room:rooms(*),
        user:users(id, email, first_name, last_name)
      `)
      .eq('id', id);

    // If not admin, only allow access to user's own booking
    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AppError('Booking not found', 404);
      }
      throw new AppError('Error fetching booking', 500);
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Create new booking
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Validate request body
    const { room_id, check_in_date, check_out_date, guests, special_requests } = bookingSchema.parse(req.body);

    // Check if room exists and get price
    const { data: room, error: roomError } = await supabaseClient
      .from('rooms')
      .select('id, price_per_night, capacity')
      .eq('id', room_id)
      .single();

    if (roomError || !room) {
      throw new AppError('Room not found', 404);
    }

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
    const { data: existingBookings, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('id')
      .eq('room_id', room_id)
      .not('status', 'eq', 'cancelled')
      .or(`check_in_date.lte.${check_out_date},check_out_date.gte.${check_in_date}`);

    if (bookingError) {
      throw new AppError('Error checking room availability', 500);
    }

    if (existingBookings && existingBookings.length > 0) {
      throw new AppError('Room is not available for the selected dates', 400);
    }

    // Create booking
    const { data, error } = await supabaseClient
      .from('bookings')
      .insert({
        user_id: req.user.id,
        room_id,
        check_in_date,
        check_out_date,
        guests,
        special_requests,
        total_price: totalPrice,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new AppError('Error creating booking', 500);
    }

    res.status(201).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = bookingStatusSchema.parse(req.body);

    // Update booking status
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Error updating booking status', 500);
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking (user can cancel their own booking)
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { id } = req.params;

    // Get booking to check ownership
    let query = supabaseClient
      .from('bookings')
      .select('id, user_id, status')
      .eq('id', id);

    // If not admin, only allow cancellation of user's own booking
    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.id);
    }

    const { data: booking, error: bookingError } = await query.single();

    if (bookingError) {
      if (bookingError.code === 'PGRST116') {
        throw new AppError('Booking not found', 404);
      }
      throw new AppError('Error fetching booking', 500);
    }

    if (booking.status === 'cancelled') {
      throw new AppError('Booking is already cancelled', 400);
    }

    if (booking.status === 'completed') {
      throw new AppError('Cannot cancel a completed booking', 400);
    }

    // Update booking status to cancelled
    const { data, error } = await supabaseClient
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError('Error cancelling booking', 500);
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    next(error);
  }
};
