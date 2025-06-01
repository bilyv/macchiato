import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import roomRoutes from './routes/room.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import menuRoutes from './routes/menu.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import externalUsersRoutes from './routes/external-users.routes.js';
import guestsRoutes from './routes/guests.routes.js';
// Using public notification bar routes for testing
import notificationBarPublicRoutes from './routes/notification-bar-public.routes.js';
import './config/database.js'; // Initialize database connection

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = parseInt(process.env.PORT || '3000', 10); // Ensure port is a number
const host = process.env.HOST || '0.0.0.0'; // Bind to 0.0.0.0 for external access (required by Render)

// Middleware
// Configure CORS to allow multiple origins (local development and production)
const allowedOrigins = [
  'http://localhost:8080', // Local development
  'https://macchiato-delta.vercel.app', // Vercel frontend
  process.env.CORS_ORIGIN // Additional origin from environment variable
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Add request logging middleware for debugging
app.use((req, _res, next) => {
  if (req.path.includes('/api/bookings') && req.method === 'POST') {
    console.log('=== BOOKING REQUEST DEBUG ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Raw body (before parsing):', req.body);
  }
  next();
});

// JSON parsing middleware with error handling
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf, _encoding) => {
    if (req.url && req.url.includes('/api/bookings') && req.method === 'POST') {
      console.log('Raw buffer:', buf.toString());
    }
  }
}));
app.use(express.urlencoded({ extended: true }));

// Custom error handler for JSON parsing errors
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof SyntaxError && 'body' in error) {
    console.error('=== JSON PARSING ERROR ===');
    console.error('Error:', error.message);
    console.error('Request path:', req.path);
    console.error('Request method:', req.method);
    console.error('Content-Type:', req.get('Content-Type'));
    console.error('Raw body that caused error:', error.body);

    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'The request body contains invalid JSON format',
      details: error.message
    });
  }
  next(error);
});

// Root route - API information
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'Macchiato Suite Dreams API',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to Macchiato Suite Dreams API',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      contact: '/api/contact',
      rooms: '/api/rooms',
      gallery: '/api/gallery',
      menu: '/api/menu',
      bookings: '/api/bookings',
      externalUsers: '/api/external-users',
      guests: '/api/guests',
      notifications: '/api/notification-bars'
    },
    documentation: 'API endpoints are available under /api/*'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/external-users', externalUsersRoutes);
app.use('/api/guests', guestsRoutes);
// Use the public notification bar routes for testing
app.use('/api/notification-bars', notificationBarPublicRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Catch-all route for undefined endpoints
app.use('*', (_req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: {
      root: '/',
      health: '/health',
      auth: '/api/auth',
      contact: '/api/contact',
      rooms: '/api/rooms',
      gallery: '/api/gallery',
      menu: '/api/menu',
      bookings: '/api/bookings',
      externalUsers: '/api/external-users',
      guests: '/api/guests',
      notifications: '/api/notification-bars'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(port, host, () => {
  console.log(`Server running on ${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed CORS Origins: ${allowedOrigins.join(', ')}`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;
