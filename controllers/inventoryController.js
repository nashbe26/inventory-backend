import Product from '../models/Product.js';

// Adjust inventory
export const adjustInventory = async (req, res) => {
  try {
    const { productId, quantity, type, reason } = req.body;

    if (!productId || quantity === undefined || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID, quantity, and type are required' 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Adjust quantity based on type
    if (type === 'increase') {
      product.quantity += quantity;
    } else if (type === 'decrease') {
      if (product.quantity < quantity) {
        return res.status(400).json({ 
          success: false, 
          message: 'Insufficient quantity in stock' 
        });
      }
      product.quantity -= quantity;
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid type. Use "increase" or "decrease"' 
      });
    }

    await product.save();

    res.json({ 
      success: true, 
      data: product,
      message: `Inventory ${type}d by ${quantity} units` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get low stock products
export const getLowStock = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categoryId', 'name code')
      .populate('colorId', 'name hexCode')
      .populate('sizeId', 'label value')
      .populate('rayonId', 'name code');

    const lowStockProducts = products.filter(product => 
      product.quantity <= product.lowStockThreshold && product.quantity > 0
    );

    const outOfStockProducts = products.filter(product => 
      product.quantity === 0
    );

    res.json({ 
      success: true, 
      data: {
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get inventory stats
export const getInventoryStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find();

    const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * p.quantity, 0);
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    
    const lowStockCount = products.filter(p => 
      p.quantity <= p.lowStockThreshold && p.quantity > 0
    ).length;
    
    const outOfStockCount = products.filter(p => p.quantity === 0).length;

    res.json({
      success: true,
      data: {
        totalProducts,
        totalQuantity,
        totalValue,
        lowStockCount,
        outOfStockCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
