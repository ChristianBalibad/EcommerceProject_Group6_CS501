'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FlyingImageProps {
  imageSrc: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onComplete: () => void;
}

export default function FlyingImage({ imageSrc, startPosition, endPosition, onComplete }: FlyingImageProps) {
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsFlying(true), 10);
    const timer = setTimeout(() => {
      onComplete();
    }, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: `${startPosition.x}px`,
        top: `${startPosition.y}px`,
        transform: isFlying
          ? `translate(${endPosition.x - startPosition.x}px, ${endPosition.y - startPosition.y}px) scale(0.2)`
          : 'translate(0, 0) scale(1)',
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: isFlying ? 0.8 : 1,
      }}
    >
      <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-2xl">
        <Image
          src={imageSrc}
          alt="Flying product"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    </div>
  );
}

