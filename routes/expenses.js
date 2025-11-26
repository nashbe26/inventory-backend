import express from 'express';
import {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getMonthlyExpenses
} from '../controllers/expenseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Stats routes (must be before /:id)
router.get('/stats', getExpenseStats);
router.get('/monthly', getMonthlyExpenses);

// CRUD routes
router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id')
  .get(getExpense)
  .put(updateExpense)
  .delete(authorize('admin', 'manager'), deleteExpense);

export default router;
