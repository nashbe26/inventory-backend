import Product from '../models/Product.js';

// Scan barcode and decrease inventory by 1
export const scanBarcode = async (req, res) => {
  try {
    const { barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Barcode is required' 
      });
    }

    // Find product by barcode
    const product = await Product.findOne({ barcode })
      .populate('categoryId')
      .populate('colorId')
      .populate('sizeId')
      .populate('rayonId');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found with this barcode' 
      });
    }

    // Check if product is in stock
    if (product.quantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product is out of stock',
        data: product
      });
    }

    // Decrease quantity by 1
    product.quantity -= 1;
    await product.save();

    res.json({ 
      success: true, 
      message: `Scanned: ${product.name} - Quantity decreased to ${product.quantity}`,
      data: product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get product by barcode (without modifying inventory)
export const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await Product.findOne({ barcode })
      .populate('categoryId')
      .populate('colorId')
      .populate('sizeId')
      .populate('rayonId');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
