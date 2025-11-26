import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'paid'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'other'],
    default: 'cash'
  },
  customer: {
    name: {
      type: String,
      default: 'Walk-in Customer'
    },
    email: String,
    phone: String,
    address: String
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'items.productId': 1 });

// Pre-save hook to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Count orders today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}${day}-${sequence}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
