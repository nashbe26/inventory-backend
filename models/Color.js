import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Color name is required'],
    trim: true,
    unique: true
  },
  hexCode: {
    type: String,
    required: [true, 'Hex code is required'],
    trim: true,
    match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color code']
  }
}, {
  timestamps: true
});

const Color = mongoose.model('Color', colorSchema);

export default Color;
