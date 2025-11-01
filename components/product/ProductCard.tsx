'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  imageSrc: string;
  imageAlt: string;
  category: string;
  productName: string;
  price: string;
  originalPrice?: string;
  href?: string;
  isDragging?: boolean;
}

export default function ProductCard({
  imageSrc,
  imageAlt,
  category,
  productName,
  price,
  originalPrice,
  href = '#',
  isDragging = false,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-lg overflow-hidden flex flex-col transition-shadow duration-300 ease-in-out hover:shadow-lg cursor-pointer"
      style={{ 
        width: '368px', 
        height: '540px',
        pointerEvents: isDragging ? 'none' : 'auto',
      }}
      draggable="false"
      onClick={(e) => {
        if (isDragging) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <div className="relative w-full bg-gray-100 flex-shrink-0" style={{ height: '324px' }}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="mb-2">
          <span className="inline-block bg-white text-black italic px-3 py-1 rounded-full uppercase" style={{ fontSize: '12px', fontWeight: 900, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
            {category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-black mb-2">
          {productName}
        </h3>

        <div className="mb-3 space-y-1">
          {originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              {originalPrice}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {price}
          </p>
        </div>

        <div className="underline text-sm flex items-center justify-between w-full transition-all duration-300 ease-in-out mt-auto" style={{ opacity: 0.95 }}>
          <span className="text-gray-400 transition-colors duration-300 ease-in-out group-hover:text-black group-hover:font-bold">Buy Now</span>
          <svg
            className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

