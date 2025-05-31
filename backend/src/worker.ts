import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { createSupabaseClient } from './config/supabase.js';

// Import Workers-compatible route handlers
import { login, register, getProfile } from './controllers/auth.controller.worker.js';
import { authenticate } from './middleware/auth.worker.js';

// Define environment interface for Cloudflare Workers
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  JWT_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

// Create Hono app
const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use('*', cors({
  origin: ['https://macchiato-delta.vercel.app', 'http://localhost:8080', 'http://localhost:5173'],
  credentials: true,
}));

app.use('*', secureHeaders());
app.use('*', logger());

// Add environment variables to context
app.use('*', async (c, next) => {
  // Set environment variables for the request context
  c.env.SUPABASE_URL = c.env.SUPABASE_URL;
  c.env.SUPABASE_ANON_KEY = c.env.SUPABASE_ANON_KEY;
  c.env.JWT_SECRET = c.env.JWT_SECRET;
  c.env.CLOUDINARY_CLOUD_NAME = c.env.CLOUDINARY_CLOUD_NAME;
  c.env.CLOUDINARY_API_KEY = c.env.CLOUDINARY_API_KEY;
  c.env.CLOUDINARY_API_SECRET = c.env.CLOUDINARY_API_SECRET;

  await next();
});

// Auth routes
app.post('/api/auth/login', login);
app.post('/api/auth/register', register);
app.get('/api/auth/profile', authenticate, getProfile);

// TODO: Add other routes (contact, rooms, gallery, menu, notification-bars)
// These will need to be converted to Hono format as well

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', message: 'Cloudflare Worker is running' });
});

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Macchiato Suites Backend API',
    version: '1.0.0',
    environment: 'Cloudflare Workers'
  });
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

export default app;
