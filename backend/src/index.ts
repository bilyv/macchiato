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
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.log(`CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:8080'}`);
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
