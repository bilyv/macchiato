import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/room.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, createRoom);
router.put('/:id', authenticate, authorizeAdmin, updateRoom);
router.delete('/:id', authenticate, authorizeAdmin, deleteRoom);

export default router;
