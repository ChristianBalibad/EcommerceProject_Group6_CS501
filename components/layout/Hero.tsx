'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col items-start text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
              Where Style
              <br />
              Meets Substance
            </h1>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 max-w-lg">
              Discover bold, modern apparel that elevates your everyday. From timeless classics to the latest trends, our collection is designed for those who dare to stand out. Explore our range and find pieces that speak to your unique style.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-black text-white rounded-lg font-medium transition-colors hover:bg-gray-800"
            >
              Shop Now
            </Link>
          </div>

          <div className="relative w-full h-[480px] md:h-[550px] lg:h-[580px]">
            <div className="absolute top-0 left-3 w-60 h-80 rounded-t-[10%] rounded-b-[10%] overflow-hidden z-10 shadow-lg">
              <Image
                src="/images/herosection/hero-2.png"
                alt="Female model with coffee"
                fill
                className="object-cover grayscale"
                priority
                unoptimized
              />
            </div>
            
            <div className="absolute left-70 right-1 top-30 w-74 h-[380px] rounded-t-[20%] rounded-b-[20%] overflow-hidden z-20 shadow-lg">
              <Image
                src="/images/herosection/hero-1.png"
                alt="Male model in white button-up shirt"
                fill
                className="object-cover grayscale"
                unoptimized
              />
            </div>
            
            <div className="absolute top-85 bottom-0 left-3 w-60 h-90 rounded-b-[20%] overflow-hidden z-30 shadow-lg">
              <Image
                src="/images/herosection/hero-3.png"
                alt="Male model in leather jacket"
                fill
                className="object-cover grayscale"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

