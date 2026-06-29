import React from 'react';
import { ArrowLeft, Calendar, Clock, Share2, AlertCircle } from 'lucide-react';
import { PageType, BlogArticle } from '../types';
import { BLOG_ARTICLES } from '../data/blog';
import { AdBanner } from '../components/common/AdBanner';

interface ArticleDetailProps {
  articleId: string;
  onNavigate: (page: PageType, category?: any, toolId?: string, articleId?: string) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId, onNavigate }) => {
  const article = BLOG_ARTICLES.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Guide Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The blog post or tutorial you are looking for does not exist.</p>
        <button
          onClick={() => onNavigate('blog')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold"
        >
          Back to Knowledge Hub
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('blog')}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Knowledge Hub
      </button>

      {/* Hero Visual Header */}
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-8 sm:p-12 mb-8 border border-blue-50/50 dark:border-blue-900/10 text-center sm:text-left">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
          {article.category}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-4 leading-tight">
          {article.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl">
          {article.excerpt}
        </p>

        {/* Stats and Share */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{article.readTime} Reading Guide</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Article
          </button>
        </div>
      </div>

      <AdBanner position="header" className="mb-8" />

      {/* Main Content Body */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        {/* Render paragraphs cleanly */}
        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
          {article.content.split('\n\n').map((paragraph, index) => {
            // Check if it's a section header (e.g. starts with "### " or "## ")
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white pt-6 border-t border-gray-50 dark:border-gray-800/60">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
              const listItems = paragraph.split('\n');
              return (
                <ul key={index} className="list-disc pl-5 space-y-2">
                  {listItems.map((li, liIdx) => (
                    <li key={liIdx}>{li.replace(/^[-*]\s+/, '')}</li>
                  ))}
                </ul>
              );
            }

            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* Footer Meta */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-xl">
                #{tag}
              </span>
            ))}
          </div>

          <span className="text-xs font-mono font-bold text-gray-400 uppercase">
            AUTHOR: SMARTCALC HUB EDUCATION
          </span>
        </div>
      </div>

      <AdBanner position="in-content" className="mt-12" />
    </article>
  );
};
