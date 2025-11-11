import Rayon from '../models/Rayon.js';

// Get all rayons
export const getRayons = async (req, res) => {
  try {
    const rayons = await Rayon.find().sort({ name: 1 });
    res.json({ success: true, data: rayons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single rayon
export const getRayon = async (req, res) => {
  try {
    const rayon = await Rayon.findById(req.params.id);
    if (!rayon) {
      return res.status(404).json({ success: false, message: 'Rayon not found' });
    }
    res.json({ success: true, data: rayon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create rayon
export const createRayon = async (req, res) => {
  try {
    const rayon = await Rayon.create(req.body);
    res.status(201).json({ success: true, data: rayon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update rayon
export const updateRayon = async (req, res) => {
  try {
    const rayon = await Rayon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rayon) {
      return res.status(404).json({ success: false, message: 'Rayon not found' });
    }
    res.json({ success: true, data: rayon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete rayon
export const deleteRayon = async (req, res) => {
  try {
    const rayon = await Rayon.findByIdAndDelete(req.params.id);
    if (!rayon) {
      return res.status(404).json({ success: false, message: 'Rayon not found' });
    }
    res.json({ success: true, message: 'Rayon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
