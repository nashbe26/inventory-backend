import express from 'express';
import { scanBarcode, getProductByBarcode } from '../controllers/scanController.js';

const router = express.Router();

// POST /api/scan - Scan barcode and decrease inventory
router.post('/', scanBarcode);

// GET /api/scan/:barcode - Get product info by barcode (no inventory change)
router.get('/:barcode', getProductByBarcode);

export default router;
