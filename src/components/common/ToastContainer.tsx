import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export const toast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
  const event = new CustomEvent('smartcalc_toast', {
    detail: { message, type, id: Math.random().toString(36).substr(2, 9) }
  });
  window.dispatchEvent(event);
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Omit<ToastMessage, 'id'> & { id?: string }>;
      const { message, type, id } = customEvent.detail;
      const toastId = id || Math.random().toString(36).substr(2, 9);
      
      setToasts((prev) => [...prev, { id: toastId, message, type }]);

      // Auto-remove after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      }, 4000);
    };

    window.addEventListener('smartcalc_toast', handleToastEvent);
    return () => {
      window.removeEventListener('smartcalc_toast', handleToastEvent);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 left-5 z-[100] space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          let bgColor = 'bg-white dark:bg-gray-900 border-emerald-500/30';
          let icon = <CheckCircle className="w-5 h-5 text-emerald-500" />;
          if (t.type === 'error') {
            bgColor = 'bg-white dark:bg-gray-900 border-red-500/30';
            icon = <AlertTriangle className="w-5 h-5 text-red-500" />;
          } else if (t.type === 'info') {
            bgColor = 'bg-white dark:bg-gray-900 border-blue-500/30';
            icon = <Info className="w-5 h-5 text-blue-500" />;
          }

          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 p-4 rounded-2xl border ${bgColor} shadow-xl pointer-events-auto relative overflow-hidden`}
            >
              {/* Sidebar border accent */}
              <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              
              <div className="flex-shrink-0 ml-1.5">{icon}</div>
              <div className="flex-grow pr-4">
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  {t.type === 'success' ? 'Action Completed' : t.type === 'error' ? 'System Error' : 'Notification'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {t.message}
                </p>
              </div>
              
              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
