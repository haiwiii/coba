import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 240);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <Motion.button
          key="scroll-top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          onClick={handleClick}
          aria-label="Scroll to top"
          className="fixed right-6 bottom-6 z-50 w-12 h-12 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center hover:bg-purple-700 transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </Motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
