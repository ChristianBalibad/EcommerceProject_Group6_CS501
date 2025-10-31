'use client';

import Image from 'next/image';

interface ReviewCardProps {
  quote: string;
  customerName: string;
  descriptor: string;
  profileImageSrc: string;
  profileImageAlt: string;
  rating?: number;
}

export default function ReviewCard({
  quote,
  customerName,
  descriptor,
  profileImageSrc,
  profileImageAlt,
  rating = 5
}: ReviewCardProps) {
  return (
    <div className="relative flex flex-col items-center flex-shrink-0" style={{ width: '285px', height: '397px' }}>
      <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden -mb-18 z-10 flex-shrink-0 bg-gray-200 border-gray-300">
        <Image
          src={profileImageSrc}
          alt={profileImageAlt}
          fill
          className="object-cover"
          unoptimized
          draggable={false}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md flex flex-col items-center text-center flex-1 w-full pt-20 px-6 pb-6 md:px-8 md:pb-8">
        <blockquote className="text-sm md:text-base text-gray-700 italic mb-4 leading-relaxed flex-1">
          &quot;{quote}&quot;
        </blockquote>
        
        <div className="flex items-center justify-center gap-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        
        <div className="flex flex-col">
          <p className="text-base md:text-lg font-bold text-gray-800 mb-1">
            {customerName}
          </p>
          <p className="text-sm md:text-base text-gray-600">
            {descriptor}
          </p>
        </div>
      </div>
    </div>
  );
}

