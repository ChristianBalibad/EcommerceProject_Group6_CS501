'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import YouMightAlsoLike from '@/components/product/YouMightAlsoLike';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import FlyingImage from '@/components/ui/FlyingImage';

const productsData = [
  {
    slug: 'versatile-long-sleeve',
    name: 'Versatile Long sleeve',
    category: 'TOPS & TSHIRTS',
    price: '₱299',
    originalPrice: null,
    description: 'A comfortable and versatile long sleeve shirt perfect for everyday wear. Made with premium quality fabric that ensures durability and comfort throughout the day.',
    images: [
      '/images/products/versatile-long-sleeve.jpg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Navy', value: '#1E3A5F' },
      { name: 'Gray', value: '#808080' },
    ],
    inStock: true,
    stockCount: 15,
  },
  {
    slug: 'aloha-spirit-polo',
    name: 'Aloha Spirit Polo',
    category: 'TOPS & TSHIRTS',
    price: '₱599',
    originalPrice: '₱799',
    description: 'Embrace the island vibes with our Aloha Spirit Polo. This classic polo shirt combines comfort with style, featuring a relaxed fit and breathable fabric perfect for warm weather.',
    images: [
      '/images/products/aloha-spirit-polo.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blue', value: '#1E90FF' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Navy', value: '#1E3A5F' },
    ],
    inStock: true,
    stockCount: 8,
  },
  {
    slug: 'lush-leaf-print',
    name: 'Lush Leaf Print',
    category: 'TOPS & TSHIRTS',
    price: '₱500',
    originalPrice: null,
    description: 'Make a statement with our Lush Leaf Print shirt. This unique design features vibrant botanical patterns that add a fresh and modern touch to your wardrobe.',
    images: [
      '/images/products/lush-leaf-print.jpg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Green', value: '#228B22' },
      { name: 'White', value: '#FFFFFF' },
    ],
    inStock: true,
    stockCount: 12,
  },
  {
    slug: 'classic-grey-sneakers',
    name: 'Classic Grey Sneakers',
    category: 'SHOES',
    price: '₱899',
    originalPrice: null,
    description: 'Timeless style meets comfort in our Classic Grey Sneakers. Built with premium materials and cushioned insoles for all-day comfort, these sneakers are perfect for any occasion.',
    images: [
      '/images/products/sneakers-grey-cream.jpg',
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Grey', value: '#808080' },
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
    ],
    inStock: true,
    stockCount: 20,
  },
  {
    slug: 'urban-runner',
    name: 'Urban Runner',
    category: 'SHOES',
    price: '₱999',
    originalPrice: null,
    description: 'Designed for the modern urban lifestyle, the Urban Runner combines sleek aesthetics with superior performance. Perfect for running or casual wear.',
    images: [
      '/images/products/sneakers-grey-white-blue.jpg',
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'Grey Blue', value: '#4682B4' },
      { name: 'Black', value: '#000000' },
    ],
    inStock: true,
    stockCount: 18,
  },
  {
    slug: 'brown-two-piece-set',
    name: 'Brown Two-Piece Set',
    category: 'DRESS',
    price: '₱1299',
    originalPrice: '₱1599',
    description: 'Elegant and sophisticated, this brown two-piece set offers a perfect blend of style and comfort. Ideal for various occasions, from casual outings to semi-formal events.',
    images: [
      '/images/products/women-outfit-brown.jpg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Brown', value: '#8B4513' },
      { name: 'Beige', value: '#F5F5DC' },
      { name: 'Navy', value: '#1E3A5F' },
    ],
    inStock: true,
    stockCount: 10,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [flyingImage, setFlyingImage] = useState<{
    src: string;
    startPos: { x: number; y: number };
    endPos: { x: number; y: number };
  } | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-white py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1520px' }}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Product Not Found</h1>
            <Link href="/products" className="text-gray-600 hover:text-gray-900 underline">
              Return to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/account');
      return;
    }
    if (!selectedSize || !selectedColor) {
      alert('Please select a size and color');
      return;
    }
    
    if (imageRef.current) {
      const imageRect = imageRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector('[aria-label="Shopping Cart"]');
      
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        
        setFlyingImage({
          src: product.images[selectedImage],
          startPos: {
            x: imageRect.left + imageRect.width / 2 - 64,
            y: imageRect.top + imageRect.height / 2 - 64,
          },
          endPos: {
            x: cartRect.left + cartRect.width / 2 - 64,
            y: cartRect.top + cartRect.height / 2 - 64,
          },
        });
      }
    }
    
    const priceValue = parseFloat(product.price.replace('₱', '').replace(',', ''));
    addToCart({
      id: product.slug.charCodeAt(0),
      name: product.name,
      price: priceValue,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      image: product.images[0],
    });
    
    setTimeout(() => {
      showToast(`Added ${quantity} ${product.name} to cart!`);
    }, 400);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push('/account');
      return;
    }
    if (!selectedSize || !selectedColor) {
      alert('Please select a size and color');
      return;
    }
    router.push('/checkout');
  };

  return (
    <>
      {flyingImage && (
        <FlyingImage
          imageSrc={flyingImage.src}
          startPosition={flyingImage.startPos}
          endPosition={flyingImage.endPos}
          onComplete={() => setFlyingImage(null)}
        />
      )}
      <main className="min-h-screen bg-white py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1520px' }}>
        <div className="mb-4">
          <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Products
          </Link>
        </div>

        <div className="flex gap-12">
          <div className="flex-1">
            <div ref={imageRef} className="relative w-full bg-gray-100 rounded-lg overflow-hidden mb-4" style={{ height: '600px' }}>
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-gray-900' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 max-w-lg">
            <div className="mb-4">
              <span className="inline-block bg-white text-black italic px-3 py-1 rounded-full text-xs font-bold shadow-md">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-black mb-4">{product.name}</h1>

            <div className="mb-6 space-y-2">
              {product.originalPrice && (
                <p className="text-lg text-gray-400 line-through">{product.originalPrice}</p>
              )}
              <p className="text-2xl font-bold text-black">{product.price}</p>
              {product.inStock && (
                <p className="text-sm text-gray-600">
                  {product.stockCount} in stock
                </p>
              )}
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 border-2 rounded-lg text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-white text-black hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`px-5 py-2.5 border-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedColor === color.name
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-white text-black hover:border-gray-400'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border ${
                          selectedColor === color.name
                            ? 'border-white'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 8H12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold text-black w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 4V12M4 8H12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 active:bg-gray-900 transition-all duration-200"
              >
                {isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-white text-black border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
              >
                {isAuthenticated ? 'Buy Now' : 'Login to Buy Now'}
              </button>
            </div>

            {!product.inStock && (
              <p className="mt-4 text-sm text-red-600 text-center">
                This product is currently out of stock
              </p>
            )}
          </div>
        </div>

        <YouMightAlsoLike
          currentProductSlug={product.slug}
          products={productsData.map((p) => ({
            slug: p.slug,
            name: p.name,
            category: p.category,
            price: p.price,
            originalPrice: p.originalPrice,
            imageSrc: p.images[0],
          }))}
        />
        </div>
      </main>
    </>
  );
}
