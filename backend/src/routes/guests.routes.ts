import express from 'express';
import {
  getAllGuestsController,
  getGuestsForExternalUserController,
  getGuestByIdController,
  createGuestController,
  updateGuestController,
  deleteGuestController
} from '../controllers/guests.controller.js';
import { authenticate, authorizeAdmin, authorizeExternalUser, authorizeAdminOrExternalUser } from '../middleware/auth.js';

const router = express.Router();

// Routes accessible by both admin and external users
router.get('/', authenticate, authorizeAdminOrExternalUser, getGuestsForExternalUserController);
router.get('/:id', authenticate, authorizeAdminOrExternalUser, getGuestByIdController);
router.post('/', authenticate, authorizeAdminOrExternalUser, createGuestController);
router.put('/:id', authenticate, authorizeAdminOrExternalUser, updateGuestController);
router.delete('/:id', authenticate, authorizeAdminOrExternalUser, deleteGuestController);

// Admin-only routes
router.get('/admin/all', authenticate, authorizeAdmin, getAllGuestsController);

export default router;
