import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { supabaseClient } from '../config/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

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
    const { email, password } = loginSchema.parse(req.body);

    // Sign in with Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new AppError(error.message, 401);
    }

    if (!data.user) {
      throw new AppError('Login failed', 401);
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabaseClient
      .from('users')
      .select('id, email, first_name, last_name, role')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw new AppError('Error fetching user profile', 500);
    }

    // Generate JWT token
    const token = generateToken({
      id: data.user.id,
      email: data.user.email || '',
      role: profile.role || 'user'
    });

    // Return user data and token
    res.status(200).json({
      status: 'success',
      data: {
        id: data.user.id,
        email: data.user.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register controller
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { email, password, firstName, lastName } = registerSchema.parse(req.body);

    // Sign up with Supabase
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (error) {
      throw new AppError(error.message, 400);
    }

    if (!data.user) {
      throw new AppError('Registration failed', 400);
    }

    // Create user profile in database
    const { error: profileError } = await supabaseClient
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        first_name: firstName,
        last_name: lastName,
        role: 'user' // Default role
      });

    if (profileError) {
      // If profile creation fails, we should delete the auth user
      await supabaseClient.auth.admin.deleteUser(data.user.id);
      throw new AppError('Error creating user profile', 500);
    }

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please check your email for verification.'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Get user profile from database
    const { data, error } = await supabaseClient
      .from('users')
      .select('id, email, first_name, last_name, role')
      .eq('id', req.user.id)
      .single();

    if (error) {
      throw new AppError('Error fetching user profile', 500);
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role
      }
    });
  } catch (error) {
    next(error);
  }
};
