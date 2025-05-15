import express from 'express';
import {
  getAllMessages,
  getMessageById,
  createMessage,
  markAsRead,
  deleteMessage
} from '../controllers/contact.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createMessage);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllMessages);
router.get('/:id', authenticate, authorizeAdmin, getMessageById);
router.patch('/:id/read', authenticate, authorizeAdmin, markAsRead);
router.delete('/:id', authenticate, authorizeAdmin, deleteMessage);

export default router;
