import express from 'express';
import multer from 'multer';
import {
  getAllRooms,
  getWebsiteRooms,
  getRoomById,
  getRoomByNumber,
  createRoom,
  updateRoom,
  deleteRoom,
  addRoomsToSite,
  removeRoomsFromSite
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

// Public routes (website visitors - only shows approved/visible rooms)
router.get('/website', getWebsiteRooms);
router.get('/number/:roomNumber', getRoomByNumber);
router.get('/:id', getRoomById);

// Admin routes (full access to all rooms)
router.get('/', authenticate, authorizeAdmin, getAllRooms);
router.post('/', authenticate, authorizeAdmin, upload.single('image'), createRoom);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), updateRoom);
router.delete('/:id', authenticate, authorizeAdmin, deleteRoom);

// Bulk operations for website visibility
router.post('/add-to-site', authenticate, authorizeAdmin, addRoomsToSite);
router.post('/remove-from-site', authenticate, authorizeAdmin, removeRoomsFromSite);

export default router;
