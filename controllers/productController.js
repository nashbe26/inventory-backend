import Product from '../models/Product.js';
import { generateBarcode, generateBarcodeString } from '../utils/barcodeGenerator.js';
import { generateDochette } from '../utils/dochetteGenerator.js';

// Get all products with filters and pagination
export const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      categoryId, 
      colorId, 
      sizeId, 
      rayonId,
      stockStatus 
    } = req.query;

    const query = {};
    
    // Search by name or SKU
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by attributes
    if (categoryId) query.categoryId = categoryId;
    if (colorId) query.colorId = colorId;
    if (sizeId) query.sizeId = sizeId;
    if (rayonId) query.rayonId = rayonId;

    // Calculate pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('categoryId', 'name code')
      .populate('colorId', 'name hexCode')
      .populate('sizeId', 'label value')
      .populate('rayonId', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    // Filter by stock status if provided
    let filteredProducts = products;
    if (stockStatus) {
      filteredProducts = products.filter(p => p.stockStatus === stockStatus);
    }

    res.json({ 
      success: true, 
      data: filteredProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId')
      .populate('colorId')
      .populate('sizeId')
      .populate('rayonId');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    // Generate barcode if not provided
    if (!req.body.barcode) {
      req.body.barcode = generateBarcodeString(req.body.sku);
    }

    const product = await Product.create(req.body);
    const populatedProduct = await Product.findById(product._id)
      .populate('categoryId')
      .populate('colorId')
      .populate('sizeId')
      .populate('rayonId');

    res.status(201).json({ success: true, data: populatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('categoryId')
      .populate('colorId')
      .populate('sizeId')
      .populate('rayonId');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product barcode
export const getProductBarcode = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const barcodeBuffer = await generateBarcode(product.barcode || product.sku);
    
    res.setHeader('Content-Type', 'image/png');
    res.send(barcodeBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product dochette (label)
export const getProductDochette = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId')
      .populate('colorId')
      .populate('sizeId')
      .populate('rayonId');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const pdfBuffer = await generateDochette(product);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=dochette-${product.sku}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
