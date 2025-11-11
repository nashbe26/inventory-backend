import express from 'express';
import {
  adjustInventory,
  getLowStock,
  getInventoryStats
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/adjust', protect, authorize('admin', 'manager'), adjustInventory);
router.get('/low-stock', protect, getLowStock);
router.get('/stats', protect, getInventoryStats);

export default router;
