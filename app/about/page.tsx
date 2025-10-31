export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              About Us
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                Welcome to our store, where fashion meets functionality. We are passionate about providing you with the latest trends in apparel and footwear that not only look great but feel comfortable too.
              </p>

              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                Our journey began with a simple mission: to make quality fashion accessible to everyone. From stylish shoes that keep you moving to comfortable apparel that fits your lifestyle, we curate collections that reflect your personal style and daily needs.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-4">
                Our Mission
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                We believe that everyone deserves to look and feel their best. That's why we handpick every item in our collection, ensuring quality craftsmanship, contemporary designs, and affordable prices. Whether you're looking for casual wear, athletic gear, or something special, we've got you covered.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-4">
                What We Offer
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">
                Our carefully curated selection includes:
              </p>
              <ul className="list-none space-y-3 mb-6">
                <li className="flex items-start text-base text-gray-700">
                  <span className="text-black mr-2">•</span>
                  <span>Premium footwear for every occasion</span>
                </li>
                <li className="flex items-start text-base text-gray-700">
                  <span className="text-black mr-2">•</span>
                  <span>Trendy tops and t-shirts for everyday wear</span>
                </li>
                <li className="flex items-start text-base text-gray-700">
                  <span className="text-black mr-2">•</span>
                  <span>Comfortable shorts and activewear</span>
                </li>
                <li className="flex items-start text-base text-gray-700">
                  <span className="text-black mr-2">•</span>
                  <span>Stylish hoodies and jackets</span>
                </li>
                <li className="flex items-start text-base text-gray-700">
                  <span className="text-black mr-2">•</span>
                  <span>Versatile trousers and tights</span>
                </li>
                <li className="flex items-start text-base text-gray-700">
                  <span className="text-black mr-2">•</span>
                  <span>Elegant dresses for special moments</span>
                </li>
              </ul>

              <h2 className="text-2xl md:text-3xl font-bold text-black mt-8 mb-4">
                Our Commitment
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                We are committed to providing exceptional customer service, fast shipping, and easy returns. Your satisfaction is our top priority, and we're always here to help you find exactly what you're looking for.
              </p>

              <p className="text-base md:text-lg text-gray-700 leading-relaxed mt-8">
                Thank you for choosing us for your fashion needs. We're excited to be part of your style journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

