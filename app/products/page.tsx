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
  gender: string;
  price: number;
  originalPrice: number | null;
  description: string;
  images: string;
  stock: number;
  sizes: string;
  colors: string;
  createdAt: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const offersFilter = searchParams.get('offers');
  const arrivalsFilter = searchParams.get('arrivals');
  const genderFilter = searchParams.get('gender');
  const categoryFilter = searchParams.get('category');
  const colorFilter = searchParams.get('color');
  const discountFilter = searchParams.get('discount') || offersFilter;
  const [products, setProducts] = useState<Product[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [newArrivalsCount, setNewArrivalsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        const params = new URLSearchParams();
        if (categoryFilter) {
          params.append('category', categoryFilter);
        }
        if (genderFilter) {
          params.append('gender', genderFilter);
        }
        if (colorFilter) {
          params.append('color', colorFilter);
        }
        
        const [filteredResponse, allResponse] = await Promise.all([
          fetch(`/api/products?${params.toString()}`),
          fetch('/api/products')
        ]);
        
        const filteredData = await filteredResponse.json();
        const allData = await allResponse.json();
        
        let finalProducts = filteredData.products || [];
        
        if (arrivalsFilter === 'new') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          finalProducts = finalProducts.filter((product: Product) => {
            const createdAt = new Date(product.createdAt);
            return createdAt >= thirtyDaysAgo;
          });
        }
        
        if (discountFilter) {
          finalProducts = finalProducts.filter((product: Product) => {
            if (!product.originalPrice || product.originalPrice <= product.price) {
              return false;
            }
            
            const discountPercent = ((product.originalPrice - product.price) / product.originalPrice) * 100;
            
            if (discountFilter === 'up-to-60-off') {
              return discountPercent > 0 && discountPercent <= 60;
            } else if (discountFilter === 'discount-50-plus') {
              return discountPercent >= 50;
            } else if (discountFilter === 'discount-40-50') {
              return discountPercent >= 40 && discountPercent < 50;
            } else if (discountFilter === 'discount-30-40') {
              return discountPercent >= 30 && discountPercent < 40;
            } else if (discountFilter === 'discount-20-30') {
              return discountPercent >= 20 && discountPercent < 30;
            } else if (discountFilter === 'discount-10-20') {
              return discountPercent >= 10 && discountPercent < 20;
            }
            
            return false;
          });
        }
        
        if (arrivalsFilter !== 'new') {
          finalProducts = finalProducts.sort(() => Math.random() - 0.5);
        }
        
        setProducts(finalProducts);
        
        const colorsSet = new Set<string>();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        let newCount = 0;
        
        (allData.products || []).forEach((product: Product) => {
          const createdAt = new Date(product.createdAt);
          if (createdAt >= thirtyDaysAgo) {
            newCount++;
          }
          
          try {
            const colors = JSON.parse(product.colors || '[]');
            colors.forEach((colorObj: { name: string }) => {
              if (colorObj.name) {
                colorsSet.add(colorObj.name);
              }
            });
          } catch (e) {
            console.error('Error parsing colors', e);
          }
        });
        
        setAvailableColors(Array.from(colorsSet).sort());
        setNewArrivalsCount(newCount);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, genderFilter, colorFilter, arrivalsFilter, discountFilter]);

  return (
    <div className="flex gap-6">
      <FilterSidebar 
        initialFilter={offersFilter || undefined}
        initialDiscount={discountFilter || undefined}
        initialArrivals={arrivalsFilter || undefined}
        initialGender={genderFilter || undefined}
        initialCategory={categoryFilter || undefined}
        availableColors={availableColors}
        newArrivalsCount={newArrivalsCount}
      />
      
      <div style={{ width: '1176px' }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {products.filter((product) => {
                try {
                  const imagesArray = JSON.parse(product.images || '[]');
                  if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                    const firstImage = imagesArray[0];
                    return typeof firstImage === 'string' ? firstImage : (firstImage as { url?: string })?.url;
                  }
                  return false;
                } catch {
                  return false;
                }
              }).length} products
            </p>
          </div>
          <div className="grid grid-cols-3" style={{ gap: '40px 24px' }}>
          {products.map((product) => {
            let mainImage = '';
            try {
              const imagesArray = JSON.parse(product.images || '[]');
              if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                const firstImage = imagesArray[0];
                mainImage = typeof firstImage === 'string' ? firstImage : (firstImage as { url?: string })?.url || '';
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
                originalPrice={product.originalPrice ? `₱${product.originalPrice}` : undefined}
                href={`/products/${product.slug}`}
              />
            );
          }).filter(Boolean)}
          </div>
        </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    document.title = 'Shop All Products | Undefined';
  }, [searchParams]);

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

