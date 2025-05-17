import express from 'express';
import {
  getAllNotificationBars,
  getNotificationBarById,
  createNotificationBar,
  updateNotificationBar,
  deleteNotificationBar
} from '../controllers/notification-bar.controller.js';

const router = express.Router();

// All routes are public for testing
router.get('/', getAllNotificationBars);
router.get('/:id', getNotificationBarById);
router.post('/', createNotificationBar);
router.put('/:id', updateNotificationBar);
router.delete('/:id', deleteNotificationBar);

export default router;
