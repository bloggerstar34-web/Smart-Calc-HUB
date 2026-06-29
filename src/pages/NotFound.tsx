import React from 'react';
import { Compass, Home } from 'lucide-react';
import { PageType } from '../types';

interface NotFoundProps {
  onNavigate: (page: PageType) => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100 dark:border-blue-900/10">
        <Compass className="w-10 h-10 text-blue-500 animate-spin-slow" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        404 Page Not Found
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        We searched high and low, but the calculator, post, or route you are seeking doesn't exist on SmartCalc Hub.
      </p>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4" /> Go to Home
        </button>
        <button
          onClick={() => onNavigate('tools')}
          className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm transition-all cursor-pointer"
        >
          Explore All Tools
        </button>
      </div>
    </div>
  );
};
