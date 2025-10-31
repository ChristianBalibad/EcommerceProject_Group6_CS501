'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { label: 'Shoes', href: '/products?category=shoes' },
    { label: 'Tops & Tshirts', href: '/products?category=tops-tshirts' },
    { label: 'Shorts', href: '/products?category=shorts' },
    { label: 'Hoodies & Jackets', href: '/products?category=hoodies-jackets' },
    { label: 'Trousers & Tights', href: '/products?category=trousers-tights' },
    { label: 'Dress', href: '/products?category=dress' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1544px' }}>
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/undefinedfulllogo.png"
              alt="Undefined Logo"
              width={200}
              height={60}
              className="h-auto w-auto object-contain"
              priority
              unoptimized
            />
          </Link>

          <div className="hidden md:flex items-center flex-1 justify-center max-w-2xl ml-12 mr-14">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all hover:border-gray-300 shadow-sm hover:shadow"
              />
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              >
                <path
                  d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/products?offers=up-to-60-off"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                Up to 60% OFF*
                <span className="text-orange-500">🔥</span>
              </Link>
              <Link
                href="/products?filter=new"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                New Arrivals
              </Link>
              <div 
                className="relative" 
                ref={dropdownRef}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  Categories
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="absolute top-full left-0 w-full h-2"></div>
                    <div className="absolute top-full left-0 pt-2 w-48 bg-transparent z-50">
                      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                        {categories.map((category) => (
                          <Link
                            key={category.label}
                            href={category.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {category.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Link
                href="/about"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                About Us
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="User Account"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              <button
                type="button"
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Wishlist"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7564 5.72717 21.351 5.12075 20.84 4.61Z"
                  />
                </svg>
              </button>

              <Link
                href="/cart"
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Shopping Cart"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
                  />
                  <path
                    d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                  />
                  <path
                    d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

