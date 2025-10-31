'use client';

import { useState } from 'react';

interface FilterSection {
  title: string;
  items: FilterItem[];
  defaultOpen?: boolean;
}

interface FilterItem {
  label: string;
  value: string;
  count?: number;
}

interface FilterSidebarProps {
  initialFilter?: string;
  initialGender?: string;
  initialCategory?: string;
}

export default function FilterSidebar({ initialFilter, initialGender, initialCategory }: FilterSidebarProps) {
  const sectionId = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '-');
  
  const hasUpTo60OffFilter = initialFilter === 'up-to-60-off';
  const saleDiscountId = sectionId('Sale & Discounts');
  
  const initialSelectedFilters = new Set<string>();
  if (hasUpTo60OffFilter) {
    initialSelectedFilters.add('up-to-60-off');
  }
  if (initialGender) {
    initialSelectedFilters.add(initialGender);
  }
  if (initialCategory === 'shoes' || initialCategory === 'sneakers') {
    initialSelectedFilters.add('shoes');
  } else if (initialCategory) {
    initialSelectedFilters.add(initialCategory);
  }
  
  const initialOpenSectionsSet = hasUpTo60OffFilter 
    ? new Set([saleDiscountId, 'new-arrivals'])
    : new Set(['new-arrivals', saleDiscountId]);
  
  if (initialGender) {
    initialOpenSectionsSet.add('gender');
  }
  if (initialCategory) {
    initialOpenSectionsSet.add('new-arrivals');
  }

  const [openSections, setOpenSections] = useState<Set<string>>(initialOpenSectionsSet);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(initialSelectedFilters);
  const [selectedNewArrival, setSelectedNewArrival] = useState<string>(
    initialCategory === 'shoes' || initialCategory === 'sneakers' ? 'shoes' : (initialCategory || '')
  );

  const allNewArrivalItems = [
    { label: 'Shoes', value: 'shoes' },
    { label: 'Tops & Tshirts', value: 'tops-tshirts' },
    { label: 'Shorts', value: 'shorts' },
    { label: 'Hoodies & Jackets', value: 'hoodies-jackets' },
    { label: 'Trousers & Tights', value: 'trousers-tights' },
    { label: 'Dress', value: 'dress' },
  ];

  const getFilteredNewArrivalItems = () => {
    const selectedGender = Array.from(selectedFilters).find(f => ['men', 'women', 'kids', 'unisex'].includes(f)) || initialGender;
    const shouldShowDress = selectedGender === 'women' || selectedGender === 'kids';

    return allNewArrivalItems.filter(item => {
      if (item.value === 'dress') {
        return shouldShowDress;
      }
      return true;
    });
  };

  const saleDiscountsSection: FilterSection = {
    title: 'Sale & Discounts',
    items: [
      { label: 'UP TO 60% OFF*', value: 'up-to-60-off' },
      { label: '50% or More', value: 'discount-50-plus' },
      { label: '40-50% Off', value: 'discount-40-50' },
      { label: '30-40% Off', value: 'discount-30-40' },
      { label: '20-30% Off', value: 'discount-20-30' },
    ],
    defaultOpen: hasUpTo60OffFilter,
  };

  const genderSection: FilterSection = {
    title: 'Gender',
    items: [
      { label: 'Men', value: 'men' },
      { label: 'Women', value: 'women' },
      { label: 'Kids', value: 'kids' },
      { label: 'Unisex', value: 'unisex' },
    ],
    defaultOpen: !!initialGender,
  };

  const colourSection: FilterSection = {
    title: 'Colour',
    items: [
      { label: 'Black', value: 'black' },
      { label: 'White', value: 'white' },
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' },
      { label: 'Yellow', value: 'yellow' },
      { label: 'Purple', value: 'purple' },
      { label: 'Pink', value: 'pink' },
    ],
    defaultOpen: false,
  };

  const filteredNewArrivalItems = getFilteredNewArrivalItems();
  const sectionTitle = (initialGender || initialCategory || hasUpTo60OffFilter) ? 'Categories' : 'New Arrivals';
  const newArrivalsSection: FilterSection = {
    title: sectionTitle,
    items: filteredNewArrivalItems,
    defaultOpen: true,
  };

  const filterSections: FilterSection[] = hasUpTo60OffFilter
    ? [saleDiscountsSection, newArrivalsSection, genderSection, colourSection]
    : [newArrivalsSection, saleDiscountsSection, genderSection, colourSection];

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white border-r border-gray-200" style={{ width: '320px' }}>
      <div className="p-4">
        {filterSections.map((section, index) => {
          const id = sectionId(section.title);
          const isOpen = openSections.has(id);
          const showCount = section.title === 'New Arrivals' && !hasUpTo60OffFilter && !initialGender && !initialCategory;

          const isCategoriesSection = section.title === 'Categories' || section.title === 'New Arrivals';
          const isAlwaysOpen = isCategoriesSection;

          return (
            <div key={id} className={index > 0 ? 'border-t border-gray-200 pt-4 mt-4' : ''}>
              <button
                onClick={() => !isAlwaysOpen && toggleSection(id)}
                className="w-full flex items-center justify-between text-left mb-3 hover:opacity-80 transition-opacity"
              >
                <span className="font-bold text-black text-base">
                  {section.title}
                  {showCount && <span className="font-normal text-gray-600"> (6969)</span>}
                </span>
                {!isAlwaysOpen && (
                  <svg
                    className={`w-4 h-4 text-black transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              <div
                className={`${isAlwaysOpen ? '' : 'overflow-hidden transition-all duration-300 ease-in-out'} ${
                  isAlwaysOpen || isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex flex-col gap-2">
                  {section.items.map((item) => {
                    const isNewArrivals = section.title === 'New Arrivals' || section.title === 'Categories';
                    const isChecked = isNewArrivals 
                      ? selectedNewArrival === item.value 
                      : selectedFilters.has(item.value);
                    
                    return (
                      <label
                        key={item.value}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity py-1"
                      >
                        <input
                          type={isNewArrivals ? 'radio' : 'checkbox'}
                          name={isNewArrivals ? 'new-arrivals' : id}
                          value={item.value}
                          checked={isChecked}
                          onChange={(e) => {
                            if (isNewArrivals) {
                              setSelectedNewArrival(e.target.value);
                            } else {
                              const newSet = new Set(selectedFilters);
                              if (e.target.checked) {
                                newSet.add(item.value);
                              } else {
                                newSet.delete(item.value);
                              }
                              setSelectedFilters(newSet);
                            }
                          }}
                          className={`${isNewArrivals ? 'w-4 h-4' : 'w-4 h-4'} border-gray-300 ${isNewArrivals ? '' : 'rounded'} text-black focus:ring-black cursor-pointer`}
                        />
                        <span className="text-sm text-black">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

