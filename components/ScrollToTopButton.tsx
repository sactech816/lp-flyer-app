'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-sm text-indigo-600 p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all hover:scale-110 border border-gray-200"
      title="ページトップへ"
      aria-label="ページトップへスクロール"
    >
      <ArrowUp size={24} />
    </button>
  );
}

