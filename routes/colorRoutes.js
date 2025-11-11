import express from 'express';
import {
  getColors,
  getColor,
  createColor,
  updateColor,
  deleteColor
} from '../controllers/colorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getColors)
  .post(protect, authorize('admin', 'manager'), createColor);

router.route('/:id')
  .get(protect, getColor)
  .put(protect, authorize('admin', 'manager'), updateColor)
  .delete(protect, authorize('admin'), deleteColor);

export default router;
