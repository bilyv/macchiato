import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import {
  getAllExternalUsers,
  getExternalUserById,
  createExternalUser,
  updateExternalUser,
  deleteExternalUser,
  loginExternalUser
} from '../services/external-users.service.js';
import { AppError } from '../middleware/errorHandler.js';

// Validation schemas
const createExternalUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required')
});

const updateExternalUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  isActive: z.boolean().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Generate JWT token for external users
const generateToken = (user: { id: string; email: string; role: string }) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  // @ts-ignore - Ignoring type issues with jwt.sign
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn }
  );
};

/**
 * Get all external users (admin only)
 */
export const getAllExternalUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const externalUsers = await getAllExternalUsers();

    res.status(200).json({
      status: 'success',
      data: externalUsers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get external user by ID (admin only)
 */
export const getExternalUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const externalUser = await getExternalUserById(id);

    res.status(200).json({
      status: 'success',
      data: externalUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create external user (admin only)
 */
export const createExternalUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const userData = createExternalUserSchema.parse(req.body);

    // Get the admin user ID from the authenticated request
    const adminUserId = (req as any).user?.id;
    if (!adminUserId) {
      throw new AppError('Admin user ID not found', 401);
    }

    // Create external user
    const externalUser = await createExternalUser({
      ...userData,
      createdBy: adminUserId
    });

    // Remove password from response
    const { password, ...externalUserWithoutPassword } = externalUser;

    res.status(201).json({
      status: 'success',
      data: externalUserWithoutPassword
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
 * Update external user (admin only)
 */
export const updateExternalUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate request body
    const userData = updateExternalUserSchema.parse(req.body);

    // Update external user
    const externalUser = await updateExternalUser(id, userData);

    // Remove password from response
    const { password, ...externalUserWithoutPassword } = externalUser;

    res.status(200).json({
      status: 'success',
      data: externalUserWithoutPassword
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
 * Delete external user (admin only)
 */
export const deleteExternalUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await deleteExternalUser(id);

    res.status(200).json({
      status: 'success',
      message: 'External user deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * External user login
 */
export const loginExternalUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const credentials = loginSchema.parse(req.body);

    // Login external user
    const externalUser = await loginExternalUser(credentials);

    // Generate JWT token
    const token = generateToken({
      id: externalUser.id,
      email: externalUser.email,
      role: externalUser.role
    });

    // Return user data and token
    res.status(200).json({
      status: 'success',
      data: {
        id: externalUser.id,
        email: externalUser.email,
        firstName: externalUser.first_name,
        lastName: externalUser.last_name,
        role: externalUser.role,
        token
      }
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
 * Get current external user profile
 */
export const getCurrentExternalUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const externalUser = await getExternalUserById(userId);

    // Remove password from response
    const { password, ...externalUserWithoutPassword } = externalUser;

    res.status(200).json({
      status: 'success',
      data: externalUserWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};
