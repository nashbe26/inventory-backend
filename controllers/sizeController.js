import Size from '../models/Size.js';

// Get all sizes
export const getSizes = async (req, res) => {
  try {
    const sizes = await Size.find().sort({ sortOrder: 1 });
    res.json({ success: true, data: sizes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single size
export const getSize = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) {
      return res.status(404).json({ success: false, message: 'Size not found' });
    }
    res.json({ success: true, data: size });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create size
export const createSize = async (req, res) => {
  try {
    const size = await Size.create(req.body);
    res.status(201).json({ success: true, data: size });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update size
export const updateSize = async (req, res) => {
  try {
    const size = await Size.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!size) {
      return res.status(404).json({ success: false, message: 'Size not found' });
    }
    res.json({ success: true, data: size });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete size
export const deleteSize = async (req, res) => {
  try {
    const size = await Size.findByIdAndDelete(req.params.id);
    if (!size) {
      return res.status(404).json({ success: false, message: 'Size not found' });
    }
    res.json({ success: true, message: 'Size deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
