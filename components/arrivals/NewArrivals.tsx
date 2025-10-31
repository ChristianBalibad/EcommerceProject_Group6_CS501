'use client';

import HorizontalCard from '../card/HorizontalCard';

const newArrivals = [
  {
    headline: "Undefined C1TY 'Brownstone'",
    description: "Undefined C1TY is engineered to overcome anything the city throws your way. A mesh upper keeps the fit breathable, while the reinforced sides and toe box help protect your feet from the elements. This 'Brownstone' edition pulls colour inspiration from iconic architectural design—giving street style a whole new meaning.",
    buttonText: 'Buy Now',
    imageSrc: '/images/products/undefined-city-brownstone.jpg',
    imageAlt: "Undefined C1TY 'Brownstone' shoe",
    href: '/products/undefined-city-brownstone',
    imagePosition: 'right' as const,
  },
  {
    headline: 'Undefined Lunar Roam',
    description: 'Punch up your lifestyle look with a dash of bouncy Lunar performance. Breezy, lightweight materials are paired with an ultra-plush midsole for laid-back comfort—wherever you wander.',
    buttonText: 'Buy Now',
    imageSrc: '/images/products/undefined-lunar-roam.jpg',
    imageAlt: 'Undefined Lunar Roam shoe',
    href: '/products/undefined-lunar-roam',
    imagePosition: 'left' as const,
  },
];

export default function NewArrivals() {
  return (
    <section className="w-full bg-white pt-8 md:pt-12 pb-16 md:pb-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
          New Arrivals
        </h2>
        
        <div className="flex flex-col gap-8">
          {newArrivals.map((product, index) => (
            <HorizontalCard
              key={index}
              headline={product.headline}
              description={product.description}
              buttonText={product.buttonText}
              imageSrc={product.imageSrc}
              imageAlt={product.imageAlt}
              imagePosition={product.imagePosition}
              href={product.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

