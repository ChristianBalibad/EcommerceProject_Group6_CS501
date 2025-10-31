'use client';

import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 text-center">
              About Us
            </h1>
          </div>

          <div className="mb-16 md:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                  Welcome to Our Store
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                  Where fashion meets functionality. We are passionate about providing you with the latest trends in apparel and footwear that not only look great but feel comfortable too.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Our journey began with a simple mission: to make quality fashion accessible to everyone. From stylish shoes that keep you moving to comfortable apparel that fits your lifestyle, we curate collections that reflect your personal style and daily needs.
                </p>
              </div>
              <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg order-1 lg:order-2">
                <Image
                  src="/images/herosection/hero-1.png"
                  alt="Fashion model showcasing our collection"
                  fill
                  className="object-cover grayscale"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="mb-16 md:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/herosection/hero-2.png"
                  alt="Our mission in action"
                  fill
                  className="object-cover grayscale"
                  unoptimized
                />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                  Our Mission
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  We believe that everyone deserves to look and feel their best. That's why we handpick every item in our collection, ensuring quality craftsmanship, contemporary designs, and affordable prices. Whether you're looking for casual wear, athletic gear, or something special, we've got you covered.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center">
              What We Offer
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-2xl mx-auto">
              Our carefully curated selection includes everything you need to express your unique style.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-black mb-2">Premium Footwear</div>
                <p className="text-sm text-gray-600">For every occasion</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-black mb-2">Tops & T-Shirts</div>
                <p className="text-sm text-gray-600">Everyday comfort</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-black mb-2">Shorts</div>
                <p className="text-sm text-gray-600">Active lifestyle</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-black mb-2">Hoodies & Jackets</div>
                <p className="text-sm text-gray-600">Stylish warmth</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-black mb-2">Trousers & Tights</div>
                <p className="text-sm text-gray-600">Versatile wear</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-black mb-2">Dresses</div>
                <p className="text-sm text-gray-600">Elegant moments</p>
              </div>
            </div>
            <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/herosection/hero-3.png"
                alt="Our complete collection"
                fill
                className="object-cover grayscale"
                unoptimized
              />
            </div>
          </div>

          <div className="mb-12">
            <div className="bg-gray-50 rounded-lg p-8 md:p-12 border border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 text-center">
                Our Commitment
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                We are committed to providing exceptional customer service, fast shipping, and easy returns. Your satisfaction is our top priority, and we're always here to help you find exactly what you're looking for.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Thank you for choosing us for your fashion needs. We're excited to be part of your style journey.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

