import React, { useState } from 'react';
import { Search, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { PageType, BlogArticle } from '../types';
import { BLOG_ARTICLES } from '../data/blog';
import { AdBanner } from '../components/common/AdBanner';

interface BlogProps {
  onNavigate: (page: PageType, category?: any, toolId?: string, articleId?: string) => void;
}

export const Blog: React.FC<BlogProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = BLOG_ARTICLES.filter((article) => {
    return (
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Knowledge Hub & Guides
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Educational resources, calculators usage guides, finance tutorials, and mathematical breakdowns.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs flex-shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides..."
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 transition-all text-gray-800 dark:text-white"
          />
        </div>
      </div>

      <AdBanner position="header" className="mb-8" />

      {/* Blog Feed */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Guides Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Try revising your search query or check back later for new guides.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onNavigate('blog-detail', undefined, undefined, article.id)}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Visual Header */}
                <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-950/40 dark:to-indigo-950/40 h-40 p-6 flex items-center justify-center border-b border-gray-50 dark:border-gray-800">
                  <div className="text-center">
                    <span className="text-4xl">📚</span>
                    <h4 className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-2">{article.category}</h4>
                  </div>
                </div>

                <div className="p-6">
                  {/* Article Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Tags & Action Button */}
              <div className="px-6 pb-6 pt-2">
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 pt-4 border-t border-gray-50 dark:border-gray-800/80">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdBanner position="in-content" className="mt-12" />
    </div>
  );
};
