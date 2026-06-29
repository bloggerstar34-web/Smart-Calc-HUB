import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { PageType, ToolCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { TOOLS } from '../../data/tools';
import { BLOG_ARTICLES } from '../../data/blog';

interface BreadcrumbProps {
  currentPage: PageType;
  currentCategory?: ToolCategory;
  currentToolId?: string;
  currentArticleId?: string;
  onNavigate: (page: PageType, category?: ToolCategory, toolId?: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentPage,
  currentCategory,
  currentToolId,
  currentArticleId,
  onNavigate
}) => {
  if (currentPage === 'home') return null;

  const categoryObj = currentCategory ? CATEGORIES.find(c => c.id === currentCategory) : null;
  const toolObj = currentToolId ? TOOLS.find(t => t.id === currentToolId) : null;
  const articleObj = currentArticleId ? BLOG_ARTICLES.find(a => a.id === currentArticleId || a.slug === currentArticleId) : null;

  const getPageTitle = (page: PageType) => {
    switch (page) {
      case 'all-tools': return 'All 50+ Tools';
      case 'categories': return 'Categories';
      case 'blog': return 'Educational Blog';
      case 'about': return 'About Us';
      case 'contact': return 'Contact Support';
      case 'privacy-policy': return 'Privacy Policy';
      case 'terms': return 'Terms & Conditions';
      case 'disclaimer': return 'Disclaimer';
      case 'sitemap': return 'HTML Sitemap';
      case '404': return 'Page Not Found';
      case 'offline': return 'Offline Mode';
      case 'article-detail': return articleObj?.title || 'Article';
      case 'tool-detail': return toolObj?.name || 'Tool Calculator';
      default: return 'Page';
    }
  };

  return (
    <nav className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 py-3 px-4 sm:px-6 lg:px-8 text-xs text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />

        {currentPage === 'tool-detail' && categoryObj ? (
          <>
            <button
              onClick={() => onNavigate('categories')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Categories
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => onNavigate('all-tools', categoryObj.id)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {categoryObj.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px] sm:max-w-md">
              {toolObj?.name || 'Tool'}
            </span>
          </>
        ) : currentPage === 'article-detail' ? (
          <>
            <button
              onClick={() => onNavigate('blog')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Blog
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px] sm:max-w-md">
              {articleObj?.title || 'Article'}
            </span>
          </>
        ) : (
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {getPageTitle(currentPage)}
          </span>
        )}
      </div>
    </nav>
  );
};
