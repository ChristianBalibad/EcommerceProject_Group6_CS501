'use client';

import Image from 'next/image';
import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
}

export default function FeatureCard({ 
  title, 
  imageSrc, 
  imageAlt, 
  href = '#' 
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg flex flex-col" style={{ width: '245px', height: '373px' }}>
      <div className="relative w-full h-[230px] bg-gray-50 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      
      <div className="p-4 text-center flex flex-col flex-1 justify-between" style={{ minHeight: '143px' }}>
        <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          maxHeight: '56px'
        }}>
          {title}
        </h3>
        <Link
          href={href}
          className="text-gray-700 underline hover:text-gray-900 transition-colors flex-shrink-0"
        >
          More Details
        </Link>
      </div>
    </div>
  );
}

