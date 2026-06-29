import React from 'react';
import { WifiOff, ShieldAlert, CheckCircle } from 'lucide-react';
import { PageType } from '../types';

interface OfflinePageProps {
  onNavigate?: (page: PageType) => void;
}

export const OfflinePage: React.FC<OfflinePageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100 dark:border-blue-900/10">
        <WifiOff className="w-10 h-10 animate-pulse" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
        You are Offline!
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        SmartCalc Hub has detected that your internet connection is currently down. Don't worry, our client-side runtime environment is fully ready.
      </p>

      {/* Offline Abilities Box */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 text-left space-y-3.5 my-8 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Offline-Ready Utilities</h3>
        
        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            **Scientific Calculator** and math formulas operate entirely with no connection.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            **JSON Formatter & Parser** and developer regex filters execute within local cache.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            **Password Generator & Word Counter** maintain full functional parameters locally.
          </p>
        </div>
      </div>

      {onNavigate && (
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-600/10 cursor-pointer"
        >
          Go to Home Dashboard
        </button>
      )}
    </div>
  );
};
