'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
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
  const [isActualDrag, setIsActualDrag] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMoved = useRef(false);

  const relatedProducts = products.filter((p) => p.slug !== currentProductSlug);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    setIsActualDrag(false);
    hasMoved.current = false;
  }, []);

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = (e: MouseEvent) => {
        if (hasMoved.current) {
          e.preventDefault();
        }
        stopDragging();
      };
      
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!scrollContainerRef.current) return;
        
        if (!hasMoved.current) {
          const deltaX = Math.abs(e.pageX - scrollContainerRef.current.offsetLeft - startXRef.current);
          if (deltaX > 5) {
            hasMoved.current = true;
            setIsActualDrag(true);
            const links = scrollContainerRef.current.querySelectorAll('a');
            links.forEach(link => {
              link.style.pointerEvents = 'none';
            });
          }
        }
        
        if (hasMoved.current) {
          e.preventDefault();
          const x = e.pageX - scrollContainerRef.current.offsetLeft;
          const walk = (x - startXRef.current) * 2;
          scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
        }
      };

      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false });
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      
      const container = scrollContainerRef.current;
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        if (container) {
          const links = container.querySelectorAll('a');
          links.forEach(link => {
            link.style.pointerEvents = 'auto';
          });
        }
      };
    }
  }, [isDragging, stopDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    hasMoved.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDragging(true);
    e.stopPropagation();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    if (!hasMoved.current) {
      const deltaX = Math.abs(e.pageX - scrollContainerRef.current.offsetLeft - startXRef.current);
      if (deltaX > 5) {
        hasMoved.current = true;
        setIsActualDrag(true);
        const links = scrollContainerRef.current.querySelectorAll('a');
        links.forEach(link => {
          link.style.pointerEvents = 'none';
        });
      }
    }
    
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startXRef.current) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    stopDragging();
  }, [stopDragging]);

  const handleMouseLeave = useCallback(() => {
    stopDragging();
  }, [stopDragging]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      return;
    }
    hasMoved.current = false;
    startXRef.current = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    hasMoved.current = true;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    stopDragging();
  }, [stopDragging]);

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
                isDragging={isActualDrag}
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
