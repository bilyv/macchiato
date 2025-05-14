import express from 'express';
import { 
  getAmenities, 
  getAmenity, 
  createAmenity, 
  updateAmenity, 
  deleteAmenity 
} from '../controllers/amenityController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAmenities);
router.get('/:id', getAmenity);

// Admin only routes
router.post('/', protect, restrictTo('admin'), createAmenity);
router.put('/:id', protect, restrictTo('admin'), updateAmenity);
router.delete('/:id', protect, restrictTo('admin'), deleteAmenity);

export default router;
