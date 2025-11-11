import express from 'express';
import {
  getRayons,
  getRayon,
  createRayon,
  updateRayon,
  deleteRayon
} from '../controllers/rayonController.js';

const router = express.Router();

router.route('/')
  .get(getRayons)
  .post(createRayon);

router.route('/:id')
  .get(getRayon)
  .put(updateRayon)
  .delete(deleteRayon);

export default router;
