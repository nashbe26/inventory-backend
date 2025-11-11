import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Category code is required'],
    trim: true,
    uppercase: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
