'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface ImageWithColors {
  url: string;
  colors: string[];
}

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  description: string;
  images: Array<ImageWithColors | string>;
  imagesError?: string;
  stock: string;
  sizes: string;
  colors: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    description: '',
    images: [],
    stock: '',
    sizes: '',
    colors: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

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
      setFormData((prev) => ({ ...prev, [field]: value, sizes: '', colors: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/avif', 'image/webp', 'image/gif'];
    const uploadedUrls: string[] = [];
    const allDetectedColors: string[] = [];

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!allowedTypes.includes(file.type)) {
          showToast(`Skipped ${file.name}: Invalid file type`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          showToast(`Skipped ${file.name}: File too large (max 5MB)`);
          continue;
        }

        const uploadData = new FormData();
        uploadData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.imageUrl);
          
          const detectedColors = extractColorFromFilename(file.name);
          detectedColors.forEach(color => {
            if (!allDetectedColors.some(c => c.toLowerCase() === color.toLowerCase())) {
              allDetectedColors.push(color);
            }
          });
        }
      }

      if (uploadedUrls.length > 0) {
        const imageObjects = uploadedUrls.map((url) => {
          const filename = url.split('/').pop() || '';
          const detectedColors = extractColorFromFilename(filename);
          return {
            url,
            colors: detectedColors.length > 0 ? detectedColors : [],
          };
        });

        const existingImages = formData.images.map((img) => {
          if (typeof img === 'string') {
            return { url: img, colors: [] };
          }
          return img as ImageWithColors;
        });
        
        const allImages = [...existingImages, ...imageObjects];
        
        setFormData(prev => ({
          ...prev,
          images: allImages,
        }));

        if (allDetectedColors.length > 0) {
          const currentColors = formData.colors.trim();
          const existingColors = currentColors ? currentColors.split(',').map((c: string) => c.trim()) : [];
          const newColors = [...existingColors];
          
          allDetectedColors.forEach(color => {
            if (!newColors.some((c: string) => c.toLowerCase() === color.toLowerCase())) {
              newColors.push(color);
            }
          });
          
          handleInputChange('colors', newColors.join(', '));
          showToast(`${uploadedUrls.length} image(s) uploaded! Detected: ${allDetectedColors.join(', ')}`);
        } else {
          showToast(`${uploadedUrls.length} image(s) uploaded (general product images)`);
        }
      } else {
        showToast('No valid images were uploaded');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload images');
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
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

    if (formData.images.length === 0) {
      newErrors.imagesError = 'At least one product image is required';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const colorMap: { [key: string]: string } = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#00FF00',
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'brown': '#8B4513',
    'gray': '#808080',
    'grey': '#808080',
    'navy': '#000080',
    'beige': '#F5F5DC',
    'cream': '#FFFDD0',
  };

  const getColorHex = (colorName: string): string => {
    const lowerColor = colorName.toLowerCase();
    return colorMap[lowerColor] || '#000000';
  };

  const extractColorFromFilename = (filename: string): string[] => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').toLowerCase();
    const detectedColors: string[] = [];
    
    if (nameWithoutExt.includes('lifestyle') || nameWithoutExt.includes('angle')) {
      return [];
    }
    
    Object.keys(colorMap).forEach(color => {
      if (nameWithoutExt.includes(`-${color}`) || nameWithoutExt.endsWith(color)) {
        const capitalizedColor = color.charAt(0).toUpperCase() + color.slice(1);
        if (!detectedColors.includes(capitalizedColor)) {
          detectedColors.push(capitalizedColor);
        }
      }
    });
    
    return detectedColors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const slug = formData.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const colorsArray = formData.colors.trim() 
        ? formData.colors.split(',').map(c => c.trim()).filter(c => c)
        : [];
      
      const productData = {
        name: formData.name.trim(),
        slug,
        category: formData.category.trim(),
        price: formData.price.trim(),
        originalPrice: formData.originalPrice.trim() || null,
        description: formData.description.trim(),
        images: JSON.stringify(formData.images),
        stock: formData.stock.trim(),
        sizes: formData.sizes.trim(),
        colors: JSON.stringify(colorsArray.map(color => ({ name: color, value: getColorHex(color) }))),
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error creating product:', error);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      showToast('Product added successfully!');
      setFormData({
        name: '',
        category: '',
        price: '',
        originalPrice: '',
        description: '',
        images: [],
        stock: '',
        sizes: '',
        colors: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting product:', error);
      setIsSubmitting(false);
    }
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image <span className="text-red-500">*</span>
              </label>
              
              <div className="flex gap-3 mb-3">
                <label className="flex-1 cursor-pointer">
                  <div className={`px-4 py-2.5 border rounded-lg text-center transition-all ${
                    isUploading ? 'bg-gray-100 cursor-wait' : 'bg-black text-white hover:bg-gray-800'
                  }`}>
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </div>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.avif,.webp,.gif"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {formData.images.map((img, index) => {
                    const imageUrl = typeof img === 'string' ? img : img.url;
                    const imageColors = typeof img === 'string' ? [] : img.colors;
                    
                    return (
                      <div key={index} className="relative group h-24">
                        <Image
                          src={imageUrl}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover rounded-lg border border-gray-200"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded z-10">
                            Main
                          </span>
                        )}
                        {imageColors.length > 0 && (
                          <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded z-10">
                            {imageColors.join(', ')}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Upload multiple images. Naming examples:<br/>
                • Color-specific: <code className="text-black">jordan-1-black.jpg</code>, <code className="text-black">jordan-1-white.jpg</code><br/>
                • Angles: <code className="text-black">product-angle1.jpg</code>, <code className="text-black">product-angle2.jpg</code><br/>
                • Lifestyle: <code className="text-black">product-lifestyle1.jpg</code>, <code className="text-black">product-lifestyle2.jpg</code>
              </p>
              {errors.imagesError && <p className="text-red-500 text-xs mt-1">{errors.imagesError}</p>}
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

            <div className="mb-6">
              <label htmlFor="colors" className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors
              </label>
              <input
                type="text"
                id="colors"
                value={formData.colors}
                onChange={(e) => handleInputChange('colors', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all"
                placeholder="Black, White, Red, Blue"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate colors with commas (e.g., Black, White, Red)
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

