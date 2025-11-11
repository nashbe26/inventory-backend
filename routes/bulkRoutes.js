import express from 'express';
import { 
  bulkGenerateBarcodes, 
  bulkGenerateDochettes,
  generateAllBarcodes,
  generateAllDochettes
} from '../controllers/bulkController.js';

const router = express.Router();

// POST /api/bulk/barcodes - Generate barcodes for selected products
router.post('/barcodes', bulkGenerateBarcodes);

// POST /api/bulk/dochettes - Generate dochettes for selected products
router.post('/dochettes', bulkGenerateDochettes);

// GET /api/bulk/barcodes/all - Generate barcodes for all products
router.get('/barcodes/all', generateAllBarcodes);

// GET /api/bulk/dochettes/all - Generate dochettes for all products
router.get('/dochettes/all', generateAllDochettes);

export default router;
