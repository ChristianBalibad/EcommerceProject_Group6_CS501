'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  description: string;
  imageUrl: string;
  stock: string;
  sizes: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    description: '',
    imageUrl: '',
    stock: '',
    sizes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/account');
      return;
    }
    if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    router.push('/account');
    setTimeout(() => logout(), 100);
  };

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    if (field === 'category') {
      setFormData((prev) => ({ ...prev, [field]: value, sizes: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (formData.originalPrice.trim() && (isNaN(Number(formData.originalPrice)) || Number(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = 'Please enter a valid original price';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const productData = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice.trim() ? Number(formData.originalPrice) : null,
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      stock: Number(formData.stock),
      sizes: formData.sizes.trim() ? formData.sizes.split(',').map(s => s.trim()) : [],
    };

    console.log('Product data ready for backend:', productData);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        category: '',
        price: '',
        originalPrice: '',
        description: '',
        imageUrl: '',
        stock: '',
        sizes: '',
      });
      setErrors({});
    }, 1000);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-6 py-4" style={{ maxWidth: '1200px' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Product Management</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto px-6 py-8" style={{ maxWidth: '1200px' }}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black mb-1">Add New Product</h2>
          <p className="text-sm text-gray-600">Fill in the product details below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm font-medium">Product added successfully!</p>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Classic White T-Shirt"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-black focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                  errors.category ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select a category</option>
                <option value="shoes">Shoes</option>
                <option value="tops-tshirts">Tops & Tshirts</option>
                <option value="shorts">Shorts</option>
                <option value="hoodies-jackets">Hoodies & Jackets</option>
                <option value="trousers-tights">Trousers & Tights</option>
                <option value="dress">Dress</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                  <input
                    type="text"
                    id="price"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        handleInputChange('price', value);
                      }
                    }}
                    className={`w-full pl-8 pr-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                      errors.price ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="299"
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                  <input
                    type="text"
                    id="originalPrice"
                    value={formData.originalPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        handleInputChange('originalPrice', value);
                      }
                    }}
                    className={`w-full pl-8 pr-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                      errors.originalPrice ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="399"
                  />
                </div>
                {errors.originalPrice && <p className="text-red-500 text-xs mt-1">{errors.originalPrice}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="A comfortable and stylish white t-shirt made from premium cotton..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                  errors.imageUrl ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="/images/products/product-name.jpg"
              />
              {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="stock"
                value={formData.stock}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    handleInputChange('stock', value);
                  }
                }}
                className={`w-full px-4 py-2.5 border rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all ${
                  errors.stock ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="100"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes
              </label>
              <input
                type="text"
                id="sizes"
                value={formData.sizes}
                onChange={(e) => {
                  const value = e.target.value;
                  const isShoes = formData.category === 'shoes';
                  
                  if (value === '') {
                    handleInputChange('sizes', value);
                  } else if (isShoes && /^[0-9,\s]+$/.test(value)) {
                    handleInputChange('sizes', value);
                  } else if (!isShoes && /^[XxSsLlMm,\s]+$/.test(value)) {
                    handleInputChange('sizes', value.toUpperCase());
                  }
                }}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all"
                placeholder={formData.category === 'shoes' ? '39, 40, 41, 42' : 'S, M, L, XL'}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.category === 'shoes' 
                  ? 'Separate sizes with commas. Numbers only for shoes (39, 40, 41, 42)' 
                  : 'Separate sizes with commas. Letters only for clothing (S, M, L, XL)'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 text-white text-center py-3 px-6 rounded-lg transition-colors font-semibold ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

