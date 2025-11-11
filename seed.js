import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Color from './models/Color.js';
import Size from './models/Size.js';
import Rayon from './models/Rayon.js';
import Product from './models/Product.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const sampleData = {
  categories: [
    { name: 'T-Shirts', code: 'TS', description: 'Casual t-shirts and tops' },
    { name: 'Jeans', code: 'JN', description: 'Denim jeans' },
    { name: 'Dresses', code: 'DR', description: 'Formal and casual dresses' },
    { name: 'Shoes', code: 'SH', description: 'Footwear collection' },
    { name: 'Accessories', code: 'AC', description: 'Bags, belts, and more' }
  ],
  colors: [
    { name: 'Black', hexCode: '#000000' },
    { name: 'White', hexCode: '#FFFFFF' },
    { name: 'Red', hexCode: '#FF0000' },
    { name: 'Blue', hexCode: '#0000FF' },
    { name: 'Green', hexCode: '#00FF00' },
    { name: 'Navy', hexCode: '#000080' },
    { name: 'Gray', hexCode: '#808080' },
    { name: 'Pink', hexCode: '#FFC0CB' }
  ],
  sizes: [
    { label: 'Extra Small', value: 'XS', sortOrder: 1 },
    { label: 'Small', value: 'S', sortOrder: 2 },
    { label: 'Medium', value: 'M', sortOrder: 3 },
    { label: 'Large', value: 'L', sortOrder: 4 },
    { label: 'Extra Large', value: 'XL', sortOrder: 5 },
    { label: 'Double XL', value: 'XXL', sortOrder: 6 }
  ],
  rayons: [
    { name: 'Main Floor', code: 'MF', location: 'Ground Floor - Section A' },
    { name: 'Storage A', code: 'SA', location: 'Basement - Left Wing' },
    { name: 'Storage B', code: 'SB', location: 'Basement - Right Wing' },
    { name: 'Display Area', code: 'DA', location: 'Ground Floor - Front' },
    { name: 'Back Stock', code: 'BS', location: 'Second Floor' }
  ]
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Color.deleteMany({});
    await Size.deleteMany({});
    await Rayon.deleteMany({});
    await Product.deleteMany({});

    // Insert categories
    console.log('📁 Seeding categories...');
    const categories = await Category.insertMany(sampleData.categories);
    console.log(`✅ Created ${categories.length} categories`);

    // Insert colors
    console.log('🎨 Seeding colors...');
    const colors = await Color.insertMany(sampleData.colors);
    console.log(`✅ Created ${colors.length} colors`);

    // Insert sizes
    console.log('📏 Seeding sizes...');
    const sizes = await Size.insertMany(sampleData.sizes);
    console.log(`✅ Created ${sizes.length} sizes`);

    // Insert rayons
    console.log('🏢 Seeding rayons...');
    const rayons = await Rayon.insertMany(sampleData.rayons);
    console.log(`✅ Created ${rayons.length} rayons`);

    // Create sample products
    console.log('📦 Seeding products...');
    const products = [];

    // Generate some sample products
    const productNames = [
      'Classic Cotton Tee',
      'Premium Denim Jeans',
      'Elegant Summer Dress',
      'Casual Sneakers',
      'Leather Handbag',
      'Slim Fit Shirt',
      'Cargo Pants',
      'Winter Jacket',
      'Running Shoes',
      'Designer Watch'
    ];

    for (let i = 0; i < productNames.length; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      const randomRayon = rayons[Math.floor(Math.random() * rayons.length)];

      products.push({
        name: productNames[i],
        sku: `SKU-${String(i + 1).padStart(4, '0')}`,
        categoryId: randomCategory._id,
        colorId: randomColor._id,
        sizeId: randomSize._id,
        rayonId: randomRayon._id,
        quantity: Math.floor(Math.random() * 100) + 10,
        price: (Math.random() * 100 + 20).toFixed(2),
        barcode: `BAR${Date.now()}${i}`,
        description: `High-quality ${productNames[i].toLowerCase()} available in multiple sizes and colors`,
        lowStockThreshold: 15
      });
    }

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products`);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Colors: ${colors.length}`);
    console.log(`   Sizes: ${sizes.length}`);
    console.log(`   Rayons: ${rayons.length}`);
    console.log(`   Products: ${products.length}`);
    console.log('\n🚀 You can now start the application!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
