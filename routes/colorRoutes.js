import express from 'express';
import {
  getColors,
  getColor,
  createColor,
  updateColor,
  deleteColor
} from '../controllers/colorController.js';

const router = express.Router();

router.route('/')
  .get(getColors)
  .post(createColor);

router.route('/:id')
  .get(getColor)
  .put(updateColor)
  .delete(deleteColor);

export default router;
