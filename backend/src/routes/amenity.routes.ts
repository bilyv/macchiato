import express from 'express';
import {
  getAllAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity
} from '../controllers/amenity.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllAmenities);
router.get('/:id', getAmenityById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, createAmenity);
router.put('/:id', authenticate, authorizeAdmin, updateAmenity);
router.delete('/:id', authenticate, authorizeAdmin, deleteAmenity);

export default router;
