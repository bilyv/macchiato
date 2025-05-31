import { Context } from 'hono';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
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
const generateToken = (user: { id: string; email: string; role: string }, env?: any) => {
  const secret = env?.JWT_SECRET || process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = env?.JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn }
  );
};

// Login controller
export const login = async (c: Context) => {
  try {
    // Get request body
    const body = await c.req.json();
    
    // Validate request body
    const credentials = loginSchema.parse(body);

    // Login user
    const user = await loginUser(credentials, c.env);

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    }, c.env);

    // Return user data and token
    return c.json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        token
      }
    }, 200);
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return c.json({ 
        error: 'Validation error',
        details: error.errors 
      }, 400);
    } else if (error instanceof Error) {
      return c.json({ 
        error: error.message 
      }, 400);
    } else {
      return c.json({ 
        error: 'Login failed' 
      }, 500);
    }
  }
};

// Register controller
export const register = async (c: Context) => {
  try {
    // Get request body
    const body = await c.req.json();
    
    // Validate request body
    const userData = registerSchema.parse(body);

    // Register user
    await registerUser(userData, c.env);

    return c.json({
      status: 'success',
      message: 'Registration successful. You can now log in.'
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return c.json({ 
        error: 'Validation error',
        details: error.errors 
      }, 400);
    } else if (error instanceof Error) {
      return c.json({ 
        error: error.message 
      }, 400);
    } else {
      return c.json({ 
        error: 'Registration failed' 
      }, 500);
    }
  }
};

// Get current user profile
export const getProfile = async (c: Context) => {
  try {
    const user = c.get('user');
    
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Get user profile from database
    const userProfile = await getUserById(user.id, c.env);

    if (!userProfile) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      status: 'success',
      data: {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role
      }
    }, 200);
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ 
      error: 'Failed to get profile' 
    }, 500);
  }
};
