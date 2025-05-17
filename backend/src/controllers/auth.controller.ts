import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler.js';
import { loginUser, registerUser, getUserById } from '../services/auth.service.js';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required')
});

// Generate JWT token
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

// Login controller
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const credentials = loginSchema.parse(req.body);

    // Login user
    const user = await loginUser(credentials);

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Return user data and token
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
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

// Register controller
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const userData = registerSchema.parse(req.body);

    // Register user
    await registerUser(userData);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. You can now log in.'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Get user profile from database
    const user = await getUserById(req.user.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
