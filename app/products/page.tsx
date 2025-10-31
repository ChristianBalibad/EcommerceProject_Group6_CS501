'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSidebar from '@/components/product/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';

const products = [
  {
    id: 1,
    imageSrc: '/images/products/versatile-long-sleeve.jpg',
    imageAlt: 'Versatile Long sleeve',
    category: 'Tops & Tshirts',
    productName: 'Versatile Long sleeve',
    price: '₱299',
    href: '/products/versatile-long-sleeve',
  },
  {
    id: 2,
    imageSrc: '/images/products/aloha-spirit-polo.jpg',
    imageAlt: 'Aloha Spirit Polo',
    category: 'Tops & Tshirts',
    productName: 'Aloha Spirit Polo',
    price: '₱599',
    href: '/products/aloha-spirit-polo',
  },
  {
    id: 3,
    imageSrc: '/images/products/lush-leaf-print.jpg',
    imageAlt: 'Lush Leaf Print',
    category: 'Tops & Tshirts',
    productName: 'Lush Leaf Print',
    price: '₱500',
    href: '/products/lush-leaf-print',
  },
  {
    id: 4,
    imageSrc: '/images/products/sneakers-grey-cream.jpg',
    imageAlt: 'Grey sneakers with cream sole',
    category: 'Shoes',
    productName: 'Classic Grey Sneakers',
    price: '₱899',
    href: '/products/classic-grey-sneakers',
  },
  {
    id: 5,
    imageSrc: '/images/products/sneakers-grey-white-blue.jpg',
    imageAlt: 'Grey and white sneakers with blue sole',
    category: 'Shoes',
    productName: 'Urban Runner',
    price: '₱999',
    href: '/products/urban-runner',
  },
  {
    id: 6,
    imageSrc: '/images/products/women-outfit-brown.jpg',
    imageAlt: 'Brown two-piece women outfit',
    category: 'Dress',
    productName: 'Brown Two-Piece Set',
    price: '₱1299',
    href: '/products/brown-two-piece-set',
  },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const offersFilter = searchParams.get('offers');
  const genderFilter = searchParams.get('gender');
  const categoryFilter = searchParams.get('category');

  return (
    <div className="flex gap-6">
      <FilterSidebar 
        key={`${offersFilter || ''}-${genderFilter || ''}-${categoryFilter || ''}`} 
        initialFilter={offersFilter || undefined}
        initialGender={genderFilter || undefined}
        initialCategory={categoryFilter || undefined}
      />
      
      <div style={{ width: '1176px' }}>
        <div className="grid grid-cols-3" style={{ gap: '40px 24px' }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              imageSrc={product.imageSrc}
              imageAlt={product.imageAlt}
              category={product.category}
              productName={product.productName}
              price={product.price}
              href={product.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1520px' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsContent />
        </Suspense>
      </div>
    </main>
  );
}

