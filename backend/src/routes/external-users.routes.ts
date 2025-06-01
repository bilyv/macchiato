import express from 'express';
import {
  getAllExternalUsersController,
  getExternalUserByIdController,
  createExternalUserController,
  updateExternalUserController,
  deleteExternalUserController,
  loginExternalUserController,
  getCurrentExternalUserController
} from '../controllers/external-users.controller.js';
import { authenticate, authorizeAdmin, authorizeExternalUser } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', loginExternalUserController);

// External user routes (requires external user authentication)
router.get('/profile', authenticate, authorizeExternalUser, getCurrentExternalUserController);

// Admin routes (requires admin authentication)
router.get('/', authenticate, authorizeAdmin, getAllExternalUsersController);
router.get('/:id', authenticate, authorizeAdmin, getExternalUserByIdController);
router.post('/', authenticate, authorizeAdmin, createExternalUserController);
router.put('/:id', authenticate, authorizeAdmin, updateExternalUserController);
router.delete('/:id', authenticate, authorizeAdmin, deleteExternalUserController);

export default router;
