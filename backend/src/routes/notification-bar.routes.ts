import express from 'express';
import {
  getAllNotificationBars,
  getNotificationBarById,
  createNotificationBar,
  updateNotificationBar,
  deleteNotificationBar
} from '../controllers/notification-bar.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllNotificationBars);
router.get('/:id', getNotificationBarById);
// Temporarily make this public for testing
router.post('/', createNotificationBar);

// Admin routes
router.put('/:id', authenticate, authorizeAdmin, updateNotificationBar);
router.delete('/:id', authenticate, authorizeAdmin, deleteNotificationBar);

export default router;
