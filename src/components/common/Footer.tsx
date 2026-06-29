import React from 'react';
import { Calculator, Heart, ArrowRight, ShieldCheck, Github, Twitter, Facebook, Linkedin, Zap } from 'lucide-react';
import { PageType, ToolCategory } from '../../types';

interface FooterProps {
  onNavigate: (page: PageType, category?: ToolCategory, toolId?: string) => void;
  onOpenInstall: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenInstall }) => {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand Info & Offline status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                SmartCalc <span className="text-blue-500">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Production-ready Progressive Web App (PWA) delivering over 50+ free, offline calculators, developer tools, SEO analyzers, and image resizers. Built with privacy-first browser execution.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-emerald-400 font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>100% Offline Capable • Zero External Server Telemetry</span>
            </div>
            <div className="pt-4 flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white transition-colors" aria-label="GitHub"><Github className="w-4 h-4" /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-blue-600 transition-colors" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-blue-500 transition-colors" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wide text-sm uppercase">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors">Home Page</button></li>
              <li><button onClick={() => onNavigate('all-tools')} className="hover:text-blue-400 transition-colors">All 50+ Tools Directory</button></li>
              <li><button onClick={() => onNavigate('categories')} className="hover:text-blue-400 transition-colors">Tool Categories</button></li>
              <li><button onClick={() => onNavigate('blog')} className="hover:text-blue-400 transition-colors">Educational Articles</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition-colors">About Our Team</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors">Contact & Support</button></li>
              <li><button onClick={() => onNavigate('sitemap')} className="hover:text-blue-400 transition-colors">HTML Sitemap</button></li>
            </ul>
          </div>

          {/* Col 3: Popular Tools */}
          <div className="space-y-3">
            <h4 className="text-white font-bold tracking-wide text-sm uppercase">Trending Calculators</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onNavigate('tool-detail', 'calculator', 'age-calculator')} className="hover:text-blue-400 transition-colors">Exact Age Calculator</button></li>
              <li><button onClick={() => onNavigate('tool-detail', 'calculator', 'scientific-calculator')} className="hover:text-blue-400 transition-colors">Scientific Calculator</button></li>
              <li><button onClick={() => onNavigate('tool-detail', 'calculator', 'mortgage-calculator')} className="hover:text-blue-400 transition-colors">Mortgage Amortization Calc</button></li>
              <li><button onClick={() => onNavigate('tool-detail', 'developer', 'json-formatter')} className="hover:text-blue-400 transition-colors">JSON Formatter & Validator</button></li>
              <li><button onClick={() => onNavigate('tool-detail', 'developer', 'regex-tester')} className="hover:text-blue-400 transition-colors">RegExp Debugger</button></li>
              <li><button onClick={() => onNavigate('tool-detail', 'text', 'word-counter')} className="hover:text-blue-400 transition-colors">Word & Char Counter</button></li>
              <li><button onClick={() => onNavigate('tool-detail', 'utility', 'password-generator')} className="hover:text-blue-400 transition-colors">Secure Password Generator</button></li>
              <li><button onClick={() => onNavigate('tool-detail', 'utility', 'qrcode-generator')} className="hover:text-blue-400 transition-colors">QR Code Generator</button></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Install */}
          <div className="space-y-4">
            <h4 className="text-white font-bold tracking-wide text-sm uppercase">Offline Updates</h4>
            <p className="text-xs text-gray-400">
              Install our PWA to your desktop or mobile screen for instant offline access without visiting the App Store.
            </p>
            <button
              onClick={onOpenInstall}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              <Zap className="w-4 h-4 fill-current" /> Install SmartCalc PWA
            </button>
            <div className="pt-2">
              <span className="text-xs text-gray-400 font-semibold block mb-2">Subscribe to Tool Releases:</span>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  required
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 flex-1 min-w-0"
                />
                <button type="submit" className="p-2 bg-slate-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-xl transition-colors" aria-label="Subscribe">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Legal & Copyright Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <button onClick={() => onNavigate('privacy-policy')} className="hover:text-gray-300 transition-colors">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-gray-300 transition-colors">Terms & Conditions</button>
            <span>•</span>
            <button onClick={() => onNavigate('disclaimer')} className="hover:text-gray-300 transition-colors">Disclaimer</button>
            <span>•</span>
            <button onClick={() => onNavigate('offline')} className="hover:text-gray-300 transition-colors">Offline Mode</button>
          </div>
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} SmartCalc Hub. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for the universal web.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
