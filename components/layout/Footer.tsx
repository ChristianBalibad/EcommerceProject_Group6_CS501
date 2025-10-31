'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1348px' }}>
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/undefinedfulllogowhite.png"
                alt="Undefined Logo"
                width={200}
                height={60}
                className="h-auto w-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            <p className="text-gray-400 text-sm text-center">
              @2020 - 2025 Undefined Inc.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <span className="text-white font-bold text-lg">f</span>
              </Link>
              
              <Link
                href="#"
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Twitter/X"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              
              <Link
                href="#"
                className="w-10 h-10 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center hover:opacity-80 transition-opacity relative"
                aria-label="Instagram"
              >
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-white mb-4">Customer Service</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Order Tracking
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Shipping & Delivery
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Returns & Exchanges
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white mb-4">Shop</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/products?filter=new" className="text-gray-400 hover:text-white transition-colors text-sm">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Gift Cards
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Size Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Sale
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Sustainability
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Affiliate Program
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Press
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-white mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Accessibility
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Legal Notice
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
