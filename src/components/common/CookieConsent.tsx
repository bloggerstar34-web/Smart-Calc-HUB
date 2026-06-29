import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('smartcalc_cookie_consent');
    if (!consent) {
      // Small delay for natural page load feeling
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('smartcalc_cookie_consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 left-5 md:left-auto md:max-w-md z-50 p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col gap-4 animate-slideIn">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
            Your Privacy, Guaranteed
            <button
              onClick={() => setShow(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              aria-label="Close cookie consent banner"
            >
              <X className="w-4 h-4" />
            </button>
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            SmartCalc Hub operates <strong>100% in-browser</strong>. We utilize local browser storage strictly to remember your bookmarks, theme preference, and recently used tools. No trackers, no cookies, and zero third-party databases are deployed.
          </p>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <a
          href="/?page=privacy-policy"
          onClick={(e) => {
            e.preventDefault();
            // dispatch custom navigate event or reload under page params
            window.location.search = '?page=privacy-policy';
          }}
          className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          Privacy Policy
        </a>
        <button
          onClick={handleAccept}
          className="flex-grow md:flex-none ml-auto py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-50 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          Acknowledge Privacy <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
