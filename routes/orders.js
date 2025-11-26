import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getTopSellingProducts,
  getRevenueStats,
  getDailyRevenue,
  getDashboardAnalytics
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Analytics routes (must be before /:id route)
router.get('/analytics/dashboard', getDashboardAnalytics);
router.get('/analytics/top-selling', getTopSellingProducts);
router.get('/analytics/revenue-stats', getRevenueStats);
router.get('/analytics/daily-revenue', getDailyRevenue);

// CRUD routes
router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder)
  .put(updateOrderStatus)
  .delete(authorize('admin', 'manager'), deleteOrder);

export default router;
