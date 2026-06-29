import React, { useState } from 'react';
import { Calculator, Search, Sun, Moon, Download, Menu, X, Grid, BookOpen, Info, Mail, Sparkles } from 'lucide-react';
import { PageType, ToolCategory } from '../../types';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType, category?: ToolCategory) => void;
  onOpenSearch: () => void;
  onOpenInstall: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  onOpenInstall,
  isDark,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass-nav transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
              SmartCalc <span className="text-blue-600 dark:text-blue-400">Hub</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 -mt-1 hidden sm:inline">
              Offline Suite
            </span>
          </div>
        </div>

        {/* Quick Search Bar trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 text-gray-500 dark:text-gray-400 text-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              <span className="truncate">Search 50+ offline calculators...</span>
            </div>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-xs font-mono bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-500 dark:text-gray-300">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNav('all-tools')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'all-tools' 
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            All Tools
          </button>
          
          <button
            onClick={() => handleNav('categories')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'categories' 
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => handleNav('blog')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentPage === 'blog' || currentPage === 'article-detail' 
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' 
                : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            Blog
          </button>
        </nav>

        {/* Right Actions: Search (Mobile), Theme Toggle, Install PWA */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Search tools"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={onOpenInstall}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 pt-3 pb-6 space-y-2 animate-fadeIn shadow-xl">
          <button
            onClick={onOpenInstall}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-md mb-4"
          >
            <Download className="w-5 h-5" /> Install SmartCalc PWA Offline
          </button>

          <div className="space-y-1">
            <button
              onClick={() => handleNav('home')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Home
            </button>
            <button
              onClick={() => handleNav('all-tools')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Grid className="w-5 h-5 text-blue-600 dark:text-blue-400" /> All 50+ Tools
            </button>
            <button
              onClick={() => handleNav('categories')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Grid className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Categories
            </button>
            <button
              onClick={() => handleNav('blog')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Educational Blog
            </button>
            <button
              onClick={() => handleNav('about')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" /> About Us
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Mail className="w-5 h-5 text-rose-600 dark:text-rose-400" /> Contact Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
