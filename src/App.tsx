import React, { useState, useEffect } from 'react';
import { PageType, ToolCategory } from './types';
import { TOOLS } from './data/tools';
import { BLOG_ARTICLES } from './data/blog';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Breadcrumb } from './components/common/Breadcrumb';
import { BackToTop } from './components/common/BackToTop';
import { SplashScreen } from './components/common/SplashScreen';
import { InstallAppModal } from './components/common/InstallAppModal';
import { SearchModal } from './components/common/SearchModal';
import { ToastContainer, toast } from './components/common/ToastContainer';
import { CookieConsent } from './components/common/CookieConsent';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { Keyboard } from 'lucide-react';

// Pages
import { Home } from './pages/Home';
import { AllTools } from './pages/AllTools';
import { CategoriesPage } from './pages/CategoriesPage';
import { Blog } from './pages/Blog';
import { ArticleDetail } from './pages/ArticleDetail';
import { ToolDetail } from './pages/ToolDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { Disclaimer } from './pages/Disclaimer';
import { SitemapPage } from './pages/SitemapPage';
import { OfflinePage } from './pages/OfflinePage';
import { NotFound } from './pages/NotFound';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | undefined>(undefined);
  const [selectedToolId, setSelectedToolId] = useState<string | undefined>(undefined);
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(undefined);

  // Modal states
  const [searchOpen, setSearchOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);

  // Theme states
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('smartcalc_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Handle page routing parameters cleanly
  const handleNavigate = (
    page: PageType,
    category?: ToolCategory,
    toolId?: string,
    articleId?: string
  ) => {
    setCurrentPage(page);
    setSelectedCategory(category);
    setSelectedToolId(toolId);
    setSelectedArticleId(articleId);

    // Smooth scroll to top on routing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync theme class to document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartcalc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartcalc_theme', 'light');
    }
  }, [isDark]);

  // Shortcuts state
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Sync keyboard shortcuts
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      // Ctrl+K -> Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      // Ctrl+Shift+D -> Toggle theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDark((prev) => !prev);
        toast('Theme Mode Toggled!', 'info');
      }
      // Ctrl+Shift+B -> Home (Bookmarks)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleNavigate('home');
        toast('Navigated to Bookmarks Dashboard', 'info');
      }
      // Ctrl+Shift+H -> Home
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleNavigate('home');
        toast('Returned to Homepage', 'info');
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  // Online / Offline detectors
  useEffect(() => {
    const handleOnline = () => {
      toast('Network restored! You are back online.', 'success');
      if (currentPage === 'offline') {
        handleNavigate('home');
      }
    };

    const handleOffline = () => {
      toast('Network lost! Entering 100% Offline Sandbox Mode.', 'error');
      handleNavigate('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine && currentPage !== 'offline') {
      handleNavigate('offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentPage]);

  // Dynamic Page Title & Meta Description updating for SEO Compliance
  useEffect(() => {
    let title = 'SmartCalc Hub | Premium Offline Calculator & Dev Tools';
    let description = 'Instantly run 50+ fully production-ready calculators, code beautifiers, password engines, and SEO systems. 100% private sandbox in your browser cache.';
    let canonicalUrl = 'https://smartcalchub.com/';
    let ogType = 'website';
    let ogImage = 'https://smartcalchub.com/favicon.svg';

    const breadcrumbsList: Array<{ name: string; url: string }> = [
      { name: 'Home', url: 'https://smartcalchub.com/' }
    ];

    let specificSchema: any = null;

    switch (currentPage) {
      case 'home':
        title = 'SmartCalc Hub - 100% Private Offline Calculators & Dev Utilities';
        canonicalUrl = 'https://smartcalchub.com/';
        specificSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'SmartCalc Hub',
          'url': 'https://smartcalchub.com/',
          'description': 'Production-ready Progressive Web App featuring 50+ offline calculators, developer tools, and percentage systems.'
        };
        break;
      case 'all-tools':
        title = selectedCategory 
          ? `All ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Tools - SmartCalc Hub`
          : 'Explore 50+ Premium Offline Utilities - SmartCalc Hub';
        description = 'Browse through our extensive library of local, in-memory calculators, developers tools, financial planners, and percentage helpers.';
        canonicalUrl = selectedCategory 
          ? `https://smartcalchub.com/?page=all-tools&category=${selectedCategory}`
          : 'https://smartcalchub.com/?page=all-tools';
        
        breadcrumbsList.push({
          name: selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Tools` : 'All Tools',
          url: canonicalUrl
        });
        break;
      case 'categories':
        title = 'Browse Specialized Tool Categories - SmartCalc Hub';
        canonicalUrl = 'https://smartcalchub.com/?page=categories';
        breadcrumbsList.push({ name: 'Categories', url: canonicalUrl });
        break;
      case 'blog':
        title = 'Educational Guides & Math Formulas Blog - SmartCalc Hub';
        description = 'Learn mathematical logic, compound interest formulas, credit card statistics, and advanced system design guidelines.';
        canonicalUrl = 'https://smartcalchub.com/?page=blog';
        breadcrumbsList.push({ name: 'Blog', url: canonicalUrl });
        break;
      case 'article-detail': {
        const article = BLOG_ARTICLES.find(a => a.id === selectedArticleId || a.slug === selectedArticleId);
        if (article) {
          title = `${article.title} | Educational Guide`;
          description = article.excerpt;
          canonicalUrl = `https://smartcalchub.com/?page=article-detail&id=${article.id}`;
          ogType = 'article';
          ogImage = article.imageUrl;

          breadcrumbsList.push({ name: 'Blog', url: 'https://smartcalchub.com/?page=blog' });
          breadcrumbsList.push({ name: article.title, url: canonicalUrl });

          specificSchema = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': article.title,
            'description': article.excerpt,
            'image': article.imageUrl,
            'datePublished': article.date,
            'author': {
              '@type': 'Organization',
              'name': 'SmartCalc Hub Team'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'SmartCalc Hub',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://smartcalchub.com/favicon.svg'
              }
            }
          };
        }
        break;
      }
      case 'tool-detail': {
        const tool = TOOLS.find(t => t.id === selectedToolId);
        if (tool) {
          title = `${tool.name} | Exact 0ms Sandbox - SmartCalc Hub`;
          description = tool.description;
          canonicalUrl = `https://smartcalchub.com/?page=tool-detail&category=${tool.category}&id=${tool.id}`;

          breadcrumbsList.push({ 
            name: `${tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tools`, 
            url: `https://smartcalchub.com/?page=all-tools&category=${tool.category}` 
          });
          breadcrumbsList.push({ name: tool.name, url: canonicalUrl });

          specificSchema = {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': tool.name,
            'description': tool.description,
            'applicationCategory': 'BusinessApplication',
            'operatingSystem': 'All',
            'browserRequirements': 'Requires HTML5 compatible web browser with Javascript enabled.',
            'features': 'Offline support, Client-side calculations, Secure Sandbox, 0ms latency',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            }
          };
        }
        break;
      }
      case 'about':
        title = 'About SmartCalc Hub - Enterprise Grade Sandbox';
        canonicalUrl = 'https://smartcalchub.com/?page=about';
        breadcrumbsList.push({ name: 'About', url: canonicalUrl });
        break;
      case 'contact':
        title = 'Contact Support Desk - SmartCalc Hub';
        canonicalUrl = 'https://smartcalchub.com/?page=contact';
        breadcrumbsList.push({ name: 'Contact', url: canonicalUrl });
        break;
      case 'privacy-policy':
        title = 'Privacy & Security Directives - SmartCalc Hub';
        canonicalUrl = 'https://smartcalchub.com/?page=privacy-policy';
        breadcrumbsList.push({ name: 'Privacy Policy', url: canonicalUrl });
        break;
      case 'terms':
        title = 'Terms of Service Agreements - SmartCalc Hub';
        canonicalUrl = 'https://smartcalchub.com/?page=terms';
        breadcrumbsList.push({ name: 'Terms of Service', url: canonicalUrl });
        break;
      case 'disclaimer':
        title = 'Legal Disclaimer - SmartCalc Hub';
        canonicalUrl = 'https://smartcalchub.com/?page=disclaimer';
        breadcrumbsList.push({ name: 'Disclaimer', url: canonicalUrl });
        break;
      case 'sitemap':
        title = 'HTML Sitemap Directory - SmartCalc Hub';
        canonicalUrl = 'https://smartcalchub.com/?page=sitemap';
        breadcrumbsList.push({ name: 'Sitemap', url: canonicalUrl });
        break;
    }

    // Set page title
    document.title = title;

    // Set canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // Set Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Set Open Graph tags
    const updateOrCreateMeta = (property: string, content: string, isPropertyAttr = true) => {
      const attrName = isPropertyAttr ? 'property' : 'name';
      let element = document.querySelector(`meta[${attrName}="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateOrCreateMeta('og:title', title);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('og:url', canonicalUrl);
    updateOrCreateMeta('og:type', ogType);
    updateOrCreateMeta('og:image', ogImage);

    // Set Twitter tags
    updateOrCreateMeta('twitter:title', title, false);
    updateOrCreateMeta('twitter:description', description, false);
    updateOrCreateMeta('twitter:url', canonicalUrl, false);
    updateOrCreateMeta('twitter:image', ogImage, false);

    // Generate JSON-LD Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbsList.map((crumb, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    };

    const combinedSchemas = [breadcrumbSchema];
    if (specificSchema) {
      combinedSchemas.push(specificSchema);
    }

    // Inject Script Tag
    let schemaScript = document.getElementById('schema-jsonld') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'schema-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(combinedSchemas, null, 2);

  }, [currentPage, selectedCategory, selectedToolId, selectedArticleId]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Render the selected page content
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'all-tools':
        return <AllTools initialCategory={selectedCategory} onNavigate={handleNavigate} />;
      case 'categories':
        return <CategoriesPage onNavigate={handleNavigate} />;
      case 'blog':
        return <Blog onNavigate={handleNavigate} />;
      case 'article-detail':
        return <ArticleDetail articleId={selectedArticleId || ''} onNavigate={handleNavigate} />;
      case 'tool-detail':
        return <ToolDetail toolId={selectedToolId || ''} category={selectedCategory} onNavigate={handleNavigate} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'privacy-policy':
        return <PrivacyPolicy />;
      case 'terms':
        return <Terms />;
      case 'disclaimer':
        return <Disclaimer />;
      case 'sitemap':
        return <SitemapPage onNavigate={handleNavigate} />;
      case 'offline':
        return <OfflinePage onNavigate={handleNavigate} />;
      default:
        return <NotFound onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Splash Screen on load */}
      <SplashScreen />

      {/* Primary Header/Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page, cat) => handleNavigate(page, cat)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenInstall={() => setInstallOpen(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Breadcrumb Navigation - hidden on home page */}
      <Breadcrumb
        currentPage={currentPage}
        currentCategory={selectedCategory}
        currentToolId={selectedToolId}
        currentArticleId={selectedArticleId}
        onNavigate={handleNavigate}
      />

      {/* Main Content Stage */}
      <main className="flex-grow animate-fadeIn">
        {renderPage()}
      </main>

      {/* Footer Utilities */}
      <Footer
        onNavigate={handleNavigate}
        onOpenInstall={() => setInstallOpen(true)}
      />

      {/* App Installation Prompt Overlay */}
      <InstallAppModal
        isOpen={installOpen}
        onClose={() => setInstallOpen(false)}
      />

      {/* Fast search modal trigger */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Keyboard Shortcuts Cheat Sheet */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* Persistent Toast Notification System */}
      <ToastContainer />

      {/* Local Storage Privacy Cookie Consent Banner */}
      <CookieConsent />

      {/* Keyboard Shortcuts Help Button (Floating Action Button) */}
      <button
        onClick={() => setShortcutsOpen(true)}
        className="fixed bottom-16 md:bottom-8 right-20 z-40 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer animate-fadeIn"
        title="View Keyboard Shortcuts Cheat Sheet"
        aria-label="View Keyboard Shortcuts"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {/* Back to top FAB button */}
      <BackToTop />
    </div>
  );
}
