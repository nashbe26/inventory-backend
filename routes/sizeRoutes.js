import express from 'express';
import {
  getSizes,
  getSize,
  createSize,
  updateSize,
  deleteSize
} from '../controllers/sizeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getSizes)
  .post(protect, authorize('admin', 'manager'), createSize);

router.route('/:id')
  .get(protect, getSize)
  .put(protect, authorize('admin', 'manager'), updateSize)
  .delete(protect, authorize('admin'), deleteSize);

export default router;
