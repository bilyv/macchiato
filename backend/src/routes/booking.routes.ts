import express from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking
} from '../controllers/booking.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

// User routes
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.patch('/:id/cancel', cancelBooking);

// Admin routes
router.patch('/:id/status', authorizeAdmin, updateBookingStatus);

export default router;
