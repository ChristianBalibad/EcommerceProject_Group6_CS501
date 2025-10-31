'use client';

import { useRef, useState, useCallback } from 'react';
import ReviewCard from './ReviewCard';

const reviews = [
  {
    quote: "I was blown away by the quality of my purchase! It looks even better in person, and the customer service was so friendly and helpful. Can't wait to buy more!",
    customerName: "Zessuah Ray",
    descriptor: "Verified Buyer",
    profileImageSrc: '/images/reviews/zessuah-ray.jpg',
    profileImageAlt: 'Zessuah Ray profile picture',
    rating: 5,
  },
  {
    quote: "This brand has become my favorite. Everything I've ordered has been high quality, and shipping is always fast. I love that they genuinely care about their customers.",
    customerName: "Anchor Jave",
    descriptor: "Frequent Shopper",
    profileImageSrc: '/images/reviews/anchor-jave.jpg',
    profileImageAlt: 'Anchor Jave profile picture',
    rating: 5,
  },
  {
    quote: "I tried this brand on a friend's recommendation, and I'm so glad I did. The product is perfect, and the attention to detail really shows. I'll definitely be ordering again!",
    customerName: "Chandy Claire",
    descriptor: "New Customer",
    profileImageSrc: '/images/reviews/chandy-claire.jpg',
    profileImageAlt: 'Chandy Claire profile picture',
    rating: 5,
  },
  {
    quote: "I've been a fan of this brand for a while now, and they never let me down. Every order feels like it's made just for me, and the durability is amazing. Highly recommend!!",
    customerName: "Ivan Keith",
    descriptor: "Returning Customer",
    profileImageSrc: '/images/reviews/ivan-keith.jpg',
    profileImageAlt: 'Ivan Keith profile picture',
    rating: 5,
  },
  {
    quote: "The quality and attention to detail are outstanding. This brand cares about every purchase and it shows in their products. Will definitely be a lifelong customer!",
    customerName: "Zoie Grace",
    descriptor: "Satisfied Customer",
    profileImageSrc: '/images/reviews/zoie-grace.jpg',
    profileImageAlt: 'Zoie Grace profile picture',
    rating: 5,
  },
];

export default function CustomerReviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <section className="w-full bg-gray-100 py-16 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
          Hear from our customers
        </h2>
        
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className={`flex gap-6 overflow-x-auto overflow-y-visible pb-4 scrollbar-hide cursor-grab ${isDragging ? 'cursor-grabbing' : ''} select-none`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                quote={review.quote}
                customerName={review.customerName}
                descriptor={review.descriptor}
                profileImageSrc={review.profileImageSrc}
                profileImageAlt={review.profileImageAlt}
                rating={review.rating}
              />
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-4 w-15 bg-gradient-to-r from-gray-100 to-transparent pointer-events-none z-20"></div>
          <div className="absolute right-0 top-0 bottom-4 w-15 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none z-20"></div>
        </div>
      </div>
    </section>
  );
}

