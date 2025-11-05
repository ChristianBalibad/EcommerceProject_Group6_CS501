'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface SearchSuggestion {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  images: string;
}

const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase() 
      ? <strong key={index} className="font-bold text-black">{part}</strong>
      : part
  );
};

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { itemCount, triggerAnimation } = useCart();

  useEffect(() => {
    if (triggerAnimation) {
      queueMicrotask(() => {
        setAnimateCart(true);
        setTimeout(() => setAnimateCart(false), 600);
      });
    }
  }, [triggerAnimation]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchSuggestions([]);
        setIsSearchOpen(false);
        return;
      }

      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchSuggestions((data.products || []).slice(0, 5));
          setIsSearchOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <div ref={searchRef} className="relative w-full">
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setIsSearchOpen(false);
                    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  } else if (e.key === 'Escape') {
                    setIsSearchOpen(false);
                  }
                }}
                onFocus={() => {
                  if (searchSuggestions.length > 0) {
                    setIsSearchOpen(true);
                  }
                }}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all hover:border-gray-300 shadow-sm hover:shadow"
              />
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    setIsSearchOpen(false);
                    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isSearchOpen && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                  {searchSuggestions.map((product) => {
                    let mainImage = '';
                    try {
                      const imagesArray = JSON.parse(product.images || '[]');
                      if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                        const firstImage = imagesArray[0];
                        mainImage = typeof firstImage === 'string' ? firstImage : (firstImage as { url?: string })?.url || '';
                      }
                    } catch {
                      mainImage = '';
                    }

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {mainImage && (
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                            <Image
                              src={mainImage}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {highlightMatch(product.name, searchQuery)}
                          </p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">₱{product.price.toLocaleString('en-US')}</p>
                      </Link>
                    );
                  })}
                  {searchQuery.trim().length >= 2 && (
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="w-full p-3 text-sm text-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo;
                    </button>
                  )}
                </div>
              )}
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
                href="/products?arrivals=new"
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
              <Link
                href="/cart"
                className="relative p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
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
                  className={animateCart ? 'animate-bounce' : ''}
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
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <div 
                className="relative" 
                ref={accountMenuRef}
                onMouseEnter={() => setIsAccountMenuOpen(true)}
                onMouseLeave={() => setIsAccountMenuOpen(false)}
              >
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

                {isAccountMenuOpen && (
                  <div className="absolute top-full right-0 pt-1 w-48 z-50">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm font-semibold text-black">{user.username}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                          </div>
                          <Link
                            href="/account"
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            My Account
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Logout
                          </button>
                        </>
                        ) : (
                          <>
                            <Link
                              href="/account?mode=login"
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/account?mode=signup"
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Create Account
                            </Link>
                          </>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

