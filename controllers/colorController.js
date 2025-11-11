import Color from '../models/Color.js';

// Get all colors
export const getColors = async (req, res) => {
  try {
    const colors = await Color.find().sort({ name: 1 });
    res.json({ success: true, data: colors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single color
export const getColor = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) {
      return res.status(404).json({ success: false, message: 'Color not found' });
    }
    res.json({ success: true, data: color });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create color
export const createColor = async (req, res) => {
  try {
    const color = await Color.create(req.body);
    res.status(201).json({ success: true, data: color });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update color
export const updateColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!color) {
      return res.status(404).json({ success: false, message: 'Color not found' });
    }
    res.json({ success: true, data: color });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete color
export const deleteColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) {
      return res.status(404).json({ success: false, message: 'Color not found' });
    }
    res.json({ success: true, message: 'Color deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
