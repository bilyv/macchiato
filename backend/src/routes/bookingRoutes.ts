import express from 'express';
import { 
  getBookings, 
  getBooking, 
  createBooking, 
  updateBookingStatus, 
  cancelBooking 
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/', getBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.patch('/:id/cancel', cancelBooking);

// Admin only routes
router.patch('/:id/status', restrictTo('admin'), updateBookingStatus);

export default router;
