import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
    required: [true, 'Color is required']
  },
  sizeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Size',
    required: [true, 'Size is required']
  },
  rayonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rayon',
    required: [true, 'Rayon is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  barcode: {
    type: String,
    unique: true,
    trim: true
  },
  dochette: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ sku: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.quantity === 0) return 'out_of_stock';
  if (this.quantity <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
