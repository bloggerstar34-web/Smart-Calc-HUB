import React, { useState, useEffect } from 'react';
import { 
  Search, TrendingUp, Star, LayoutGrid, BookOpen, ShieldCheck, Zap, ArrowRight, CheckCircle, 
  Smartphone, HelpCircle, Shield, Cpu, Lock, Terminal, Sparkles, Flame, Percent, FileCode,
  Share2, ArrowUpRight, Gauge, Layers, Info, Check, Copy, WifiOff, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageType, ToolCategory, ToolItem } from '../types';
import { TOOLS } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import { BLOG_ARTICLES } from '../data/blog';
import { FAQ_ITEMS } from '../data/faq';
import { TESTIMONIALS } from '../data/testimonials';
import { AdBanner } from '../components/common/AdBanner';

interface HomeProps {
  onNavigate: (page: PageType, category?: ToolCategory, toolId?: string) => void;
  onOpenSearch: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenSearch }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Bookmarks & Recents states
  const [bookmarkedTools, setBookmarkedTools] = useState<ToolItem[]>([]);
  const [recentTools, setRecentTools] = useState<ToolItem[]>([]);

  const loadLocalTools = () => {
    const bookmarkIds = JSON.parse(localStorage.getItem('smartcalc_bookmarks') || '[]');
    const recentIds = JSON.parse(localStorage.getItem('smartcalc_recents') || '[]');

    const bookmarked = TOOLS.filter(t => bookmarkIds.includes(t.id));
    const recents = recentIds
      .map((id: string) => TOOLS.find(t => t.id === id))
      .filter((t: any): t is ToolItem => !!t);

    setBookmarkedTools(bookmarked);
    setRecentTools(recents);
  };

  useEffect(() => {
    loadLocalTools();

    window.addEventListener('smartcalc_bookmarks_changed', loadLocalTools);
    window.addEventListener('smartcalc_recents_changed', loadLocalTools);

    return () => {
      window.removeEventListener('smartcalc_bookmarks_changed', loadLocalTools);
      window.removeEventListener('smartcalc_recents_changed', loadLocalTools);
    };
  }, []);

  // Interactive speed battle states
  const [battleRunning, setBattleRunning] = useState(false);
  const [battleType, setBattleType] = useState<'none' | 'cloud' | 'local'>('none');
  const [cloudSteps, setCloudSteps] = useState<string[]>([]);
  const [localSteps, setLocalSteps] = useState<string[]>([]);
  const [cloudMs, setCloudMs] = useState(0);
  const [localMs, setLocalMs] = useState(0);

  // Trending, featured and popular items
  const trendingTools = TOOLS.filter(t => t.trending).slice(0, 4);
  const featuredTools = [
    TOOLS.find(t => t.id === 'password-generator'),
    TOOLS.find(t => t.id === 'word-counter'),
    TOOLS.find(t => t.id === 'qrcode-generator'),
    TOOLS.find(t => t.id === 'age-calculator'),
    ...TOOLS.filter(t => t.featured && t.id !== 'password-generator' && t.id !== 'word-counter' && t.id !== 'qrcode-generator' && t.id !== 'age-calculator')
  ].filter((t): t is typeof TOOLS[0] => !!t).slice(0, 4);
  const latestArticles = BLOG_ARTICLES.slice(0, 3);

  // Quick suggestions for the professional search bar
  const searchSuggestions = ['Mortgage', 'JSON', 'Regex', 'QR Code', 'Secure Passwords', 'Scientific'];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 5000);
    }
  };

  // Run the speed battle comparison simulator
  const runSpeedBattle = async (type: 'cloud' | 'local') => {
    if (battleRunning) return;
    setBattleRunning(true);
    setBattleType(type);
    
    if (type === 'cloud') {
      setCloudSteps([]);
      setCloudMs(0);
      const steps = [
        { text: '📡 Initiating API POST request to cloud gateway...', delay: 250 },
        { text: '🔒 Routing through Secure SSL Handshake & TLS DNS (45ms)...', delay: 350 },
        { text: '⚙️ Initializing Cloud Run serverless instance cold-start (850ms)...', delay: 850 },
        { text: '💾 Querying central database cluster for metadata (180ms)...', delay: 300 },
        { text: '🧪 Parsing variables and computing mathematical formula (10ms)...', delay: 100 },
        { text: '📥 Serializing JSON output and downloading 48KB bundle (210ms)...', delay: 300 },
        { text: '✅ Final rendering updated on viewport!', delay: 150 }
      ];
      
      let currentMs = 0;
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].delay));
        currentMs += steps[i].delay;
        setCloudMs(currentMs);
        setCloudSteps(prev => [...prev, steps[i].text]);
      }
    } else {
      setLocalSteps([]);
      setLocalMs(0);
      const steps = [
        { text: '⚡ Fetching logic directly from cached local service worker...', delay: 10 },
        { text: '🧠 Processing variables in-memory using standard JS V8 engine...', delay: 15 },
        { text: '✅ Math computation rendered instantly (0.12ms CPU cycle)!', delay: 5 }
      ];
      
      let currentMs = 0;
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].delay));
        currentMs += steps[i].delay;
        setLocalMs(currentMs);
        setLocalSteps(prev => [...prev, steps[i].text]);
      }
    }
    setBattleRunning(false);
  };

  // Reset the speed battle
  const resetBattle = () => {
    setBattleType('none');
    setCloudSteps([]);
    setLocalSteps([]);
    setCloudMs(0);
    setLocalMs(0);
    setBattleRunning(false);
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20 overflow-hidden relative">
      
      {/* BACKGROUND FLOATING DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Neon blurred orbs */}
        <div className="absolute top-1/4 left-0 w-[45rem] h-[45rem] rounded-full bg-blue-500/5 dark:bg-blue-500/[0.03] blur-[120px] -translate-x-1/2"></div>
        <div className="absolute top-10 right-0 w-[50rem] h-[50rem] rounded-full bg-indigo-500/5 dark:bg-indigo-500/[0.03] blur-[140px] translate-x-1/3"></div>
        <div className="absolute bottom-1/3 left-1/3 w-[30rem] h-[30rem] rounded-full bg-purple-500/5 dark:bg-purple-500/[0.02] blur-[110px]"></div>

        {/* Floating Shapes */}
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[10%] opacity-20 dark:opacity-30 text-blue-600 dark:text-blue-400 font-mono text-xl"
        >
          √
        </motion.div>
        
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-44 right-[15%] opacity-20 dark:opacity-30 text-indigo-600 dark:text-indigo-400 font-mono text-2xl"
        >
          &#123; &#125;
        </motion.div>

        <motion.div 
          animate={{ 
            rotate: [0, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 left-[8%] opacity-10 dark:opacity-25 text-purple-600 dark:text-purple-400 font-serif text-3xl"
        >
          ∑
        </motion.div>

        <motion.div 
          animate={{ 
            y: [0, -25, 0],
            x: [0, -15, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/3 right-[12%] opacity-15 dark:opacity-30 text-amber-500 dark:text-amber-400 font-sans text-lg font-bold"
        >
          %
        </motion.div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative z-10 pt-10 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-blue-200/50 dark:border-blue-900/30 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-wider shadow-sm hover:scale-105 transition-transform"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="font-mono text-[10px] sm:text-xs">⚡ Version 2.4 - Installed & Runs Fully Offline</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.05] mb-6"
          >
            The Ultimate Toolkit.<br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Works 100% Client-Side.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-sans"
          >
            Instantly run 50+ fully production-ready calculators, code beautifiers, password engines, and SEO systems. Zero servers. Zero tracking. 100% private sandbox in your browser cache.
          </motion.p>

          {/* Professional Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-1000 group-focus-within:opacity-30"></div>
              <button
                onClick={onOpenSearch}
                className="relative w-full flex items-center justify-between px-5 sm:px-6 py-4 bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl shadow-blue-900/5 hover:border-blue-500/50 dark:hover:border-indigo-500/50 text-gray-400 dark:text-gray-500 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 truncate">
                    Search 50+ tools (e.g. mortgage amortization, JSON validator, word counter)...
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 px-2 font-mono text-[10px] font-bold text-gray-400">
                    Ctrl
                  </kbd>
                  <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 px-2 font-mono text-[10px] font-bold text-gray-400">
                    K
                  </kbd>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/10 group-hover:bg-blue-700 transition-colors">
                    Find
                  </span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Quick Suggestions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-2 flex-wrap mb-12"
          >
            <span className="text-[10px] sm:text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mr-1">Trending Searches:</span>
            {searchSuggestions.map((s) => (
              <button
                key={s}
                onClick={onOpenSearch}
                className="text-xs bg-gray-100 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 px-3 py-1 rounded-full border border-gray-200/40 dark:border-slate-800/40 transition-colors cursor-pointer"
              >
                #{s}
              </button>
            ))}
          </motion.div>

          {/* Ads Header banner */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full relative z-10"
          >
            <AdBanner position="header" />
          </motion.div>
        </div>
      </section>

      {/* 1.5 BOOKMARKS & RECENTLY USED SECTION */}
      {(bookmarkedTools.length > 0 || recentTools.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 animate-fadeIn -mt-8 -mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bookmarks Column */}
            {bookmarkedTools.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Your Bookmarked Tools</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookmarkedTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => onNavigate('tool-detail', tool.category, tool.id)}
                      className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/85 rounded-2xl p-4 hover:border-amber-500/50 dark:hover:border-amber-500/30 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[100px]"
                    >
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-blue-600 dark:text-blue-400">
                          {tool.category}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-1 mt-2">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recents Column */}
            {recentTools.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Recently Used Tools</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recentTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => onNavigate('tool-detail', tool.category, tool.id)}
                      className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/85 rounded-2xl p-4 hover:border-blue-500/50 dark:hover:border-blue-500/30 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[100px]"
                    >
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-blue-600 dark:text-blue-400">
                          {tool.category}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-1 mt-2">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 2. REAL-TIME SPEED BATTLE SIMULATOR (STARTUP ACCREDITATION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                <Gauge className="w-3.5 h-3.5 text-blue-400" /> Interactive latency battle
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                Experience the 0ms Difference
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Most web utilities transfer your text, data, or financial rates to servers across continents. Watch how much time is wasted compared to our local, in-memory browser sandbox.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => runSpeedBattle('cloud')}
                  disabled={battleRunning}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    battleType === 'cloud' 
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${battleRunning && battleType === 'cloud' ? 'animate-spin' : ''}`} />
                  Run Cloud API Test
                </button>

                <button
                  onClick={() => runSpeedBattle('local')}
                  disabled={battleRunning}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    battleType === 'local'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 fill-current ${battleRunning && battleType === 'local' ? 'animate-pulse' : ''}`} />
                  Run local Offline Test
                </button>

                {(cloudMs > 0 || localMs > 0) && (
                  <button
                    onClick={resetBattle}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl"
                    title="Reset Simulation"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl p-5 border border-slate-800 font-mono text-[10px] sm:text-xs text-slate-300 min-h-[220px] flex flex-col justify-between shadow-inner relative">
              <div className="absolute top-3 right-4 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
              </div>

              <div className="space-y-2.5">
                <div className="text-slate-500 border-b border-slate-800/60 pb-2 mb-2 flex justify-between items-center">
                  <span>SYSTEM LATENCY MONITOR: {battleType === 'none' ? 'IDLE' : battleType.toUpperCase()}</span>
                  <span className="text-[10px] text-blue-400">SmartCalc OS v2.4</span>
                </div>

                {battleType === 'none' && (
                  <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-2">
                    <Terminal className="w-8 h-8 text-slate-600" />
                    <span>Select an API routing test above to trigger latency diagnostics</span>
                  </div>
                )}

                {battleType === 'cloud' && (
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                    {cloudSteps.map((step, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={idx} 
                        className={`leading-relaxed ${idx === cloudSteps.length - 1 ? 'text-amber-400 font-bold' : ''}`}
                      >
                        {step}
                      </motion.div>
                    ))}
                  </div>
                )}

                {battleType === 'local' && (
                  <div className="space-y-1.5">
                    {localSteps.map((step, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        key={idx} 
                        className={`leading-relaxed ${idx === localSteps.length - 1 ? 'text-emerald-400 font-bold' : ''}`}
                      >
                        {step}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {(cloudMs > 0 || localMs > 0) && (
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-slate-400 font-bold">
                  <span>TOTAL LATENCY ACCUMULATION:</span>
                  <span className={`text-base font-mono ${battleType === 'local' ? 'text-emerald-400' : 'text-amber-500'}`}>
                    {battleType === 'local' ? `${localMs}ms (🚀 INSTANT)` : `${cloudMs}ms (🐌 API LAG)`}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. STATISTICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'CALCULATION TOOLS', value: '50+', sub: 'Math, Finance, Dev, SEO', color: 'border-blue-500/20 text-blue-600 dark:text-blue-400' },
            { label: 'CLIENT-SIDE SPEED', value: '0ms', sub: 'Instant browser compilation', color: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
            { label: 'USER TRANSFERRED DATA', value: '0%', sub: '100% private locally sandboxed', color: 'border-indigo-500/20 text-indigo-600 dark:text-indigo-400' },
            { label: 'SECURE OFFLINE RUNS', value: '100K+', sub: 'Daily browser evaluation pool', color: 'border-purple-500/20 text-purple-600 dark:text-purple-400' },
          ].map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={idx}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-gray-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm text-center flex flex-col justify-between"
            >
              <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</span>
              <span className={`text-3xl sm:text-4xl font-extrabold my-2 ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium leading-tight">{stat.sub}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. TRENDING TOOLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 dark:border-slate-800/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-2xl text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100/50 dark:border-blue-900/20">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Trending Calculators</h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[9px] font-bold uppercase tracking-wider border border-amber-500/20">
                  <Flame className="w-3 h-3 fill-current" /> Hot
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">The most popular math and developer calculators this week</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('all-tools')}
            className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 px-4 py-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl transition-all hover:translate-x-0.5 cursor-pointer"
          >
            See All Tools <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingTools.map((tool, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ 
                y: -6, 
                borderColor: 'rgb(59, 130, 246)',
                boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.05), 0 10px 10px -5px rgba(59, 130, 246, 0.02)'
              }}
              key={tool.id}
              onClick={() => onNavigate('tool-detail', tool.category, tool.id)}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm cursor-pointer flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded-lg">
                    {tool.category}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-slate-800 group-hover:text-blue-500/50 transition-colors">⚡</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mt-4 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">{tool.description}</p>
              </div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 pt-4 border-t border-gray-50 dark:border-slate-800/60">
                Run Tool Offline <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="mb-8 border-b border-gray-100 dark:border-slate-800/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-900/20">
              <LayoutGrid className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Explore by Category</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Discover highly specialized sandboxes grouped by professional needs</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => {
            // Pick corresponding custom visual icon details for modern SaaS look
            const iconPicker = (iconId: string) => {
              switch (iconId) {
                case 'Calculator': return <Cpu className="w-5 h-5 text-blue-500" />;
                case 'Code': return <Terminal className="w-5 h-5 text-indigo-500" />;
                case 'Percent': return <Percent className="w-5 h-5 text-emerald-500" />;
                default: return <FileCode className="w-5 h-5 text-purple-500" />;
              }
            };

            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 15px 30px -10px rgba(99, 102, 241, 0.08)'
                }}
                key={cat.id}
                onClick={() => onNavigate('all-tools', cat.id)}
                className="bg-white/80 dark:bg-slate-900/85 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.02] rounded-full blur-xl pointer-events-none"></div>
                <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-4 border border-gray-100/80 dark:border-slate-800/80 shadow-inner">
                  {iconPicker(cat.icon)}
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">{cat.description}</p>
                
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-xl">
                  {cat.badgeCount} OFFLINE TOOLS
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6. BENTO GRID - WHY CHOOSE US & CORE DIFFERENCES */}
      <section className="bg-slate-50/60 dark:bg-slate-900/30 border-y border-gray-200/50 dark:border-slate-800/60 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-xl">COMPUTATIONAL BLUEPRINT</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-4 mb-4 tracking-tight leading-none">
              Built Different than Server Utilities
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
              SmartCalc Hub isn't just a collection of calculations; it is an optimized web framework executing purely inside standard client browser processes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento block 1 (Large - 8 col) */}
            <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 border border-blue-100/50 dark:border-blue-900/20">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">100% Secure, Sealed client Sandbox</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                  Because we run entirely within browser state containers (0ms server transmission), your confidential financial logs, API passwords, JSON schemas, or cryptographic strings never travel over the wire. This makes SmartCalc Hub fully compliant with enterprise security and SOC2 local privacy metrics.
                </p>
              </div>

              {/* Comparison table inside large bento block */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-800/80 pt-6">
                <div className="bg-red-500/[0.02] dark:bg-red-500/[0.01] border border-red-500/10 rounded-2xl p-4">
                  <span className="text-[10px] font-mono font-bold text-red-500 uppercase block mb-1">Traditional Online Tools:</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Transfers keys & content to backend PHP scripts. Subject to scraping, log leaks, and slow Cloud latency.</p>
                </div>
                <div className="bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] border border-emerald-500/10 rounded-2xl p-4">
                  <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase block mb-1">SmartCalc Hub execution:</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Compiled purely in standard local browser V8 memory. Zero telemetry packets sent. Safely operates in fly-mode.</p>
                </div>
              </div>
            </div>

            {/* Bento block 2 (Medium - 4 col) */}
            <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100/50 dark:border-indigo-900/20">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Progressive Offline Installation</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  No App Store overhead or storage limits. Our lightweight build footprint caches all core scripts automatically, launching immediately with or without network link.
                </p>
              </div>
              <div className="pt-6 border-t border-gray-50 dark:border-slate-800/60 mt-4 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                <span>Runs on Android, iOS, Windows</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Bento block 3 (Medium - 4 col) */}
            <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 border border-purple-100/50 dark:border-purple-900/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Zero Network Latency</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  No server cold starts or database bottlenecks. Computations evaluate instantly at hardware-bound rendering rates.
                </p>
              </div>
              <div className="pt-6 border-t border-gray-50 dark:border-slate-800/60 mt-4 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-bold">
                <span>0ms round-trip lag</span>
              </div>
            </div>

            {/* Bento block 4 (Large - 8 col) */}
            <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/[0.01] rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-100/50 dark:border-emerald-900/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Advanced Service Worker Optimization</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                  When reconnected, our client-side caching module polls for any upstream code releases silently in the background. It refreshes and verifies the local database without ever locking your screen or stopping your calculation flow.
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-4 flex-wrap">
                <span className="text-[10px] bg-slate-100 dark:bg-slate-950 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg font-mono font-bold">SW_UPDATE: COMPLETED</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-950 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg font-mono font-bold">CACHE_VERSION: v2.4_PROD</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-950 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg font-mono font-bold">V8_COMPILATION: TRUE</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FEATURED UTILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 dark:border-slate-800/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-2xl text-purple-600 dark:text-purple-400 shadow-sm border border-purple-100/50 dark:border-purple-900/20">
              <Star className="w-5 h-5 text-purple-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Featured Utilities</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Curated high-performance development and text processing modules</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ 
                y: -6, 
                borderColor: 'rgb(139, 92, 246)',
                boxShadow: '0 20px 25px -5px rgba(139, 92, 246, 0.05), 0 10px 10px -5px rgba(139, 92, 246, 0.02)'
              }}
              key={tool.id}
              onClick={() => onNavigate('tool-detail', tool.category, tool.id)}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm cursor-pointer flex flex-col justify-between h-full group relative overflow-hidden transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50 dark:bg-purple-950/60 px-2 py-1 rounded-lg">
                    {tool.category}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-slate-800 group-hover:text-purple-500/50 transition-colors">★</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mt-4 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{tool.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">{tool.description}</p>
              </div>
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 pt-4 border-t border-gray-50 dark:border-slate-800/60">
                Run Tool Offline <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ads Middle Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <AdBanner position="in-content" />
      </div>

      {/* 8. TESTIMONIALS PORTAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">PROFESSIONAL ENDORSEMENTS</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-4">Why Engineers & Analysts Trust Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={t.id}
              className="bg-white/90 dark:bg-slate-900/90 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-700 transition-all duration-300 relative group"
            >
              <div className="absolute top-4 right-6 text-gray-100 dark:text-slate-850 font-serif text-5xl pointer-events-none group-hover:text-blue-550/10 transition-colors select-none">“</div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed mb-6 relative z-10">
                "{t.comment}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50 dark:border-slate-800/60">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  width={40}
                  height={40}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-gray-200/80 dark:border-slate-700 object-cover flex-shrink-0" 
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">{t.name}</h4>
                  <p className="text-[10px] text-gray-400 truncate">{t.role} • <span className="font-semibold text-gray-500">{t.company}</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. LATEST BLOG ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 dark:border-slate-800/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100/50 dark:border-emerald-900/20">
              <BookOpen className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Educational Guides & Articles</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Deep-dives into mathematical logic, finance formulas, and developer syntax</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('blog')}
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl transition-all hover:translate-x-0.5 cursor-pointer"
          >
            Visit Knowledge Hub <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={article.id}
              onClick={() => onNavigate('article-detail', undefined, undefined, article.id)}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full duration-300"
            >
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-slate-950/20 z-10"></div>
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  width={400}
                  height={176}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-4 left-4 z-20 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-xl shadow-md font-mono">
                  {article.category}
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">{article.date} • {article.readTime}</span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-4 pt-4 border-t border-gray-50 dark:border-slate-800/60">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 10. EXPANDED FAQS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">DOCUMENTATION DESK</span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const isActive = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(isActive ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors text-sm sm:text-base gap-4"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" /> 
                    <span className="leading-tight">{faq.question}</span>
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-black text-xl leading-none select-none">
                    {isActive ? '−' : '+'}
                  </span>
                </button>
                
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="p-5 pt-0 border-t border-gray-50 dark:border-slate-800/60 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed bg-slate-50/40 dark:bg-slate-950/30">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. NEWSLETTER (STARTUP CONVERSION MECHANISM) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden border border-indigo-950">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-indigo-300 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-lg">
              <Sparkles className="w-3.5 h-3.5" /> Static tool updates
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Stay Updated on New Releases</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              We compile and add new offline code converters, interest trackers, and formatting matrices weekly. Join 50,000+ developer sandboxes receiving premium static assets.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@professional-email.com"
                className="bg-white/10 backdrop-blur-md border border-white/15 text-white placeholder-slate-400 rounded-xl px-4 py-3.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white/20 flex-grow"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-600/20 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Join Free <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <AnimatePresence>
              {subscribed && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-400 font-semibold font-mono"
                >
                  🎉 Accreditations received! You are added to the offline release pool.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Ads Footer banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <AdBanner position="footer" />
      </div>

    </div>
  );
};
