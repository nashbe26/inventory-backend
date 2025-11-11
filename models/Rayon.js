import mongoose from 'mongoose';

const rayonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Rayon name is required'],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Rayon code is required'],
    trim: true,
    uppercase: true,
    unique: true
  },
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Rayon = mongoose.model('Rayon', rayonSchema);

export default Rayon;
