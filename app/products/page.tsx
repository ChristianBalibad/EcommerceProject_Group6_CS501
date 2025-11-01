'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterSidebar from '@/components/product/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';

interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number | null;
  description: string;
  imageUrl: string;
  stock: number;
  sizes: string;
  colors: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const offersFilter = searchParams.get('offers');
  const genderFilter = searchParams.get('gender');
  const categoryFilter = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (categoryFilter) {
          params.append('category', categoryFilter);
        }
        
        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter]);

  if (loading) {
    return <div>Loading products...</div>;
  }

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
          {products.map((product) => {
            let mainImage = '';
            try {
              const imagesData = product.images;
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
              console.error('Error parsing product images:', error);
            }
            
            if (!mainImage) return null;
            
            return (
              <ProductCard
                key={product.id}
                imageSrc={mainImage}
                imageAlt={product.name}
                category={product.category}
                productName={product.name}
                price={`₱${product.price}`}
                href={`/products/${product.slug}`}
              />
            );
          }).filter(Boolean)}
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

