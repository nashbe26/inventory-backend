import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Size label is required'],
    trim: true,
    unique: true
  },
  value: {
    type: String,
    required: [true, 'Size value is required'],
    trim: true,
    uppercase: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Size = mongoose.model('Size', sizeSchema);

export default Size;
