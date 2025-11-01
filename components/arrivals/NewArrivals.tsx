'use client';

import { useState, useEffect } from 'react';
import HorizontalCard from '../card/HorizontalCard';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export default function NewArrivals() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          const products = data.products || [];
          
          const sorted = [...products].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          const shuffled = sorted.slice(2).sort(() => Math.random() - 0.5);
          const selected = [...sorted.slice(0, 2), ...shuffled.slice(0, 1)].slice(0, 2);
          
          setNewArrivals(selected);
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <section className="w-full bg-white pt-8 md:pt-12 pb-16 md:pb-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
          New Arrivals
        </h2>
        
        {newArrivals.length > 0 ? (
          <div className="flex flex-col gap-8">
            {newArrivals.map((product, index) => {
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
                <HorizontalCard
                  key={product.id}
                  headline={product.name}
                  description={product.description}
                  buttonText="Buy Now"
                  imageSrc={mainImage}
                  imageAlt={product.name}
                  imagePosition={index % 2 === 0 ? 'right' : 'left'}
                  href={`/products/${product.slug}`}
                />
              );
            }).filter(Boolean)}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Loading new arrivals...
          </div>
        )}
      </div>
    </section>
  );
}

