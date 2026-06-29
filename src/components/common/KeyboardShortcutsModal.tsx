import React, { useEffect } from 'react';
import { X, Keyboard, ArrowRight, CornerDownLeft } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'K'], desc: 'Open Fast Global Search Overlay' },
    { keys: ['Ctrl', 'Shift', 'D'], desc: 'Toggle Day / Night Dark Mode' },
    { keys: ['Ctrl', 'Shift', 'B'], desc: 'Navigate to Bookmarks & Favorites' },
    { keys: ['Ctrl', 'Shift', 'H'], desc: 'Navigate directly back to Homepage' },
    { keys: ['Esc'], desc: 'Close any active overlay modal' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 transition-colors"
          aria-label="Close shortcuts"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
            <p className="text-xs text-gray-400">Speed up your workflow across SmartCalc Hub</p>
          </div>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-gray-800/60 rounded-2xl"
            >
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {shortcut.desc}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {shortcut.keys.map((key, keyIdx) => (
                  <React.Fragment key={keyIdx}>
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[10px] font-mono font-bold text-gray-800 dark:text-gray-200 shadow-sm">
                      {key}
                    </kbd>
                    {keyIdx < shortcut.keys.length - 1 && (
                      <span className="text-[10px] text-gray-400 font-bold">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span>Active globally in-browser</span>
          <button onClick={onClose} className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            Done <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
