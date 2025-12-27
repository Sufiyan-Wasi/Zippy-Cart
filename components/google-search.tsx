'use client';

import { useEffect, useRef } from 'react';

export function GoogleSearch() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector('script[src*="cse.google.com/cse.js"]');
    if (!existingScript) {
      // Load the Google CSE script
      const script = document.createElement('script');
      script.src = 'https://cse.google.com/cse.js?cx=f52f011ce4b5142a4';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return <div ref={containerRef} className="gcse-search" />;
}