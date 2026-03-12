// utils/seeder.js
// Seeds the database with sample products and an admin user
// Run with: npm run seed

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and exceptional sound quality. Perfect for travel, work from home, or daily commute.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 50,
  },
  {
    name: 'Smart Watch Series X',
    description: 'Feature-packed smartwatch with health monitoring, GPS, always-on display, and 7-day battery life. Compatible with iOS and Android.',
    price: 399.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 30,
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Tactile mechanical keyboard with Cherry MX switches, per-key RGB backlighting, and aluminum frame. Ideal for gaming and programming.',
    price: 149.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    stock: 40,
  },
  {
    name: 'Classic Leather Jacket',
    description: 'Genuine full-grain leather jacket with quilted lining, multiple pockets, and a timeless design that never goes out of style.',
    price: 249.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    stock: 25,
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight and responsive running shoes with advanced cushioning technology, breathable mesh upper, and durable rubber outsole.',
    price: 129.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 60,
  },
  {
    name: 'The Art of Clean Code',
    description: 'A comprehensive guide to writing readable, maintainable, and efficient code. Essential reading for every software developer.',
    price: 39.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    stock: 100,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick non-slip yoga mat made from eco-friendly TPE material. Includes carrying strap. Perfect for yoga, pilates, and stretching.',
    price: 59.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    stock: 75,
  },
  {
    name: 'Stainless Steel Coffee Maker',
    description: 'Programmable 12-cup coffee maker with built-in grinder, thermal carafe, and smartphone scheduling via Bluetooth.',
    price: 189.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    stock: 20,
  },
  {
    name: 'Vitamin C Serum',
    description: 'Professional-grade 20% Vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, reduces wrinkles, and provides UV protection.',
    price: 49.99,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    stock: 80,
  },
  {
    name: 'Bluetooth Portable Speaker',
    description: 'Waterproof portable speaker with 360° sound, 20-hour battery, built-in microphone, and multi-speaker pairing support.',
    price: 79.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock: 45,
  },
  {
    name: 'LEGO Architecture Set',
    description: 'Build famous world landmarks with this 1500-piece LEGO architecture set. Includes detailed booklet with architectural facts.',
    price: 89.99,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    stock: 35,
  },
  {
    name: 'Plant Grow Light LED Panel',
    description: 'Full spectrum LED grow light for indoor plants. Adjustable spectrum, timer function, and coverage up to 4x4 feet. Ideal for succulents, herbs, and vegetables.',
    price: 69.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    stock: 55,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('👤 Admin user created: admin@ecommerce.com / admin123');

    // Create test regular user
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });
    console.log('👤 Test user created: john@example.com / password123');

    // Insert sample products with admin as creator
    const productsWithCreator = sampleProducts.map((p) => ({
      ...p,
      createdBy: adminUser._id,
    }));
    await Product.insertMany(productsWithCreator);
    console.log(`📦 ${sampleProducts.length} products seeded successfully`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login  → admin@ecommerce.com / admin123');
    console.log('User Login   → john@example.com / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
