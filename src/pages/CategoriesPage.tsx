import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PageType, ToolCategory } from '../types';
import { CATEGORIES } from '../data/categories';
import { TOOLS } from '../data/tools';
import { AdBanner } from '../components/common/AdBanner';

interface CategoriesPageProps {
  onNavigate: (page: PageType, category?: ToolCategory, toolId?: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Browse Tools by Category
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          We categorize our offline tools into logical clusters to help you solve mathematical, fiscal, developer, and editing tasks instantly.
        </p>
      </div>

      <AdBanner position="header" className="mb-8" />

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((cat) => {
          const categoryTools = TOOLS.filter((tool) => tool.category === cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => onNavigate('tools', cat.id)}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-xl">
                    {cat.icon === 'Calculator' ? '🧮' : cat.icon === 'Code' ? '💻' : cat.icon === 'Percent' ? '📈' : '✍️'}
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                    {categoryTools.length} Utilities
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{cat.description}</p>
                
                {/* List some sample tools in this category */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">Popular Tools:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryTools.slice(0, 3).map(tool => (
                      <span key={tool.id} className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-xl">
                        {tool.name}
                      </span>
                    ))}
                    {categoryTools.length > 3 && (
                      <span className="text-xs text-blue-500 font-semibold px-2 py-1">
                        +{categoryTools.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 pt-4 border-t border-gray-50 dark:border-gray-800/80">
                Explore Category <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      <AdBanner position="in-content" className="mt-12" />
    </div>
  );
};
