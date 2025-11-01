'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DownloadPage() {
  useEffect(() => {
    document.title = 'Download App | Undefined';
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '800px' }}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="mb-8">
            
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Undefined Mobile App
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Tagae kog budget miss, btaw jk hahaha. E exempted nami miss huhu, pleaseee huhuhu.
            </p>
          </div>

          <div className="relative w-full h-[400px] mb-8">
            <Image
              src="/images/ctaphone.png"
              alt="Undefined Mobile App Preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">App Store</span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Google Play</span>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

