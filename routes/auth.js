import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  deactivateUser
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Admin only routes
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/users/:id/deactivate', protect, authorize('admin'), deactivateUser);

export default router;
