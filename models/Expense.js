import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['rent', 'utilities', 'salaries', 'supplies', 'marketing', 'maintenance', 'shipping', 'taxes', 'insurance', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'check', 'other'],
    default: 'cash'
  },
  receipt: {
    type: String // URL or file path
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPeriod: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ createdAt: -1 });

export default mongoose.model('Expense', expenseSchema);
