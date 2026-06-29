import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calculator, ArrowRight, Grid } from 'lucide-react';
import { PageType, ToolItem, ToolCategory } from '../../types';
import { TOOLS } from '../../data/tools';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageType, category?: ToolCategory, toolId?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const results = TOOLS.filter((tool) => {
    return (
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      tool.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase()))
    );
  });

  const handleSelect = (tool: ToolItem) => {
    onNavigate('tool-detail', tool.category, tool.id);
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-[10vh] animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        
        {/* Search header bar */}
        <div className="relative border-b border-gray-100 dark:border-gray-800 p-4 flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-6" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type tool name, formulas, mortgage, code formatter..."
            className="w-full bg-transparent pl-12 pr-12 py-3 text-base focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 transition-colors absolute right-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2 scrollbar-thin">
          {results.length === 0 ? (
            <div className="text-center py-10 animate-fadeIn">
              <p className="text-sm text-gray-500">No matching calculators found for "{query}"</p>
            </div>
          ) : (
            results.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelect(tool)}
                  className={`flex items-center justify-between p-3.5 border rounded-2xl cursor-pointer transition-all group ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/40 shadow-sm'
                      : 'border-transparent hover:bg-blue-50/30 dark:hover:bg-slate-950/60 hover:border-blue-100 dark:hover:border-blue-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${
                      isSelected 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                        : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    }`}>
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {tool.name}
                        <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 font-mono bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                          {tool.category}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[320px] sm:max-w-md mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Footer stats / tip */}
        <div className="bg-gray-50 dark:bg-gray-800/20 px-6 py-3 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 flex justify-between items-center font-mono">
          <span>{query ? `${results.length} matched` : `${TOOLS.length} tools indexed`}</span>
          <span className="hidden sm:inline">Use ↑↓ keys to navigate, Enter to open</span>
        </div>

      </div>
    </div>
  );
};
