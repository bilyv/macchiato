import { Hono } from 'hono';
import { login, register, getProfile } from '../controllers/auth.controller.hono.js';
import { authenticate } from '../middleware/auth.hono.js';

const auth = new Hono();

// Public routes
auth.post('/login', login);
auth.post('/register', register);

// Protected routes
auth.get('/profile', authenticate, getProfile);

export default auth;
