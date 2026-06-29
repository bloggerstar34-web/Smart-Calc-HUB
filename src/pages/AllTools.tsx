import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowRight, Grid, LayoutList, ThumbsUp, HelpCircle } from 'lucide-react';
import { PageType, ToolCategory, ToolItem } from '../types';
import { TOOLS } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import { AdBanner } from '../components/common/AdBanner';

interface AllToolsProps {
  initialCategory?: ToolCategory;
  onNavigate: (page: PageType, category?: ToolCategory, toolId?: string) => void;
}

export const AllTools: React.FC<AllToolsProps> = ({ initialCategory, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          All 50+ Offline Online Tools
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Search, filter, and run full-stack equivalent utilities without downloading anything. Safe and offline-first.
        </p>
      </div>

      {/* Ads Banner Top */}
      <AdBanner position="header" className="mb-8" />

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 sm:p-6 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, keywords, formulas..."
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all text-gray-800 dark:text-white"
            />
          </div>

          {/* View Modes & Quick Info */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider font-mono">
              {filteredTools.length} tools found
            </span>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="List view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 mt-6 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Content Rendering */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Tools Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Try revising your search query or choosing another category filter.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate('tool-detail', tool.category, tool.id)}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-xl">
                    {tool.category}
                  </span>
                  {tool.popular && (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> Popular
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{tool.description}</p>
              </div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-2 border-t border-gray-50 dark:border-gray-800/80">
                Run Tool Offline <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate('tool-detail', tool.category, tool.id)}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {tool.name}
                    {tool.popular && <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 text-[9px] font-bold rounded uppercase">Popular</span>}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mt-0.5">{tool.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                  {tool.category}
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ads Sidebar/In-Content Placeholder */}
      <AdBanner position="in-content" className="mt-12" />
    </div>
  );
};
