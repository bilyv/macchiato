import express from 'express';
import multer from 'multer';
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuImages,
  getMenuImageById,
  createMenuImage,
  deleteMenuImage
} from '../controllers/menu.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { menuStorage } from '../config/cloudinary.js';

// Configure multer with Cloudinary storage for menu images
const upload = multer({
  storage: menuStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

// Menu Items Routes

// Public routes for menu items
router.get('/items', getAllMenuItems);
router.get('/items/:id', getMenuItemById);

// Admin routes for menu items
router.post('/items', authenticate, authorizeAdmin, upload.single('image'), createMenuItem);
router.put('/items/:id', authenticate, authorizeAdmin, updateMenuItem);
router.delete('/items/:id', authenticate, authorizeAdmin, deleteMenuItem);

// Menu Images Routes

// Public routes for menu images
router.get('/images', getAllMenuImages);
router.get('/images/:id', getMenuImageById);

// Admin routes for menu images
router.post('/images', authenticate, authorizeAdmin, upload.single('image'), createMenuImage);
router.delete('/images/:id', authenticate, authorizeAdmin, deleteMenuImage);

export default router;
