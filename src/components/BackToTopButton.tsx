'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/20/solid'; 

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-md bg-white border border-gray-300 hover:bg-gray-100 transition"
      aria-label="Back to top"
    >
      <ArrowUpIcon className="w-6 h-6 text-[color:var(--color-f3accent)]" />
    </button>
  );
}
