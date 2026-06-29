import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    // Only show splash screen for standalone PWA or very first visit
    const hasVisited = sessionStorage.getItem('smartcalc_splash_shown');
    if (!isStandalone && hasVisited) {
      setShow(false);
      return;
    }

    sessionStorage.setItem('smartcalc_splash_shown', 'true');

    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => setShow(false), 500);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative">
        <div className="absolute -inset-4 bg-blue-500/30 rounded-3xl blur-xl animate-pulse"></div>
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-2xl relative z-10 animate-bounce">
          <Calculator className="w-12 h-12" />
        </div>
      </div>
      
      <h1 className="mt-8 text-3xl font-extrabold text-white tracking-tight">
        SmartCalc <span className="text-blue-400">Hub</span>
      </h1>
      <p className="mt-2 text-sm font-medium text-blue-200/80 tracking-widest uppercase">
        Progressive Web Suite
      </p>

      <div className="mt-12 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
        <span className="text-xs text-gray-400 font-mono">Loading offline calculation engines...</span>
      </div>
    </div>
  );
};
