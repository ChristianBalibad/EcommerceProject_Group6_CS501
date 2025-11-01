'use client';

import { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  paymentMethod: 'cod' | 'card' | 'gcash';
  shippingMethod: 'standard' | 'express';
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  
  const fromProduct = searchParams.get('from') === 'product';
  const productSlug = searchParams.get('slug');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    paymentMethod: 'cod',
    shippingMethod: 'standard',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Checkout | Undefined';
    startTransition(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      window.location.href = '/account';
    }
  }, [isAuthenticated, isMounted]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^09\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format (09XXXXXXXXX)';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.province.trim()) newErrors.province = 'Province is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{4}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      setOrderSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateDiscount = (): number => {
    return cartItems.reduce((total, item) => {
      if (item.price) {
        const original = item.price;
        const current = item.price;
        return total + (original - current) * item.quantity;
      }
      return total;
    }, 0);
  };

  const getShippingCost = (): number => {
    return formData.shippingMethod === 'express' ? 150 : 0;
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const shipping = getShippingCost();
  const total = subtotal - discount + shipping;

  if (!isMounted || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1520px' }}>
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-600"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-black mb-4">Order Placed Successfully!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your order. Exempted nani miss please huhu... 😭.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="inline-block bg-white text-black px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-semibold"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1520px' }}>
        <div className="mb-8">
          <Link
            href={fromProduct && productSlug ? `/products/${productSlug}` : '/cart'}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19L5 12L12 5" />
            </svg>
            {fromProduct ? 'Back to Product' : 'Back to Cart'}
          </Link>
          <h1 className="text-3xl font-bold text-black mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-black mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Christian"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Balibad"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="christian.balibad@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="09123456789"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                      errors.address ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Pakpakan Rd. Brgy. Basak, Lapu-Lapu City"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                        errors.city ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Lapu-Lapu City"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="province"
                      value={formData.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                        errors.province ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Cebu"
                    />
                    {errors.province && (
                      <p className="text-red-500 text-xs mt-1">{errors.province}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="6000"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-black mb-6">Shipping Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-gray-200"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-black">Standard Shipping</div>
                      <div className="text-sm text-gray-600">Free - 5-7 business days</div>
                    </div>
                    <div className="font-semibold text-black">Free</div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-gray-200"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-black">Express Shipping</div>
                      <div className="text-sm text-gray-600">2-3 business days</div>
                    </div>
                    <div className="font-semibold text-black">₱150</div>
                  </label>
                </div>
              </section>

              <section className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-black mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-gray-200"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-black">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when you receive</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-gray-200"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-black">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, etc.</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gcash"
                      checked={formData.paymentMethod === 'gcash'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-gray-200"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-black">GCash</div>
                      <div className="text-sm text-gray-600">Mobile wallet payment</div>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto scrollbar-hide">
                  {cartItems.map((item) => {
                    const itemTotal = item.price * item.quantity;
                    return (
                      <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-0">
                        <div className="relative w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-black mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            {item.size && `Size: ${item.size} • `}Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-black">
                            ₱{itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-black font-semibold">
                      ₱{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -₱{discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-black font-semibold">
                      {shipping === 0 ? 'Free' : `₱${shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-black">Total</span>
                      <span className="text-xl font-bold text-black">
                        ₱{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full bg-black text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-semibold mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

