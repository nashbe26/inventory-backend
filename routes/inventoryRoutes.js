import express from 'express';
import {
  adjustInventory,
  getLowStock,
  getInventoryStats
} from '../controllers/inventoryController.js';

const router = express.Router();

router.post('/adjust', adjustInventory);
router.get('/low-stock', getLowStock);
router.get('/stats', getInventoryStats);

export default router;
