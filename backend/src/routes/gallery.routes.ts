import express from 'express';
import multer from 'multer';
import {
  getAllGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  deleteGalleryImage
} from '../controllers/gallery.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { galleryStorage } from '../config/cloudinary.js';

// Configure multer with Cloudinary storage
const upload = multer({
  storage: galleryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

// Public routes
router.get('/', getAllGalleryImages);
router.get('/:id', getGalleryImageById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, upload.single('image'), createGalleryImage);
router.delete('/:id', authenticate, authorizeAdmin, deleteGalleryImage);

export default router;
