import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, CheckCircle, Smartphone, Laptop, Sparkles } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if already standalone
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setInstalledSuccess(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Download className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Offline PWA Ready
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Install SmartCalc Hub</h3>
          </div>
        </div>

        {isStandalone || installedSuccess ? (
          <div className="text-center py-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-6">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">App Successfully Installed!</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              SmartCalc Hub is now available directly on your desktop or home screen for instant offline calculations.
            </p>
            <button 
              onClick={onClose}
              className="mt-5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm shadow-md transition-all"
            >
              Start Calculating
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Install <strong>SmartCalc Hub</strong> as a native app on your phone or computer. No App Store or Google Play required. Works 100% offline with zero ads cluttering standalone mode.
            </p>

            {deferredPrompt ? (
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6 text-center">
                <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2 inline-block sm:hidden" />
                <Laptop className="w-8 h-8 text-blue-600 mx-auto mb-2 hidden sm:inline-block" />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">One-Click Browser Installation</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Supported directly by your current browser. Click below to install to your device.
                </p>
                <button
                  onClick={handleNativeInstall}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" /> Add to Home Screen / Desktop
                </button>
              </div>
            ) : isIOS ? (
              <div className="bg-slate-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" /> iOS Safari Installation Guide:
                </h4>
                <ol className="text-xs text-gray-600 dark:text-gray-300 space-y-2.5 list-decimal list-inside">
                  <li>Tap the <strong className="text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600"><Share className="w-3 h-3" /> Share</strong> button in Safari's bottom toolbar.</li>
                  <li>Scroll down and select <strong className="text-gray-900 dark:text-white inline-flex items-center gap-1 bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600"><PlusSquare className="w-3 h-3" /> Add to Home Screen</strong>.</li>
                  <li>Confirm by tapping <strong>Add</strong> in the top right corner.</li>
                </ol>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Browser Menu Installation:</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                  If the automatic prompt didn't appear:
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 list-disc list-inside">
                  <li><strong>Chrome / Edge (Desktop):</strong> Click the install icon <span className="inline-block px-1 bg-gray-200 dark:bg-gray-700 rounded">⊕</span> on the right side of the address bar.</li>
                  <li><strong>Android Chrome:</strong> Tap the 3 dots menu <span className="inline-block px-1 bg-gray-200 dark:bg-gray-700 rounded">⋮</span> and tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</li>
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
              <span>• 100% Free & Offline Supported</span>
              <button onClick={onClose} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Maybe Later
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
