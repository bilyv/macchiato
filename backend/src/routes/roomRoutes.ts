import express from 'express';
import { 
  getRooms, 
  getRoom, 
  createRoom, 
  updateRoom, 
  deleteRoom 
} from '../controllers/roomController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getRooms);
router.get('/:id', getRoom);

// Admin only routes
router.post('/', protect, restrictTo('admin'), createRoom);
router.put('/:id', protect, restrictTo('admin'), updateRoom);
router.delete('/:id', protect, restrictTo('admin'), deleteRoom);

export default router;
