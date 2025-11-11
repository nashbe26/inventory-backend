import PDFDocument from 'pdfkit';
import { generateBarcode } from './barcodeGenerator.js';

/**
 * Generate product dochette (label) as PDF
 * @param {Object} product - Product object with populated references
 * @returns {Promise<Buffer>} - PDF buffer
 */
export const generateDochette = async (product) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: [283.46, 141.73], // 100mm x 50mm label
        margins: { top: 10, bottom: 10, left: 10, right: 10 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Title
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text(product.name, { align: 'center' });
      
      doc.moveDown(0.3);

      // Product details
      doc.fontSize(9)
         .font('Helvetica');

      const details = [
        `SKU: ${product.sku}`,
        `Category: ${product.categoryId?.name || 'N/A'}`,
        `Color: ${product.colorId?.name || 'N/A'}`,
        `Size: ${product.sizeId?.label || 'N/A'}`,
        `Rayon: ${product.rayonId?.name || 'N/A'}`,
        `Quantity: ${product.quantity}`,
      ];

      if (product.price) {
        details.push(`Price: $${product.price.toFixed(2)}`);
      }

      details.forEach(detail => {
        doc.text(detail);
      });

      doc.moveDown(0.5);

      // Add barcode
      try {
        const barcodeBuffer = await generateBarcode(product.barcode || product.sku);
        doc.image(barcodeBuffer, {
          fit: [200, 50],
          align: 'center'
        });
      } catch (error) {
        doc.fontSize(8).text('Barcode generation failed', { align: 'center' });
      }

      // Footer
      doc.moveDown(0.3);
      doc.fontSize(7)
         .text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default { generateDochette };
