'use client';

import Accordion from '../accordion/Accordion';

const faqData = [
  {
    title: 'What is your return policy?',
    content: 'We offer a 30-day return policy on all items. Items must be unworn, unwashed, and in their original packaging with tags attached. You can initiate a return through your account dashboard or by contacting our customer service team.',
    defaultOpen: false,
  },
  {
    title: 'How long does shipping take?',
    content: 'Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for delivery within 2-3 business days. You will receive a tracking number via email once your order ships.',
    defaultOpen: false,
  },
  {
    title: 'Do you offer international shipping?',
    content: 'Yes, we ship to over 50 countries worldwide. International shipping times vary by location, typically ranging from 7-14 business days. Additional customs fees may apply depending on your country.',
    defaultOpen: false,
  },
  {
    title: 'Can I track my order?',
    content: 'Absolutely! Once your order ships, you will receive a tracking number via email. You can track your package in real-time through the carrier\'s website or by logging into your account on our website.',
    defaultOpen: false,
  },
  {
    title: 'How can I find my size?',
    content: 'We provide detailed size charts for all products on each product page. You can also refer to our comprehensive size guide, which includes measurements and fit recommendations. If you\'re still unsure, our customer service team is happy to help you find the perfect fit.',
    defaultOpen: false,
  },
];

export default function FAQSection() {
  const accordionItems = faqData.map((item) => ({
    title: item.title,
    children: item.content,
    defaultOpen: item.defaultOpen,
  }));

  return (
    <section className="w-full bg-white py-16 md:py-24 pt-4 md:pt-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1152px' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
          Frequently Asked Questions (FAQs)
        </h2>
        <Accordion items={accordionItems} allowMultiple={false} variant="light" />
      </div>
    </section>
  );
}
