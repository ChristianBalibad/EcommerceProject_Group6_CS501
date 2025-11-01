import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const hashedAdminPassword = await bcrypt.hash('admin', 10);
  const hashedCustomerPassword = await bcrypt.hash('customer', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedAdminPassword,
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { username: 'customer' },
    update: {},
    create: {
      username: 'customer',
      email: 'customer@example.com',
      password: hashedCustomerPassword,
      role: 'customer',
    },
  });

  console.log('✅ Users created');

  const products = [
    {
      name: 'Versatile Long Sleeve',
      slug: 'versatile-long-sleeve',
      category: 'TOPS & TSHIRTS',
      price: 299,
      description: 'A versatile long sleeve shirt perfect for any occasion. Made with premium cotton blend for maximum comfort.',
      images: '["/images/products/versatile-long-sleeve.jpg"]',
      stock: 50,
      sizes: 'S,M,L,XL',
      colors: '[{"name":"Black","value":"#000000"},{"name":"White","value":"#FFFFFF"},{"name":"Gray","value":"#808080"}]',
    },
    {
      name: 'Aloha Spirit Polo',
      slug: 'aloha-spirit-polo',
      category: 'TOPS & TSHIRTS',
      price: 599,
      description: 'Bring the island vibes with this comfortable polo shirt. Features a classic fit and breathable fabric.',
      images: '["/images/products/aloha-spirit-polo.jpg"]',
      stock: 30,
      sizes: 'S,M,L,XL,XXL',
      colors: '[{"name":"Blue","value":"#0000FF"},{"name":"Green","value":"#00FF00"},{"name":"Yellow","value":"#FFFF00"}]',
    },
    {
      name: 'Lush Leaf Print',
      slug: 'lush-leaf-print',
      category: 'TOPS & TSHIRTS',
      price: 500,
      description: 'Stand out with this tropical leaf print design. Perfect for summer outings and casual events.',
      images: '["/images/products/lush-leaf-print.jpg"]',
      stock: 25,
      sizes: 'S,M,L,XL',
      colors: '[{"name":"Green","value":"#00FF00"},{"name":"Blue","value":"#0000FF"}]',
    },
    {
      name: 'Classic Grey Sneakers',
      slug: 'classic-grey-sneakers',
      category: 'SHOES',
      price: 899,
      originalPrice: 1299,
      description: 'Stylish grey sneakers with cream sole. Perfect for everyday wear with superior comfort and durability.',
      images: '["/images/products/sneakers-grey-cream.jpg"]',
      stock: 40,
      sizes: '7,8,9,10,11,12',
      colors: '[{"name":"Grey","value":"#808080"}]',
    },
    {
      name: 'Urban Runner',
      slug: 'urban-runner',
      category: 'SHOES',
      price: 999,
      originalPrice: 1499,
      description: 'Modern athletic sneakers with blue sole. Designed for comfort and style in urban environments.',
      images: '["/images/products/sneakers-grey-white-blue.jpg"]',
      stock: 35,
      sizes: '7,8,9,10,11,12',
      colors: '[{"name":"Grey","value":"#808080"},{"name":"White","value":"#FFFFFF"},{"name":"Blue","value":"#0000FF"}]',
    },
    {
      name: 'Brown Two-Piece Set',
      slug: 'brown-two-piece-set',
      category: 'DRESS',
      price: 1299,
      description: 'Elegant brown two-piece outfit for women. Perfect for both casual and semi-formal occasions.',
      images: '["/images/products/women-outfit-brown.jpg"]',
      stock: 20,
      sizes: 'XS,S,M,L,XL',
      colors: '[{"name":"Brown","value":"#8B4513"},{"name":"Beige","value":"#F5F5DC"}]',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('✅ Products created');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

