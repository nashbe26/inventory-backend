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

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.get('/:id/barcode', getProductBarcode);
router.get('/:id/dochette', getProductDochette);

export default router;
