'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItemProps {
  id: number;
  imageSrc: string;
  imageAlt: string;
  productName: string;
  category: string;
  price: string;
  originalPrice?: string;
  size?: string;
  quantity: number;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  href?: string;
}

export default function CartItem({
  id,
  imageSrc,
  imageAlt,
  productName,
  category,
  price,
  originalPrice,
  size,
  quantity,
  onQuantityChange,
  onRemove,
  href = '#',
}: CartItemProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const parsePrice = (priceString: string): number => {
    return parseFloat(priceString.replace('₱', '').replace(',', ''));
  };

  const itemTotal = parsePrice(price) * quantity;

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      <Link href={href} className="flex-shrink-0">
        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <Link href={href}>
              <h3 className="text-lg font-bold text-black mb-1 hover:text-gray-600 transition-colors">
                {productName}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mb-2">
              {category && (
                <span className="inline-block bg-white text-black italic px-2 py-0.5 rounded-full text-xs font-bold" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
                  {category}
                </span>
              )}
              {size && (
                <span className="text-sm text-gray-500">
                  Size: {size}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {originalPrice}
                </span>
              )}
              <span className="text-base text-gray-500">
                {price}
              </span>
            </div>
          </div>

          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Remove item"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6L18 18" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg">
            <button
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12H19" />
              </svg>
            </button>
            <span className="text-base font-semibold text-black min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Increase quantity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5V19M5 12H19" />
              </svg>
            </button>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-black">
              ₱{itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

