import express from 'express';
import { 
  submitContactForm, 
  getContactMessages, 
  getContactMessage, 
  markMessageAsRead, 
  deleteContactMessage 
} from '../controllers/contactController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', submitContactForm);

// Admin only routes
router.get('/', protect, restrictTo('admin'), getContactMessages);
router.get('/:id', protect, restrictTo('admin'), getContactMessage);
router.patch('/:id/read', protect, restrictTo('admin'), markMessageAsRead);
router.delete('/:id', protect, restrictTo('admin'), deleteContactMessage);

export default router;
