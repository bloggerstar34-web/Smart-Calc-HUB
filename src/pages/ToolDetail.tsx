import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, ThumbsUp, HelpCircle, FileText, Star, Share2 } from 'lucide-react';
import { PageType, ToolCategory } from '../types';
import { TOOLS } from '../data/tools';
import { BLOG_ARTICLES } from '../data/blog';
import { toast } from '../components/common/ToastContainer';

// Import tool components lazily for optimized code splitting & bundle performance
const ScientificCalculator = React.lazy(() => import('../components/tools/ScientificCalculator').then(module => ({ default: module.ScientificCalculator })));
const MortgageCalculator = React.lazy(() => import('../components/tools/MortgageCalculator').then(module => ({ default: module.MortgageCalculator })));
const JsonFormatter = React.lazy(() => import('../components/tools/JsonFormatter').then(module => ({ default: module.JsonFormatter })));
const RegexTester = React.lazy(() => import('../components/tools/RegexTester').then(module => ({ default: module.RegexTester })));
const PasswordGenerator = React.lazy(() => import('../components/tools/PasswordGenerator').then(module => ({ default: module.PasswordGenerator })));
const WordCounter = React.lazy(() => import('../components/tools/WordCounter').then(module => ({ default: module.WordCounter })));
const AgeCalculator = React.lazy(() => import('../components/tools/AgeCalculator').then(module => ({ default: module.AgeCalculator })));
const QrcodeGenerator = React.lazy(() => import('../components/tools/QrcodeGenerator').then(module => ({ default: module.QrcodeGenerator })));
const UnitConverter = React.lazy(() => import('../components/tools/UnitConverter').then(module => ({ default: module.UnitConverter })));

import { AdBanner } from '../components/common/AdBanner';

const ToolLoader = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4 space-y-4">
    <div className="w-12 h-12 border-4 border-blue-600/15 border-t-blue-600 rounded-full animate-spin"></div>
    <div className="text-center">
      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Initializing Sandbox...</p>
      <p className="text-xs text-gray-400 mt-1">Booting secure, 100% private in-memory application</p>
    </div>
  </div>
);

interface ToolDetailProps {
  category?: ToolCategory;
  toolId: string;
  onNavigate: (page: PageType, category?: ToolCategory, toolId?: string, articleId?: string) => void;
}

