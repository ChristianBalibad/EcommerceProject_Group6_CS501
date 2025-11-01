'use client';

import Image from 'next/image';
import Link from 'next/link';

interface HorizontalCardProps {
  headline: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  href?: string;
}

export default function HorizontalCard({
  headline,
  description,
  buttonText,
  imageSrc,
  imageAlt,
  imagePosition = 'right',
  href = '#'
}: HorizontalCardProps) {
  const isImageLeft = imagePosition === 'left';

  const imageSection = (
    <div className="relative w-full md:w-1/2 h-[400px] md:h-[700px] bg-gray-100 flex-shrink-0">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  );

  const textSection = (
    <div className="flex flex-col justify-center w-full md:w-1/2 p-6 md:p-8 lg:p-12">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
        {headline}
      </h2>
      <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      <Link
        href={href}
        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center w-fit"
      >
        {buttonText}
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full">
      {isImageLeft && imageSection}
      {textSection}
      {!isImageLeft && imageSection}
    </div>
  );
}

