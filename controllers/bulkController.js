import Product from '../models/Product.js';
import { generateBarcode } from '../utils/barcodeGenerator.js';
import archiver from 'archiver';

// Generate barcodes for multiple products (returns ZIP file)
export const bulkGenerateBarcodes = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    // Fetch all products
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found'
      });
    }

    // Set response headers for ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="barcodes-${Date.now()}.zip"`);

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Pipe archive to response
    archive.pipe(res);

    // Generate barcode for each product and add to archive
    for (const product of products) {
      try {
        const barcodeBuffer = await generateBarcode(product.barcode || product.sku);
        archive.append(barcodeBuffer, { name: `barcode-${product.sku}.png` });
      } catch (error) {
        console.error(`Error generating barcode for ${product.sku}:`, error);
      }
    }

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error('Bulk barcode generation error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

// Generate dochettes for multiple products (returns ZIP file)
export const bulkGenerateDochettes = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    // Import dochette generator dynamically to avoid circular dependency
    const { generateDochette } = await import('../utils/dochetteGenerator.js');

    // Fetch all products with populated references
    const products = await Product.find({ _id: { $in: productIds } })
      .populate('categoryId')
      .populate('colorId')
      .populate('sizeId')
      .populate('rayonId');

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found'
      });
    }

    // Set response headers for ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="dochettes-${Date.now()}.zip"`);

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    // Pipe archive to response
    archive.pipe(res);

    // Generate dochette for each product and add to archive
    for (const product of products) {
      try {
        const dochetteBuffer = await generateDochette(product);
        archive.append(dochetteBuffer, { name: `dochette-${product.sku}.pdf` });
      } catch (error) {
        console.error(`Error generating dochette for ${product.sku}:`, error);
      }
    }

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error('Bulk dochette generation error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

// Generate all barcodes for all products
export const generateAllBarcodes = async (req, res) => {
  try {
    const products = await Product.find({});

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found'
      });
    }

    // Set response headers for ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="all-barcodes-${Date.now()}.zip"`);

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    // Pipe archive to response
    archive.pipe(res);

    // Generate barcode for each product
    for (const product of products) {
      try {
        const barcodeBuffer = await generateBarcode(product.barcode || product.sku);
        archive.append(barcodeBuffer, { name: `barcode-${product.sku}.png` });
      } catch (error) {
        console.error(`Error generating barcode for ${product.sku}:`, error);
      }
    }

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error('Generate all barcodes error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

// Generate all dochettes for all products
export const generateAllDochettes = async (req, res) => {
  try {
    const { generateDochette } = await import('../utils/dochetteGenerator.js');

    const products = await Product.find({})
      .populate('categoryId')
      .populate('colorId')
      .populate('sizeId')
      .populate('rayonId');

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found'
      });
    }

    // Set response headers for ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="all-dochettes-${Date.now()}.zip"`);

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    // Pipe archive to response
    archive.pipe(res);

    // Generate dochette for each product
    for (const product of products) {
      try {
        const dochetteBuffer = await generateDochette(product);
        archive.append(dochetteBuffer, { name: `dochette-${product.sku}.pdf` });
      } catch (error) {
        console.error(`Error generating dochette for ${product.sku}:`, error);
      }
    }

    // Finalize the archive
    await archive.finalize();

  } catch (error) {
    console.error('Generate all dochettes error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};
