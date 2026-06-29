import React from 'react';
import { ArrowRight, Globe, Shield, BookOpen, Layers, Settings } from 'lucide-react';
import { PageType, ToolCategory } from '../types';
import { CATEGORIES } from '../data/categories';
import { TOOLS } from '../data/tools';
import { BLOG_ARTICLES } from '../data/blog';

interface SitemapPageProps {
  onNavigate: (page: PageType, category?: ToolCategory, toolId?: string, articleId?: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center sm:text-left mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Visual Sitemap
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          A fully indexed outline of pages, calculators, formatting engines, and guides hosted on SmartCalc Hub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Core Pages */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 dark:border-gray-800 pb-3">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Core Portals</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li>
              <button onClick={() => onNavigate('home')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                Home Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('tools')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                All Offline Tools ({TOOLS.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('categories')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                Browse Categories ({CATEGORIES.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('blog')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                Knowledge Hub & Articles <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('about')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                About SmartCalc Hub <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                Contact & Support <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </li>
          </ul>
        </div>

        {/* Categories & Tools */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 dark:border-gray-800 pb-3">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Active Tools Grid</h3>
          </div>
          <div className="space-y-4">
            {CATEGORIES.map(cat => {
              const catTools = TOOLS.filter(t => t.category === cat.id);
              return (
                <div key={cat.id} className="space-y-1.5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cat.name}</h4>
                  <ul className="pl-3 border-l border-gray-100 dark:border-gray-800 space-y-1 text-xs">
                    {catTools.map(tool => (
                      <li key={tool.id}>
                        <button
                          onClick={() => onNavigate('tool-detail', tool.category, tool.id)}
                          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                        >
                          {tool.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guides & Policy */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 dark:border-gray-800 pb-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Guides & Governance</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" /> Educational Articles
              </h4>
              <ul className="space-y-2 text-xs">
                {BLOG_ARTICLES.map(article => (
                  <li key={article.id}>
                    <button
                      onClick={() => onNavigate('blog-detail', undefined, undefined, article.id)}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left truncate max-w-[240px] block cursor-pointer"
                      title={article.title}
                    >
                      {article.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-gray-400" /> Corporate Terms
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onNavigate('privacy')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('terms')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('disclaimer')} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                    Liability Disclaimer
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
