import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBarcode,
  getProductDochette
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('admin', 'manager'), createProduct);

router.route('/:id')
  .get(protect, getProduct)
  .put(protect, authorize('admin', 'manager'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.get('/:id/barcode', protect, getProductBarcode);
router.get('/:id/dochette', protect, getProductDochette);

export default router;
