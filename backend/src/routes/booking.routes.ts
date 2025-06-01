import express from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  deleteBooking
} from '../controllers/booking.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes - MUST come before protected routes to avoid middleware conflicts
router.post('/', createBooking); // Allow public booking creation

// Protected routes (admin only) - these require authentication
router.use(authenticate); // Apply authentication middleware to all routes below
router.use(authorizeAdmin); // Apply admin authorization to all routes below

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.patch('/:id/status', updateBookingStatus);
router.patch('/:id/cancel', cancelBooking);
router.delete('/:id', deleteBooking);

export default router;
