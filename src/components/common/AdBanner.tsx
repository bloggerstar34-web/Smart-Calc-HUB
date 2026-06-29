import React from 'react';
import { AdBannerPosition } from '../../types';

interface AdBannerProps {
  position: AdBannerPosition;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ position, className = '' }) => {
  const getPositionConfig = () => {
    switch (position) {
      case 'header':
        return {
          title: 'Header Advertisement (728x90 / 320x50)',
          sizeClass: 'h-24 max-w-4xl mx-auto my-6',
          description: 'Responsive Adsterra Banner Placeholder'
        };
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
