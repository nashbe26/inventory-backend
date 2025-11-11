import express from 'express';
import { 
  bulkGenerateBarcodes, 
  bulkGenerateDochettes,
  generateAllBarcodes,
  generateAllDochettes
} from '../controllers/bulkController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// POST /api-inventory/bulk/barcodes - Generate barcodes for selected products
router.post('/barcodes', protect, authorize('admin', 'manager'), bulkGenerateBarcodes);

// POST /api-inventory/bulk/dochettes - Generate dochettes for selected products
router.post('/dochettes', protect, authorize('admin', 'manager'), bulkGenerateDochettes);

// GET /api-inventory/bulk/barcodes/all - Generate barcodes for all products
router.get('/barcodes/all', protect, authorize('admin', 'manager'), generateAllBarcodes);

// GET /api-inventory/bulk/dochettes/all - Generate dochettes for all products
router.get('/dochettes/all', protect, authorize('admin', 'manager'), generateAllDochettes);

export default router;
