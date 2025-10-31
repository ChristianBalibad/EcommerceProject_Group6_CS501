'use client';

import Link from 'next/link';
import FeatureCard from './FeatureCard';

const featuredProducts = [
  {
    title: 'Bandana Button Up - Navy',
    imageSrc: '/images/products/bandana-button-up-navy.jpg',
    imageAlt: 'Bandana Button Up shirt in navy',
    href: '/products/bandana-button-up-navy',
  },
  {
    title: 'Aspen Relaxed Crewneck Sweatshirt',
    imageSrc: '/images/products/aspen-relaxed-crewneck.jpg',
    imageAlt: 'Aspen Relaxed Crewneck Sweatshirt',
    href: '/products/aspen-relaxed-crewneck',
  },
  {
    title: 'Flatlay Sweatshirt',
    imageSrc: '/images/products/flatlay-sweatshirt.jpg',
    imageAlt: 'Flatlay Sweatshirt',
    href: '/products/flatlay-sweatshirt',
  },
  {
    title: 'Essential Tee - Brown',
    imageSrc: '/images/products/essential-tee-brown.jpg',
    imageAlt: 'Essential Tee in brown',
    href: '/products/essential-tee-brown',
  },
];

export default function FeaturedProducts() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
          Featured Products
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {featuredProducts.map((product, index) => (
            <FeatureCard
              key={index}
              title={product.title}
              imageSrc={product.imageSrc}
              imageAlt={product.imageAlt}
              href={product.href}
            />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-black text-white rounded-lg font-medium transition-colors hover:bg-gray-800"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}

