import bwipjs from 'bwip-js';

/**
 * Generate barcode image buffer
 * @param {string} text - Text to encode in barcode
 * @returns {Promise<Buffer>} - PNG image buffer
 */
export const generateBarcode = async (text) => {
  try {
    const buffer = await bwipjs.toBuffer({
      bcid: 'code128',       // Barcode type
      text: text,             // Text to encode
      scale: 3,               // 3x scaling factor
      height: 10,             // Bar height, in millimeters
      includetext: true,      // Show human-readable text
      textxalign: 'center',   // Center the text
    });
    
    return buffer;
  } catch (error) {
    console.error('Barcode generation error:', error);
    throw new Error('Failed to generate barcode');
  }
};

/**
 * Generate simple barcode string from SKU
 * @param {string} sku - Product SKU
 * @returns {string} - Barcode string
 */
export const generateBarcodeString = (sku) => {
  // Simple barcode generation - can be customized
  const timestamp = Date.now().toString().slice(-6);
  return `${sku}${timestamp}`;
};

export default { generateBarcode, generateBarcodeString };
