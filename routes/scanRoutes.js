import express from 'express';
import { scanBarcode, getProductByBarcode } from '../controllers/scanController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api-inventory/scan - Scan barcode and decrease inventory
router.post('/', protect, scanBarcode);

// GET /api-inventory/scan/:barcode - Get product info by barcode (no inventory change)
router.get('/:barcode', protect, getProductByBarcode);

export default router;
