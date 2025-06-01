import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  getAllGuests,
  getGuestsByExternalUser,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest
} from '../services/guests.service.js';
import { AppError } from '../middleware/errorHandler.js';

// Validation schemas
const createGuestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  dateOfBirth: z.string().optional(),
  identificationType: z.enum(['passport', 'driver_license', 'national_id', 'other']).optional(),
  identificationNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  specialRequirements: z.string().optional(),
  notes: z.string().optional(),
  isVip: z.boolean().optional()
});

const updateGuestSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  dateOfBirth: z.string().optional(),
  identificationType: z.enum(['passport', 'driver_license', 'national_id', 'other']).optional(),
  identificationNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  specialRequirements: z.string().optional(),
  notes: z.string().optional(),
  isVip: z.boolean().optional()
});

/**
 * Get all guests (admin only)
 */
export const getAllGuestsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guests = await getAllGuests();

    res.status(200).json({
      status: 'success',
      data: guests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get guests for external user (external user can only see their own guests)
 */
export const getGuestsForExternalUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    if (!user) {
      throw new AppError('User not found', 401);
    }

    let guests;

    // If admin, get all guests
    if (user.role === 'admin') {
      guests = await getAllGuests();
    }
    // If external user, get only their guests
    else if (user.role === 'external_user') {
      guests = await getGuestsByExternalUser(user.id);
    }
    else {
      throw new AppError('Unauthorized access', 403);
    }

    res.status(200).json({
      status: 'success',
      data: guests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get guest by ID
 */
export const getGuestByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const guest = await getGuestById(id);

    // Check if external user can access this guest
    if (user.role === 'external_user' && guest.created_by_external_user_id !== user.id) {
      throw new AppError('Unauthorized access to this guest', 403);
    }

    res.status(200).json({
      status: 'success',
      data: guest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create guest
 */
export const createGuestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const guestData = createGuestSchema.parse(req.body);

    const user = (req as any).user;
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Determine creator based on user role
    let createData;
    if (user.role === 'admin') {
      createData = {
        ...guestData,
        createdByUserId: user.id
      };
    } else if (user.role === 'external_user') {
      createData = {
        ...guestData,
        createdByExternalUserId: user.id
      };
    } else {
      throw new AppError('Unauthorized to create guests', 403);
    }

    // Create guest
    const guest = await createGuest(createData);

    res.status(201).json({
      status: 'success',
      data: guest
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

/**
 * Update guest
 */
export const updateGuestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Validate request body
    const guestData = updateGuestSchema.parse(req.body);

    // Check if guest exists and user has permission
    const existingGuest = await getGuestById(id);

    // Check if external user can update this guest
    if (user.role === 'external_user' && existingGuest.created_by_external_user_id !== user.id) {
      throw new AppError('Unauthorized to update this guest', 403);
    }

    // Update guest
    const guest = await updateGuest(id, guestData);

    res.status(200).json({
      status: 'success',
      data: guest
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

/**
 * Delete guest
 */
export const deleteGuestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Check if guest exists and user has permission
    const existingGuest = await getGuestById(id);

    // Check if external user can delete this guest
    if (user.role === 'external_user' && existingGuest.created_by_external_user_id !== user.id) {
      throw new AppError('Unauthorized to delete this guest', 403);
    }

    await deleteGuest(id);

    res.status(200).json({
      status: 'success',
      message: 'Guest deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
