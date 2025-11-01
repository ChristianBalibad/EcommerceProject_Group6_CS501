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

  console.log('Users created');

  const products = [
    {
      name: 'Undefined Men\'s Dri-FIT Running T-Shirt',
      slug: 'undefined-men-dri-fit-running-t-shirt',
      category: 'tops-tshirts',
      gender: 'men',
      price: 899,
      originalPrice: 1399,
      description: 'Unleash your speed in this smooth and breathable tee, powered by sweat-wicking Dri-FIT technology.',
      images: JSON.stringify([
        {url: '/images/products/undefined-men-dri-fit-running-t-shirt-lifestyle1-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-men-dri-fit-running-t-shirt-lifestyle2-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-men-dri-fit-running-t-shirt-lifestyle3-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-men-dri-fit-running-t-shirt-lifestyle1-white.avif', colors: ['White']},
        {url: '/images/products/undefined-men-dri-fit-running-t-shirt-lifestyle2-white.avif', colors: ['White']},
        {url: '/images/products/undefined-men-dri-fit-running-t-shirt-lifestyle3-white.avif', colors: ['White']},
        {url: '/images/products/undefined-men-dri-fit-running-t-shirt-lifestyle1-blue.avif', colors: ['Blue']},
        {url: '/images/products/undefined-men-dri-fit-running-t-shirt-lifestyle2-blue.avif', colors: ['Blue']},
        {url: '/images/products/undefined-men-dri-fit-running-t-shirt-lifestyle3-blue.avif', colors: ['Blue']},
      ]),
      stock: 999,
      sizes: 'XS,S,M,L,XL,XXL',
      colors: '[{"name":"Black","value":"#000000"},{"name":"White","value":"#FFFFFF"},{"name":"Blue","value":"#0000FF"}]',
    },
    {
      name: 'Undefined Pro | Men\'s Dri-FIT Tight Short-Sleeve Fitness Top',
      slug: 'undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top',
      category: 'tops-tshirts',
      gender: 'men',
      price: 999,
      description: 'The Undefined Pro collection is all about giving you the confidence to push past your personal goals. This slim-fitting top has a smooth and stretchy feel that suits your favourite sports and exercises. Plus, it offers a rounded hem for extra coverage or a secure feel when you tuck it into your bottoms.',
      images: JSON.stringify([
        {url: '/images/products/undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top-lifestyle1-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top-lifestyle2-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top-lifestyle3-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top-lifestyle1-white.avif', colors: ['White']},
        {url: '/images/products/undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top-lifestyle2-white.avif', colors: ['White']},
        {url: '/images/products/undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top-lifestyle3-white.avif', colors: ['White']},
        {url: '/images/products/undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top-lifestyle1-blue.avif', colors: ['Blue']},
        {url: '/images/products/undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top-lifestyle2-blue.avif', colors: ['Blue']},
        {url: '/images/products/undefined-pro-men-dri-fit-tight-short-sleeve-fitness-top-lifestyle3-blue.avif', colors: ['Blue']},
      ]),
      stock: 999,
      sizes: 'XS,S,M,L,XL',
      colors: '[{"name":"Black","value":"#000000"},{"name":"White","value":"#FFFFFF"},{"name":"Blue","value":"#0000FF"}]',
    },
    {
      name: 'Undefined Sport | Men\'s Dri-FIT Jumpman T-Shirt',
      slug: 'undefined-sport-men-dri-fit-jumpman-t-shirt',
      category: 'tops-tshirts',
      gender: 'men',
      price: 1099,
      originalPrice: 1599,
      description: 'Whether you\'re stepping into the gym or onto the court, you need to come prepared. Our sweat-wicking tech elevates this jersey knit tee, helping you stay dry and comfortable however hard you push yourself.',
      images: JSON.stringify([
        {url: '/images/products/undefined-sport-men-dri-fit-jumpman-t-shirt-lifestyle1-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-sport-men-dri-fit-jumpman-t-shirt-lifestyle2-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-sport-men-dri-fit-jumpman-t-shirt-lifestyle3-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-sport-men-dri-fit-jumpman-t-shirt-lifestyle4-black.avif', colors: ['Black']},
      ]),
      stock: 999,
      sizes: 'XS,S,M,L,XL,XXL',
      colors: '[{"name":"Black","value":"#000000"}]',
    },
    {
      name: 'Undefined Sport | Men\'s Dri-FIT Sleeveless Base Layer Tank Top',
      slug: 'undefined-sport-men-dri-fit-sleeveless-base-layer-tank-top',
      category: 'tops-tshirts',
      gender: 'men',
      price: 899,
      originalPrice: 1299,
      description: 'Designed to be layered or worn alone, this base layer tank top is made from soft jersey knit fabric that uses our sweat-wicking tech to help you stay dry and comfortable.',
      images: JSON.stringify([
        {url: '/images/products/undefined-sport-men-dri-fit-sleeveless-base-layer-tank-top-lifestyle1-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-sport-men-dri-fit-sleeveless-base-layer-tank-top-lifestyle2-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-sport-men-dri-fit-sleeveless-base-layer-tank-top-lifestyle3-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-sport-men-dri-fit-sleeveless-base-layer-tank-top-lifestyle4-black.avif', colors: ['Black']},
      ]),
      stock: 999,
      sizes: 'XS,S,M,L,XL,XXL',
      colors: '[{"name":"Black","value":"#000000"}]',
    },
    {
      name: 'Undefined Flight Essentials | Men\'s T-Shirt',
      slug: 'undefined-flight-essentials-men-t-shirt',
      category: 'tops-tshirts',
      gender: 'men',
      price: 999,
      originalPrice: 1499,
      description: 'The heavyweight cotton gives this roomy tee a structured look and feel. The raised branding adds a retro vibe.',
      images: JSON.stringify([
        {url: '/images/products/undefined-flight-essentials-men-t-shirt-lifestyle1-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-flight-essentials-men-t-shirt-lifestyle2-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-flight-essentials-men-t-shirt-lifestyle3-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-flight-essentials-men-t-shirt-lifestyle1-orange.avif', colors: ['Orange']},
        {url: '/images/products/undefined-flight-essentials-men-t-shirt-lifestyle2-orange.avif', colors: ['Orange']},
        {url: '/images/products/undefined-flight-essentials-men-t-shirt-lifestyle3-orange.avif', colors: ['Orange']},
      ]),
      stock: 999,
      sizes: 'XS,S,M,L,XL,XXL',
      colors: '[{"name":"Black","value":"#000000"},{"name":"Orange","value":"#FFA500"}]',
    },
    {
      name: 'Undefined Swift | Women\'s Dri-FIT Short-Sleeve Running Top',
      slug: 'undefined-swift-women-dri-fit-short-sleeve-running-top',
      category: 'tops-tshirts',
      gender: 'women',
      price: 999,
      description: 'Using insights from runners like you, we prioritised functionality to refresh our Swift essentials. This lightweight top has been designed to help reduce chafing and improve breathability. It\'s soft and sweat-wicking so you can focus on your miles, and nothing else.',
      images: JSON.stringify([
        {url: '/images/products/undefined-swift-women-dri-fit-short-sleeve-running-top-lifestyle1-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-swift-women-dri-fit-short-sleeve-running-top-lifestyle2-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-swift-women-dri-fit-short-sleeve-running-top-lifestyle3-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-swift-women-dri-fit-short-sleeve-running-top-lifestyle1-light-pink.avif', colors: ['Light Pink']},
        {url: '/images/products/undefined-swift-women-dri-fit-short-sleeve-running-top-lifestyle2-light-pink.avif', colors: ['Light Pink']},
        {url: '/images/products/undefined-swift-women-dri-fit-short-sleeve-running-top-lifestyle3-light-pink.avif', colors: ['Light Pink']},
        {url: '/images/products/undefined-swift-women-dri-fit-short-sleeve-running-top-lifestyle1-white.avif', colors: ['White']},
        {url: '/images/products/undefined-swift-women-dri-fit-short-sleeve-running-top-lifestyle2-white.avif', colors: ['White']},
        {url: '/images/products/undefined-swift-women-dri-fit-short-sleeve-running-top-lifestyle3-white.avif', colors: ['White']},
      ]),
      stock: 999,
      sizes: 'XXS,XS,S,M,L',
      colors: '[{"name":"Black","value":"#000000"},{"name":"Light Pink","value":"#FFB6C1"},{"name":"White","value":"#FFFFFF"}]',
    },
    {
      name: 'Undefined | Air Max 95 Big Bubble Black',
      slug: 'undefined-air-max-95-big-bubble-black',
      category: 'shoes',
      gender: 'unisex',
      price: 999,
      description: 'Big. Bold. Bounce. To celebrate 30 years of the iconic silhouette, the Undefined Air Max family welcomes back the \'Big Bubble\' edition of the 95. And we decided to bring back the zipped version from the early 2000s as well. It all comes together with an all-black look, including the classic stacks of suede. Elevate your style with a little more Air underfoot, and enjoy the future of your UndefinedAir Max journey.',
      images: JSON.stringify([
        {url: '/images/products/undefined-air-max-95-big-bubble-angle1-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-air-max-95-big-bubble-angle2-black.avif', colors: ['Black']},
        {url: '/images/products/undefined-air-max-95-big-bubble-angle3-black.avif', colors: ['Black']},
      ]),
      stock: 999,
      sizes: '4,5,6,7,8,9,10,11',
      colors: '[{"name":"Black","value":"#000000"}]',
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Products created');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

