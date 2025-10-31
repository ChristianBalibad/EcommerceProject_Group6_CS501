'use client';

import { useRef, useState, useCallback } from 'react';
import ProductCard from './ProductCard';

interface RelatedProduct {
  slug: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string | null;
  imageSrc: string;
}

interface YouMightAlsoLikeProps {
  currentProductSlug: string;
  products: RelatedProduct[];
}

export default function YouMightAlsoLike({ currentProductSlug, products }: YouMightAlsoLikeProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const hasMoved = useRef(false);

  const relatedProducts = products.filter((p) => p.slug !== currentProductSlug);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    hasMoved.current = false;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const deltaX = Math.abs(e.pageX - scrollContainerRef.current.offsetLeft - startX);
    
    if (deltaX > 5) {
      hasMoved.current = true;
    }
    
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (isDragging && hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDragging(false);
    hasMoved.current = false;
  }, [isDragging]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-16 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-black mb-8">You Might Also Like</h2>
      
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className={`flex gap-6 overflow-x-auto overflow-y-visible pb-4 scrollbar-hide cursor-grab ${isDragging ? 'cursor-grabbing' : ''} select-none`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {relatedProducts.map((product) => (
            <div 
              key={product.slug} 
              className="flex-shrink-0"
            >
              <ProductCard
                imageSrc={product.imageSrc}
                imageAlt={product.name}
                category={product.category}
                productName={product.name}
                price={product.price}
                originalPrice={product.originalPrice || undefined}
                href={`/products/${product.slug}`}
              />
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-4 w-5 bg-gradient-to-r from-white to-transparent pointer-events-none z-20"></div>
        <div className="absolute right-0 top-0 bottom-4 w-5 bg-gradient-to-l from-white to-transparent pointer-events-none z-20"></div>
      </div>
    </section>
  );
}
