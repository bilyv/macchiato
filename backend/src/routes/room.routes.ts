import express from 'express';
import multer from 'multer';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/room.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { roomsStorage } from '../config/cloudinary.js';

// Configure multer with Cloudinary storage
const upload = multer({
  storage: roomsStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

// Public routes
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, upload.single('image'), createRoom);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), updateRoom);
router.delete('/:id', authenticate, authorizeAdmin, deleteRoom);

export default router;
