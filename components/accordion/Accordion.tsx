'use client';

import { useState } from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
  variant?: 'dark' | 'light';
}

export default function Accordion({ items, allowMultiple = false, variant = 'dark' }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(items.map((item, index) => (item.defaultOpen ? index : -1)).filter(i => i !== -1))
  );

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  const isLight = variant === 'light';

  return (
    <div className="w-full flex flex-col items-center">
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div 
            key={index} 
            className={`${
              isLight 
                ? 'bg-white border border-gray-200' 
                : 'bg-gray-800'
            } rounded-lg overflow-hidden mb-4 last:mb-0`}
            style={{ width: '956px', minHeight: '98px' }}
          >
            <button
              onClick={() => toggleItem(index)}
              className={`w-full flex items-center justify-between text-left ${
                isLight
                  ? 'bg-white hover:bg-gray-50'
                  : 'bg-gray-800 hover:bg-gray-700'
              } transition-colors`}
              style={{ height: '98px', paddingLeft: '24px', paddingRight: '24px' }}
              aria-expanded={isOpen}
            >
              <span className={`font-bold ${
                isLight ? 'text-black' : 'text-gray-100'
              }`}
              style={{ fontSize: '24px' }}
              >
                {item.title}
              </span>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isLight ? 'bg-black' : 'bg-gray-700'
              }`}>
                <svg
                  className={`w-4 h-4 ${
                    isLight ? 'text-white' : 'text-white'
                  } transition-transform duration-300 ${
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
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isOpen ? 'max-h-[1000px]' : 'max-h-0'
              }`}
            >
              <div className={`${isLight ? 'border-t border-gray-200' : 'border-t border-gray-700'}`}></div>
              <div className={`leading-relaxed transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              } ${
                isLight ? 'text-black' : 'text-gray-300'
              }`}
              style={{ 
                fontSize: '16px',
                fontWeight: '500',
                padding: '24px'
              }}
              >
                {item.children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
