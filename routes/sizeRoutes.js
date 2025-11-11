import express from 'express';
import {
  getSizes,
  getSize,
  createSize,
  updateSize,
  deleteSize
} from '../controllers/sizeController.js';

const router = express.Router();

router.route('/')
  .get(getSizes)
  .post(createSize);

router.route('/:id')
  .get(getSize)
  .put(updateSize)
  .delete(deleteSize);

export default router;
