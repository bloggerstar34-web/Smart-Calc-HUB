import React, { useEffect, useRef, useState } from 'react';
import { AdBannerPosition } from '../../types';

interface AdBannerProps {
  position: AdBannerPosition;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ position, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (position !== 'header') return;

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [position]);

  useEffect(() => {
    if (position !== 'header' || !isDesktop) return;

    const container = containerRef.current;
    if (!container) return;

    // Clear any existing contents to prevent duplicate loading
    container.innerHTML = '';

    // Create the script element for window.atOptions configuration
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      window.atOptions = {
        'key' : '7ea3a0bc4072b9e7d354fac1df36afc8',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // Create the script element for loading Adsterra's invoke.js asynchronously
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://crateworkshop.com/7ea3a0bc4072b9e7d354fac1df36afc8/invoke.js';
    invokeScript.async = true;

    // Append elements inside our designated ad container
    container.appendChild(confScript);
    container.appendChild(invokeScript);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
      // Safe cleanup of global variable on component unmount
      if ((window as any).atOptions?.key === '7ea3a0bc4072b9e7d354fac1df36afc8') {
        delete (window as any).atOptions;
      }
    };
  }, [position, isDesktop]);

  if (position === 'header') {
    if (!isDesktop) {
      return null;
    }

    return (
      <div 
        className={`w-full flex justify-center items-center py-4 bg-transparent ${className}`}
        aria-label="Sponsored Advertisement"
      >
        <div 
          ref={containerRef} 
          className="w-[728px] h-[90px] min-w-[728px] min-h-[90px] flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
          style={{ width: '728px', height: '90px' }}
        >
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono tracking-wider animate-pulse">
            Loading Sponsored Advertisement...
          </span>
        </div>
      </div>
    );
  }

  const getPositionConfig = () => {
    switch (position) {
      case 'sidebar':
        return {
          title: 'Sidebar Advertisement (300x250)',
          sizeClass: 'h-64 w-full my-4',
          description: 'Adsterra Native / Square Banner'
        };
      case 'in-content':
        return {
          title: 'In-Content Advertisement (468x60)',
          sizeClass: 'h-28 w-full my-8',
          description: 'Adsterra In-Article Display Banner'
        };
      case 'footer':
        return {
          title: 'Footer Advertisement (970x90)',
          sizeClass: 'h-24 max-w-5xl mx-auto my-8',
          description: 'Adsterra Footer Leaderboard Banner'
        };
      case 'sticky-mobile':
        return {
          title: 'Sticky Mobile Advertisement (320x50)',
          sizeClass: 'fixed bottom-0 left-0 right-0 z-40 h-14 md:hidden m-0 rounded-none shadow-lg border-t border-blue-200 dark:border-blue-800',
          description: 'Adsterra Sticky Footer Ad'
        };
    }
  };

  const config = getPositionConfig();

  return (
    <div 
      className={`bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 dark:from-gray-800/80 dark:via-gray-800 dark:to-gray-800/80 border border-dashed border-blue-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center p-3 text-center overflow-hidden transition-all hover:border-blue-500 group ${config.sizeClass} ${className}`}
      aria-label="Advertisement Placeholder"
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        <span>Adsterra Ready Placeholder</span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate max-w-full px-2">
        {config.title}
      </span>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 hidden sm:inline">
        {config.description} • No active ad code inserted
      </span>
    </div>
  );
};
