import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

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

app.use('*', logger());

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    message: 'Cloudflare Worker is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (c) => {
  return c.json({ 
    message: 'Macchiato Suites Backend API',
    version: '1.0.0',
    environment: 'Cloudflare Workers',
    endpoints: {
      health: '/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/profile'
      }
    }
  });
});

// Simple test auth endpoint
app.post('/api/auth/test', async (c) => {
  try {
    const body = await c.req.json();
    return c.json({
      status: 'success',
      message: 'Test endpoint working',
      received: body,
      env_check: {
        supabase_url: !!c.env?.SUPABASE_URL,
        jwt_secret: !!c.env?.JWT_SECRET
      }
    });
  } catch (error) {
    return c.json({
      status: 'error',
      message: 'Test endpoint failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
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
