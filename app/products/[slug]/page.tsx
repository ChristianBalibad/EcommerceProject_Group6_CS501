'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import YouMightAlsoLike from '@/components/product/YouMightAlsoLike';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import FlyingImage from '@/components/ui/FlyingImage';

interface ImageWithColors {
  url: string;
  colors: string[];
}

interface ProductData {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  originalPrice: string | null;
  description: string;
  images: string[];
  imagesData: ImageWithColors[];
  sizes: string[];
  colors: Array<{ name: string; value: string }>;
  inStock: boolean;
  stockCount: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (product && typeof document !== 'undefined') {
      document.title = `${product.name} | Undefined`;
    }
  }, [product]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, allProductsResponse] = await Promise.all([
          fetch(`/api/products/${slug}`),
          fetch('/api/products')
        ]);

        if (productResponse.ok) {
          const data = await productResponse.json();
          const productData = data.product;
          
          const sizesArray = productData.sizes ? productData.sizes.split(',').map((s: string) => s.trim()) : [];
          let colorsArray = [];
          try {
            colorsArray = JSON.parse(productData.colors || '[]');
          } catch {
            colorsArray = [];
          }
          
          let imagesData = [];
          try {
            imagesData = JSON.parse(productData.images || '[]');
          } catch {
            imagesData = [];
          }
          
          const processedImages = imagesData.map((img: string | ImageWithColors) => {
            if (typeof img === 'string') {
              return { url: img, colors: [] };
            }
            return img;
          });
          
          setProduct({
            id: productData.id,
            slug: productData.slug,
            name: productData.name,
            category: productData.category,
            description: productData.description,
            price: `₱${productData.price.toLocaleString('en-US')}`,
            originalPrice: productData.originalPrice ? `₱${productData.originalPrice.toLocaleString('en-US')}` : null,
            imagesData: processedImages,
            images: processedImages.map((img: ImageWithColors) => img.url),
            sizes: sizesArray,
            colors: colorsArray,
            inStock: productData.stock > 0,
            stockCount: productData.stock,
          });
        }

        if (allProductsResponse.ok) {
          const productsData = await allProductsResponse.json();
          setAllProducts(productsData.products || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const displayImages = useMemo(() => {
    if (!product) return [];
    
    if (!selectedColor || !product.imagesData) {
      return product.images || [];
    }

    const filtered = product.imagesData.filter((img) => 
      img.colors.some(c => c.toLowerCase() === selectedColor.toLowerCase())
    );

    return filtered.length > 0 ? filtered.map(img => img.url) : product.images;
  }, [product, selectedColor]);

  const randomizedProducts = useMemo(() => {
    if (!product) return [];
    
    const processedProducts = allProducts.filter((p) => p.slug !== product.slug).map((p) => {
      let mainImage = '';
      
      if (Array.isArray(p.images)) {
        mainImage = p.images[0] || '';
      } else if (typeof p.images === 'string') {
        try {
          const imagesArray = JSON.parse(p.images || '[]');
          if (Array.isArray(imagesArray) && imagesArray.length > 0) {
            const firstImage = imagesArray[0];
            mainImage = typeof firstImage === 'string' ? firstImage : (firstImage as { url?: string })?.url || '';
          }
        } catch {
          mainImage = '';
        }
      }
      
      const priceNum = typeof p.price === 'number' ? p.price : parseFloat(String(p.price).replace('₱', '').replace(',', ''));
      const originalPriceNum = p.originalPrice ? (typeof p.originalPrice === 'number' ? p.originalPrice : parseFloat(String(p.originalPrice).replace('₱', '').replace(',', ''))) : null;
      
      return {
        slug: p.slug,
        name: p.name,
        category: p.category,
        price: `₱${priceNum.toLocaleString('en-US')}`,
        originalPrice: originalPriceNum ? `₱${originalPriceNum.toLocaleString('en-US')}` : null,
        imageSrc: mainImage,
      };
    }).filter((p) => p.imageSrc);
    
    const sameCategory = processedProducts.filter((p) => p.category === product.category).sort(() => Math.random() - 0.5);
    const otherProducts = processedProducts.filter((p) => p.category !== product.category).sort(() => Math.random() - 0.5);
    
    return [...sameCategory, ...otherProducts].slice(0, 20);
  }, [allProducts, product]);

  useEffect(() => {
    if (product && selectedImage >= displayImages.length && displayImages.length > 0) {
      setSelectedImage(0);
    }
  }, [displayImages.length, selectedImage, product]);

  useEffect(() => {
    if (displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => {
        const next = prev + 1;
        return next >= displayImages.length ? 0 : next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [displayImages.length]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1520px' }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

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
      router.push(`/account?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!selectedSize) {
      showToast('Please select a size');
      return;
    }
    
    if (product.colors.length > 0 && !selectedColor) {
      showToast('Please select a color');
      return;
    }
    
    const currentImage = displayImages[0] || product.images[0];
    
    if (imageRef.current) {
      const imageRect = imageRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector('[aria-label="Shopping Cart"]');
      
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        
        setFlyingImage({
          src: currentImage,
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
    const cartId = product.id * 1000 + (selectedColor ? selectedColor.charCodeAt(0) : 0) + (selectedSize ? selectedSize.charCodeAt(0) : 0);
    
    addToCart({
      id: cartId,
      name: product.name,
      price: priceValue,
      size: selectedSize,
      color: selectedColor || 'Default',
      quantity: quantity,
      image: currentImage,
    });
    
    setTimeout(() => {
      showToast(`Added ${quantity} ${product.name} to cart!`);
    }, 400);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push(`/account?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!selectedSize) {
      showToast('Please select a size');
      return;
    }
    
    if (product.colors.length > 0 && !selectedColor) {
      showToast('Please select a color');
      return;
    }

    const currentImage = displayImages[0] || product.images[0];
    const cartId = product.id * 1000 + (selectedColor ? selectedColor.charCodeAt(0) : 0) + (selectedSize ? selectedSize.charCodeAt(0) : 0);

    addToCart({
      id: cartId,
      name: product.name,
      price: parseFloat(product.price.replace('₱', '').replace(',', '')),
      size: selectedSize,
      color: selectedColor || 'Default',
      quantity: quantity,
      image: currentImage,
    });

    router.push(`/checkout?from=product&slug=${slug}`);
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

        <div className="flex gap-12 justify-center">
          <div className="w-[650px] flex-shrink-0">
            <div ref={imageRef} className="relative w-full bg-gray-100 rounded-lg overflow-hidden mb-4" style={{ height: '850px'}}>
              {displayImages[selectedImage] && (
                <Image
                  src={displayImages[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {displayImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
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
              <span className="inline-block bg-white text-black italic px-3 py-1 rounded-full text-xs font-bold shadow-md uppercase">
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
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
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

              {product.colors && product.colors.length > 0 && !(product.colors.length === 1 && product.colors[0].name === 'Default') && (
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color: { name: string; value: string }) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          if (selectedColor === color.name) {
                            setSelectedColor(null);
                          } else {
                            setSelectedColor(color.name);
                          }
                          setSelectedImage(0);
                        }}
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
              )}

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

        {randomizedProducts.length > 0 && product && (
          <YouMightAlsoLike
            currentProductSlug={product.slug}
            products={randomizedProducts}
          />
        )}
        </div>
      </main>
    </>
  );
}
