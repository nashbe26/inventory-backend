import express from 'express';
import {
  getRayons,
  getRayon,
  createRayon,
  updateRayon,
  deleteRayon
} from '../controllers/rayonController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getRayons)
  .post(protect, authorize('admin', 'manager'), createRayon);

router.route('/:id')
  .get(protect, getRayon)
  .put(protect, authorize('admin', 'manager'), updateRayon)
  .delete(protect, authorize('admin'), deleteRayon);

export default router;