export const ToolDetail: React.FC<ToolDetailProps> = ({ category, toolId, onNavigate }) => {
  const tool = TOOLS.find((t) => t.id === toolId);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!tool) return;
    
    // Check bookmark status
    const bookmarks = JSON.parse(localStorage.getItem('smartcalc_bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(tool.id));

    // Add to recently viewed tools
    let recents = JSON.parse(localStorage.getItem('smartcalc_recents') || '[]');
    recents = recents.filter((id: string) => id !== tool.id);
    recents.unshift(tool.id);
    if (recents.length > 6) recents.pop();
    localStorage.setItem('smartcalc_recents', JSON.stringify(recents));
    
    // Dispatch event to notify Home / Navbars
    window.dispatchEvent(new CustomEvent('smartcalc_recents_changed'));
  }, [toolId, tool]);

  const toggleBookmark = () => {
    if (!tool) return;
    let bookmarks = JSON.parse(localStorage.getItem('smartcalc_bookmarks') || '[]');
    let nextState = false;
    
    if (isBookmarked) {
      bookmarks = bookmarks.filter((id: string) => id !== tool.id);
      toast('Removed from Bookmarks', 'info');
      nextState = false;
    } else {
      bookmarks.push(tool.id);
      toast('Added to Bookmarks successfully', 'success');
      nextState = true;
    }
    
    localStorage.setItem('smartcalc_bookmarks', JSON.stringify(bookmarks));
    setIsBookmarked(nextState);
    window.dispatchEvent(new CustomEvent('smartcalc_bookmarks_changed'));
  };

  const handleShare = () => {
    if (!tool) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast('Share link copied to clipboard!', 'success');
    }).catch(() => {
      toast('Failed to copy share link', 'error');
    });
  };

  if (!tool) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tool Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The requested offline utility cannot be found in our current database.</p>
        <button
          onClick={() => onNavigate('tools')}
          className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm cursor-pointer"
        >
          Browse All Tools
        </button>
      </div>
    );
  }

  // Find corresponding related guides (by category or tags)
  const relatedArticles = BLOG_ARTICLES.filter(
    (art) => art.category.toLowerCase() === tool.category.toLowerCase()
  );

  // Render the actual active calculator component
  const renderCalculator = () => {
    let childComponent;
    switch (tool.id) {
      case 'scientific-calculator':
        childComponent = <ScientificCalculator />;
        break;
      case 'mortgage-calculator':
        childComponent = <MortgageCalculator />;
        break;
      case 'json-formatter':
        childComponent = <JsonFormatter />;
        break;
      case 'regex-tester':
        childComponent = <RegexTester />;
        break;
      case 'password-generator':
        childComponent = <PasswordGenerator onNavigate={onNavigate} />;
        break;
      case 'word-counter':
        childComponent = <WordCounter onNavigate={onNavigate} />;
        break;
      case 'age-calculator':
        childComponent = <AgeCalculator id="age-calculator-widget" onNavigate={onNavigate} />;
        break;
      case 'qrcode-generator':
        childComponent = <QrcodeGenerator id="qrcode-generator-widget" onNavigate={onNavigate} />;
        break;
      case 'unit-converter':
        childComponent = <UnitConverter />;
        break;
      default:
        childComponent = (
          <div className="p-8 text-center bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-gray-800 rounded-2xl">
            <p className="text-sm text-gray-500">Calculator under maintenance. Check back shortly!</p>
          </div>
        );
    }

    return (
      <React.Suspense fallback={<ToolLoader />}>
        {childComponent}
      </React.Suspense>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('tools', tool.category)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tools
      </button>

      {/* Hero Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="text-left">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-xl">
              {tool.category}
            </span>
            {tool.popular && (
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> Popular Utility
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
            {tool.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-3xl">
            {tool.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={toggleBookmark}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600 shadow-md shadow-amber-500/10'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 shadow-sm'
            }`}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer shadow-sm"
            aria-label="Share this tool"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <AdBanner position="header" className="mb-8" />

      {/* Main Grid: Interactive Form vs Sidebar guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Tool Component Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 sm:p-8 shadow-sm">
            {renderCalculator()}
          </div>

          {/* Educational Guidelines / Formula details */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-50 dark:border-gray-800 pb-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">How This Tool Works</h3>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Every computation performed inside the {tool.name} happens fully within your device memory pool using sandboxed JavaScript engines. This means:
            </p>

            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <li>**No Latency:** Calculations finish instantly with 0ms round-trip server overhead.</li>
              <li>**Full Offline Operation:** Ready to compute equations or generate code structures even without cellular link.</li>
              <li>**Private:** None of your values, sensitive mortgages, passwords, or data blocks leave your physical browser window.</li>
            </ul>

            {/* Render any formulas or notes listed in tool metadata */}
            {tool.formulas && tool.formulas.length > 0 && (
              <div className="bg-gray-50 dark:bg-slate-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2 font-mono">Governing Formula / Mathematical Logic:</h4>
                <div className="space-y-2">
                  {tool.formulas.map((formula, idx) => (
                    <p key={idx} className="text-xs font-mono text-gray-600 dark:text-gray-400">
                      {formula}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar guidelines / related articles */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Related Articles Card */}
          {relatedArticles.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-50 dark:border-gray-800 pb-3">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Educational Guides</h3>
              </div>
              <div className="space-y-4">
                {relatedArticles.slice(0, 3).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onNavigate('blog-detail', undefined, undefined, art.id)}
                    className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-950 p-2.5 rounded-xl transition-all"
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTime} guide</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQS for specific category */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 dark:border-gray-800 pb-3">
              <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Quick Help & FAQ</h3>
            </div>
            
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Is my data secure inside this calculator?</h4>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Yes, absolutely. We process everything client-side inside the standard browser sandbox. No transmission ever occurs.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Can I use this utility offline?</h4>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Yes. Install the SmartCalc Hub as an app on your mobile or desktop, and it will load instantly even with no cellular signals.</p>
              </div>
            </div>
          </div>

          <AdBanner position="sidebar" />
        </div>

      </div>

      <AdBanner position="in-content" className="mt-12" />
    </div>
  );
};
