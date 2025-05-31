import { Context, Next } from 'hono';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { createSupabaseClient } from '../config/supabase.js';

// Define user type for context
export interface User {
  id: string;
  email: string;
  role: string;
}

// Extend Hono context to include user
declare module 'hono' {
  interface ContextVariableMap {
    user: User;
  }
}

export const authenticate = async (c: Context, next: Next) => {
  try {
    // Get token from Authorization header
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return c.json({ error: 'Invalid token format' }, 401);
    }

    // Get JWT secret from environment
    const secret = c.env?.JWT_SECRET || process.env.JWT_SECRET || 'fallback_secret';

    // Verify token using Workers-compatible JWT library
    const isValid = await jwt.verify(token, secret);
    if (!isValid) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    // Decode token payload
    const payload = jwt.decode(token);
    if (!payload || !payload.payload) {
      return c.json({ error: 'Invalid token payload' }, 401);
    }

    const decoded = payload.payload as {
      id: string;
      email: string;
      role: string;
      exp: number;
    };

    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ error: 'Token expired' }, 401);
    }

    // Create Supabase client with environment variables
    const supabase = createSupabaseClient(c.env);

    // Check if user exists in database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return c.json({ error: 'User not found or token invalid' }, 401);
    }

    // Set user in context
    c.set('user', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    await next();
  } catch (error) {
    console.error('Authentication error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

export const authorizeAdmin = async (c: Context, next: Next) => {
  const user = c.get('user');
  
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  if (user.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }

  await next();
};
