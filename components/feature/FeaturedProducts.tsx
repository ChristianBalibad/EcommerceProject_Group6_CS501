'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FeatureCard from './FeatureCard';

interface Product {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
}

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          const products = data.products || [];
          
          const shuffled = [...products].sort(() => Math.random() - 0.5);
          const selected = shuffled.slice(0, 4);
          
          setFeaturedProducts(selected);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
          Featured Products
        </h2>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {featuredProducts.map((product) => {
              let mainImage = '';
              try {
                const imagesData = (product as { images?: string | string[] }).images;
                if (typeof imagesData === 'string') {
                  const imagesArray = JSON.parse(imagesData || '[]');
                  if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                    const firstImage = imagesArray[0];
                    mainImage = typeof firstImage === 'string' ? firstImage : (firstImage as { url?: string })?.url || '';
                  }
                } else if (Array.isArray(imagesData) && imagesData.length > 0) {
                  mainImage = imagesData[0];
                }
              } catch (error) {
                console.error('Error parsing images:', error);
              }
              
              if (!mainImage) return null;
              
              return (
                <FeatureCard
                  key={product.id}
                  title={product.name}
                  imageSrc={mainImage}
                  imageAlt={product.name}
                  href={`/products/${product.slug}`}
                />
              );
            }).filter(Boolean)}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Loading products...
          </div>
        )}
        
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

