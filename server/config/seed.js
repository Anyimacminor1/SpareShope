require('dotenv').config();
const db = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  await db.sequelize.sync({ force: true });
  const password = await bcrypt.hash('password', 10);
  await db.User.create({ name: 'Admin', email: 'admin@example.com', password, role: 'admin' });
  await db.User.create({ name: 'User', email: 'user@example.com', password, role: 'user' });

  const products = [
    {
      name: 'Genuine Land Rover Brake Pad Set',
      description: 'Premium brake pad set for Defender and Discovery. OE quality for maximum safety and performance.',
      price: 89.99,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop',
      model: 'Defender',
      year: '2001-2015',
      compatibility: 'Defender 90/110/130, Discovery 2',
      partNumber: 'LR019618',
    },
    {
      name: 'Air Suspension Compressor',
      description: 'High-performance air suspension compressor for Range Rover. Ensures smooth ride and handling.',
      price: 349.99,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600&h=400&fit=crop',
      model: 'Range Rover',
      year: '2016-2025',
      compatibility: 'Range Rover L405, Range Rover Sport',
      partNumber: 'LR072537',
    },
    {
      name: 'Oil Filter - Genuine',
      description: 'Durable oil filter for Land Rover Series and Defender. Protects engine from contaminants.',
      price: 15.99,
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
      model: 'Series',
      year: '1948-1985',
      compatibility: 'Series I/II/III, Defender',
      partNumber: 'RTC3183',
    },
    {
      name: 'Front Bumper',
      description: 'Heavy-duty front bumper for Land Rover Discovery. Powder-coated for corrosion resistance.',
      price: 229.99,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      model: 'Discovery',
      year: '2001-2015',
      compatibility: 'Discovery 2/3/4',
      partNumber: 'DA5646',
    },
    {
      name: 'Timing Belt Kit',
      description: 'Complete timing belt kit for Range Rover and Discovery. Includes belt, tensioner, and pulleys.',
      price: 179.99,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop',
      model: 'Range Rover',
      year: '2001-2015',
      compatibility: 'Range Rover L322, Discovery 3/4',
      partNumber: 'ERR1092',
    },
    {
      name: 'Fuel Pump Assembly',
      description: 'OEM fuel pump assembly for Land Rover Defender. Reliable fuel delivery for optimal performance.',
      price: 259.99,
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600&h=400&fit=crop',
      model: 'Defender',
      year: '1986-2000',
      compatibility: 'Defender 90/110',
      partNumber: 'WFX000280',
    },
  ];

  for (const p of products) {
    await db.Product.create(p);
  }

  console.log('Seeded demo users and rich Land Rover products');
  process.exit();
}

seed(); 