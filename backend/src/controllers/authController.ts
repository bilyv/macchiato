import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';

// Generate JWT token
const generateToken = (id: number, email: string, role: string): string => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'fallback_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// Register a new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
  
  if (userExists.rows.length > 0) {
    throw new ApiError(400, 'User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const result = await query(
    'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
    [email, hashedPassword, firstName, lastName, 'customer']
  );

  const user = result.rows[0];

  // Generate token
  const token = generateToken(user.id, user.email, user.role);

  res.status(201).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      token
    }
  });
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user exists
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  
  if (result.rows.length === 0) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const user = result.rows[0];

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate token
  const token = generateToken(user.id, user.email, user.role);

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      token
    }
  });
});

// Get current user profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await query(
    'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }

  const user = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    }
  });
});

// Update user profile
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { firstName, lastName, email } = req.body;

  // Check if email is already taken by another user
  if (email) {
    const emailExists = await query(
      'SELECT * FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );
    
    if (emailExists.rows.length > 0) {
      throw new ApiError(400, 'Email already in use');
    }
  }

  // Update user
  const result = await query(
    'UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), email = COALESCE($3, email), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, first_name, last_name, role',
    [firstName || null, lastName || null, email || null, userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }

  const user = result.rows[0];

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    }
  });
});

export default {
  register,
  login,
  getProfile,
  updateProfile
};
