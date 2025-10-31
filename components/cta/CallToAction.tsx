'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CallToAction() {
  return (
    <section className="w-full relative py-8 md:py-12 -my-23 md:-my-43 z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <div className="relative rounded-3xl overflow-visible bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-8 md:px-12 lg:px-16 py-6 md:py-8" style={{ height: '202px', minHeight: '202px' }}>
          <div className="flex flex-row items-center justify-between h-full relative z-10 gap-6 md:gap-8">
            <div className="flex flex-col items-start text-left flex-shrink-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 leading-tight">
                Download Now
              </h2>
              <p className="text-sm md:text-base text-gray-100 leading-relaxed">
                See why so many people enjoy our app
              </p>
            </div>

            <div className="flex flex-row items-center gap-4 md:gap-6 flex-shrink-0">
              <div className="relative mt-20" style={{ transform: 'perspective(1000px) rotateY(-15deg) rotateX(8deg)', transformStyle: 'preserve-3d' }}>
                <div className="relative" style={{ width: '400px', height: '400px' }}>
                  <Image
                    src="/images/ctaphone.png"
                    alt="Smartphone with shopping app"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>

              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white text-xs md:text-sm font-medium">
                  5/5 • 361 REVIEWS
                </p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-2 bg-black text-white rounded-lg font-medium transition-colors hover:bg-gray-900 text-sm"
                >
                  Download
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

