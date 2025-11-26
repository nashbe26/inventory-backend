import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, tax, discount, customer, notes, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must have at least one item'
      });
    }

    // Validate and prepare order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`
        });
      }

      const unitPrice = item.unitPrice || product.price || 0;
      const totalPrice = unitPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice,
        totalPrice
      });

      subtotal += totalPrice;

      // Decrease product quantity
      product.quantity -= item.quantity;
      await product.save();
    }

    const total = subtotal + (tax || 0) - (discount || 0);

    const order = await Order.create({
      items: orderItems,
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      total,
      customer: customer || { name: 'Walk-in Customer' },
      notes,
      paymentMethod: paymentMethod || 'cash',
      createdBy: req.user?._id
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('items.productId', 'name sku barcode');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If cancelling, restore product quantities
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Restore product quantities if not already cancelled
    if (order.status !== 'cancelled' && order.status !== 'refunded') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get analytics - Top selling products
export const getTopSellingProducts = async (req, res) => {
  try {
    const { period = '30', limit = 10 } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ['cancelled', 'refunded'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          sku: { $first: '$items.sku' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: topProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get analytics - Revenue stats
export const getRevenueStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // This week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Last week
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfWeek);

    // This month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Last month
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const calculateStats = async (startDate, endDate = new Date()) => {
      const result = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            status: { $nin: ['cancelled', 'refunded'] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$total' }
          }
        }
      ]);
      return result[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };
    };

    const [todayStats, thisWeekStats, lastWeekStats, thisMonthStats, lastMonthStats] = await Promise.all([
      calculateStats(today),
      calculateStats(startOfWeek),
      calculateStats(startOfLastWeek, endOfLastWeek),
      calculateStats(startOfMonth),
      calculateStats(startOfLastMonth, endOfLastMonth)
    ]);

    // Calculate weekly change
    const weeklyChange = lastWeekStats.totalRevenue > 0 
      ? ((thisWeekStats.totalRevenue - lastWeekStats.totalRevenue) / lastWeekStats.totalRevenue) * 100
      : thisWeekStats.totalRevenue > 0 ? 100 : 0;

    // Calculate monthly change
    const monthlyChange = lastMonthStats.totalRevenue > 0
      ? ((thisMonthStats.totalRevenue - lastMonthStats.totalRevenue) / lastMonthStats.totalRevenue) * 100
      : thisMonthStats.totalRevenue > 0 ? 100 : 0;

    res.json({
      success: true,
      data: {
        today: todayStats,
        thisWeek: {
          ...thisWeekStats,
          change: weeklyChange,
          previousWeek: lastWeekStats.totalRevenue
        },
        thisMonth: {
          ...thisMonthStats,
          change: monthlyChange,
          previousMonth: lastMonthStats.totalRevenue
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get analytics - Daily revenue for charts
export const getDailyRevenue = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $nin: ['cancelled', 'refunded'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          items: { $sum: { $size: '$items' } }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          revenue: 1,
          orders: 1,
          items: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: dailyRevenue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get analytics - Dashboard summary
export const getDashboardAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get various stats in parallel
    const [
      todayOrders,
      weekOrders,
      monthOrders,
      topProducts,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      // Today's stats
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, status: { $nin: ['cancelled', 'refunded'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } }
      ]),
      // This week's stats
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfWeek }, status: { $nin: ['cancelled', 'refunded'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } }
      ]),
      // This month's stats
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $nin: ['cancelled', 'refunded'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } }
      ]),
      // Top 5 products this month
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $nin: ['cancelled', 'refunded'] } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.productId', name: { $first: '$items.productName' }, sold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.totalPrice' } } },
        { $sort: { sold: -1 } },
        { $limit: 5 }
      ]),
      // Recent 5 orders
      Order.find({ status: { $nin: ['cancelled', 'refunded'] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber total items createdAt status'),
      // Low stock products
      Product.find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } })
        .select('name sku quantity lowStockThreshold')
        .limit(10)
    ]);

    res.json({
      success: true,
      data: {
        today: todayOrders[0] || { revenue: 0, count: 0 },
        thisWeek: weekOrders[0] || { revenue: 0, count: 0 },
        thisMonth: monthOrders[0] || { revenue: 0, count: 0 },
        topProducts,
        recentOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
