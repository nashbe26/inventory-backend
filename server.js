import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categoryRoutes.js';
import colorRoutes from './routes/colorRoutes.js';
import sizeRoutes from './routes/sizeRoutes.js';
import rayonRoutes from './routes/rayonRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import bulkRoutes from './routes/bulkRoutes.js';
import orderRoutes from './routes/orders.js';
import expenseRoutes from './routes/expenses.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api-inventory/auth', authRoutes);
app.use('/api-inventory/categories', categoryRoutes);
app.use('/api-inventory/colors', colorRoutes);
app.use('/api-inventory/sizes', sizeRoutes);
app.use('/api-inventory/rayons', rayonRoutes);
app.use('/api-inventory/products', productRoutes);
app.use('/api-inventory/inventory', inventoryRoutes);
app.use('/api-inventory/scan', scanRoutes);
app.use('/api-inventory/bulk', bulkRoutes);
app.use('/api-inventory/orders', orderRoutes);
app.use('/api-inventory/expenses', expenseRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: '🧾 Inventory Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
