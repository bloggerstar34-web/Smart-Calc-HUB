import React, { useState, useEffect } from 'react';
import { 
  FileText, Copy, Check, Trash2, Clock, AlignLeft, Type, Sparkles, 
  Download, Share2, RefreshCw, ChevronRight, Info, Award, 
  CheckCircle2, HelpCircle, Volume2, BarChart3, ChevronDown, FileOutput, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WordCounterProps {
  onNavigate?: (page: any, category?: any, toolId?: string) => void;
}

// English Stop Words to filter out of Keyword Density for high quality SEO analysis
const STOP_WORDS = new Set([
  'the', 'a', 'and', 'or', 'but', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 
  'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 
  'below', 'from', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 
  'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 
  'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'am', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 
  'doing', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being'
]);

export const WordCounter: React.FC<WordCounterProps> = ({ onNavigate }) => {
  const [text, setText] = useState<string>(
    'SmartCalc Hub is a production-ready Progressive Web App designed for offline productivity. It features over 50 free online tools. Write or paste your copywriting draft right here to start auditing word counts, character counts, keyword density, and Flesch-Kincaid readability in real-time.'
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [targetWords, setTargetWords] = useState<number>(300);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false
  });
  const [shareToast, setShareToast] = useState<boolean>(false);

  // Computed live metrics
  const trimmedText = text.trim();
  const wordsArray = trimmedText ? trimmedText.split(/\s+/) : [];
  const wordsCount = wordsArray.length;
  const charsCount = text.length;
  const charsNoSpaceCount = text.replace(/\s+/g, '').length;
  const spacesCount = charsCount - charsNoSpaceCount;
  
  // Sentences split on punctuation . ! ? with safety guard
  const sentencesCount = trimmedText 
    ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length 
    : 0;

  // Paragraphs split on double or single newlines with safety guard
  const paragraphsCount = trimmedText 
    ? text.split(/\n+/).filter(p => p.trim().length > 0).length 
    : 0;

  // Readability statistics helper
  // Approximate syllables in english words (counting vowel groups)
  const countSyllables = (word: string): number => {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleaned.length <= 3) return 1;
    // Simple vowel cluster match
    const matches = cleaned.match(/[aeiouy]{1,2}/g);
    let count = matches ? matches.length : 1;
    if (cleaned.endsWith('e')) count--; // Silent trailing e
    return count <= 0 ? 1 : count;
  };

  const totalSyllables = wordsArray.reduce((acc, word) => acc + countSyllables(word), 0);

  // Flesch Readability Ease score approximation
  // Score = 206.835 - 1.015 * (total_words / total_sentences) - 84.6 * (total_syllables / total_words)
  let readabilityScore = 100;
  let readabilityGrade = 'Very Easy (Fifth Grade)';
  if (wordsCount > 0 && sentencesCount > 0) {
    const avgSentenceLength = wordsCount / sentencesCount;
    const avgSyllablesPerWord = totalSyllables / wordsCount;
    readabilityScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    readabilityScore = Math.max(0, Math.min(100, Math.round(readabilityScore)));

    if (readabilityScore > 90) readabilityGrade = 'Very Easy (5th Grade level)';
    else if (readabilityScore > 80) readabilityGrade = 'Easy (6th Grade level)';
    else if (readabilityScore > 70) readabilityGrade = 'Fairly Easy (7th Grade level)';
    else if (readabilityScore > 60) readabilityGrade = 'Standard Plain English (8th-9th Grade)';
    else if (readabilityScore > 50) readabilityGrade = 'Fairly Difficult (High School)';
    else if (readabilityScore > 30) readabilityGrade = 'Difficult (College Student)';
    else readabilityGrade = 'Extremely Difficult (Graduate Level)';
  }

  // Estimated reading and speaking speeds
  // Reading standard: 200 Words Per Minute
  const readingTimeMin = Math.max(0, Math.round((wordsCount / 200) * 10) / 10);
  // Speaking standard: 130 Words Per Minute
  const speakingTimeMin = Math.max(0, Math.round((wordsCount / 130) * 10) / 10);

  // Average word length
  const avgWordLength = wordsCount > 0 
    ? Math.round((charsNoSpaceCount / wordsCount) * 10) / 10 
    : 0;

  // Longest word calculation
  const longestWord = wordsArray.reduce((prev, current) => {
    const cleanPrev = prev.replace(/[^a-zA-Z]/g, '');
    const cleanCurrent = current.replace(/[^a-zA-Z]/g, '');
    return cleanCurrent.length > cleanPrev.length ? current : prev;
  }, '');

  // Keyword Density analysis
  const getKeywordDensity = () => {
    const counts: Record<string, number> = {};
    wordsArray.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      if (cleanWord && cleanWord.length > 2 && !STOP_WORDS.has(cleanWord)) {
        counts[cleanWord] = (counts[cleanWord] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([word, count]) => ({
        word,
        count,
        density: wordsCount > 0 ? Math.round((count / wordsCount) * 100 * 10) / 10 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const topKeywords = getKeywordDensity();

  // Text utilities / transforms
  const handleUppercase = () => {
    setText(text.toUpperCase());
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
  };

  const handleTitleCase = () => {
    const titleCased = text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    setText(titleCased);
  };

  const handleSentenceCase = () => {
    let lowercase = text.toLowerCase();
    let sentenceCased = lowercase.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
    setText(sentenceCased);
  };

  const handleStripExtraSpaces = () => {
    const stripped = text.replace(/\s+/g, ' ').trim();
    setText(stripped);
  };

  const handleRemoveEmptyLines = () => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    setText(lines.join('\n'));
  };

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setText('');
  };

  // Download raw text file
  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "draft-document.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Download complete text metrics audit report
  const downloadMetricsReport = () => {
    const reportContent = `=====================================================
SMARTCALC HUB - WORD & CHARACTER COUNTER METRICS REPORT
=====================================================
Date Generated: ${new Date().toLocaleDateString()}
Draft Snippet: "${text.substring(0, 50).replace(/\n/g, ' ')}..."

CORE STATISTICS:
-----------------------------------------------------
• Word Count: ${wordsCount}
• Character Count (With Spaces): ${charsCount}
• Character Count (No Spaces): ${charsNoSpaceCount}
• Spaces: ${spacesCount}
• Sentence Count: ${sentencesCount}
• Paragraph Count: ${paragraphsCount}
• Average Word Length: ${avgWordLength} characters
• Longest Word: "${longestWord.replace(/[^a-zA-Z]/g, '')}" (${longestWord.replace(/[^a-zA-Z]/g, '').length} chars)

READABILITY & SPEECH ENGAGEMENT:
-----------------------------------------------------
• Flesch Reading Ease Score: ${readabilityScore}/100
• Estimated Grade level: ${readabilityGrade}
• Estimated Silent Reading Duration: ~${readingTimeMin} min
• Estimated Public Speaking Duration: ~${speakingTimeMin} min

KEYWORD DENSITY (SEO TARGETING):
-----------------------------------------------------
${topKeywords.length > 0 
  ? topKeywords.map((kw, i) => `${i+1}. "${kw.word}" - ${kw.count} times (${kw.density}% density)`).join('\n')
  : 'No significant high-density keywords detected.'}

=====================================================
Compiled offline-first at https://smartcalchub.com
=====================================================`;

    const element = document.createElement("a");
    const file = new Blob([reportContent], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "word-counter-metrics-report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Social share triggers
  const triggerShare = (platform: 'twitter' | 'linkedin' | 'copy') => {
    const url = 'https://smartcalchub.com/?page=tool-detail&category=text&id=word-counter';
    const desc = 'Free, client-side, zero-latency Word and Character Counter with live readability scoring, keyword density metrics, and offline execution.';
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(desc)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  // JSON-LD Schema for rich SEO Snippets
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Word & Character Counter",
    "description": "Real-time client-side word count, character count, keyword density, and Flesch-Kincaid readability scoring utility.",
    "url": "https://smartcalchub.com/?page=tool-detail&category=text&id=word-counter",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5, Web Cryptography API support",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Real-time character count with and without spaces",
      "Interactive case conversions (Title case, UPPERCASE, sentence case)",
      "Keyword density metrics with stop-words exclusion",
      "Flesch-Kincaid Readability Ease score calculations",
      "Export text and detailed metrics reports",
      "Offline support with PWA caching"
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:text-slate-100" id="word-counter-app">
      {/* Schema Injection */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      {/* Dynamic SEO Breadcrumbs */}
      <div className="mb-6 flex items-center justify-between" id="breadcrumbs-nav">
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <span 
            className="hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors" 
            onClick={() => onNavigate && onNavigate('home')}
          >
            Home
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700" />
          <span 
            className="hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
            onClick={() => onNavigate && onNavigate('tools', 'text')}
          >
            Text Tools
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700" />
          <span className="text-amber-600 dark:text-amber-400 font-bold">Word & Character Counter</span>
        </nav>
        
        {/* Offline & PWA Compliant Tag */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 font-mono tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          SECURE & OFFLINE-READY
        </span>
      </div>

      {/* Main Intro Block */}
      <div className="text-center sm:text-left mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="tool-header">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-3">
            <span className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl shadow-md">
              <FileText className="w-8 h-8" />
            </span>
            Word & Character Counter
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xl">
            Audit word limits, analyze keyword density, format cases, and compute readability grade scores instantly with zero data footprint.
          </p>
        </div>

        {/* Word Count Target Meter */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800/80 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[180px] shadow-sm relative overflow-hidden" id="goal-widget">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
            <Target className="w-3.5 h-3.5 text-amber-500" />
            <span>Target Word Goal</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              value={targetWords}
              onChange={(e) => setTargetWords(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-16 bg-white dark:bg-slate-950 text-center font-bold text-sm px-1 py-0.5 rounded border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-amber-500 dark:text-white"
            />
            <span className="text-xs font-medium text-gray-400">words</span>
          </div>
          <div className="mt-2.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, wordsCount > 0 ? (wordsCount / targetWords) * 100 : 0)}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-mono font-bold mt-1.5 text-slate-500 dark:text-slate-400">
            {Math.round(Math.min(100, wordsCount > 0 ? (wordsCount / targetWords) * 100 : 0))}% Achieved
          </span>
        </div>
      </div>

      {/* Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="workspace">
        
        {/* Left Area: Inputs & Text Tools (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl shadow-xl overflow-hidden relative">
            
            {/* Custom Tool Header inside Box */}
            <div className="bg-gray-50/50 dark:bg-slate-900/50 px-5 py-3 border-b border-gray-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                <AlignLeft className="w-4 h-4 text-amber-500" />
                <span>REAL-TIME EDITING SANDBOX</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all"
                  title="Reset and Clear Workspace"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            {/* Main Interactive TextArea */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your essay, article, draft, script, or copywriting copy here to analyze..."
                className="w-full h-[360px] sm:h-[420px] bg-white dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 font-sans text-sm sm:text-base leading-relaxed p-6 focus:outline-none resize-none placeholder-gray-400 dark:placeholder-gray-600 selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200"
              />
              
              {/* Live Character Overlay */}
              <div className="absolute bottom-4 right-4 text-[10px] font-mono font-bold text-gray-400 dark:text-gray-600 bg-gray-100/55 dark:bg-slate-900/50 px-2 py-1 rounded-md pointer-events-none">
                {charsCount.toLocaleString()} chars
              </div>
            </div>

            {/* Case formatting toolbar */}
            <div className="p-4 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800/60">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2.5">
                Quick Text Case & Cleanup Utilities:
              </span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleUppercase} 
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  UPPERCASE
                </button>
                <button 
                  onClick={handleLowercase} 
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  lowercase
                </button>
                <button 
                  onClick={handleTitleCase} 
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Title Case
                </button>
                <button 
                  onClick={handleSentenceCase} 
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Sentence case
                </button>
                <button 
                  onClick={handleStripExtraSpaces} 
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Strip Extra Spaces
                </button>
                <button 
                  onClick={handleRemoveEmptyLines} 
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Remove Empty Lines
                </button>
              </div>
            </div>
          </div>

          {/* Export Report Panel */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
                <FileOutput className="w-5 h-5" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Export & Download Options</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Save your structured draft or complete detailed copywriting statistics offline.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button 
                onClick={downloadText}
                className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white border border-gray-200 dark:border-slate-700 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .TXT</span>
              </button>
              <button 
                onClick={downloadMetricsReport}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-amber-600 dark:hover:bg-amber-700 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 shadow-md transition-all"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Save Audit Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Area: Dynamic Analytics (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Main 4 core counter cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-900/40 p-5 rounded-2xl text-center relative overflow-hidden group">
              <div className="absolute right-2 top-2 text-amber-500/10 pointer-events-none group-hover:scale-110 transition-transform">
                <FileText className="w-14 h-14" />
              </div>
              <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400 block mb-1">Total Words</span>
              <span className="text-3xl font-extrabold text-amber-950 dark:text-white font-mono block">
                {wordsCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 p-5 rounded-2xl text-center relative overflow-hidden group">
              <div className="absolute right-2 top-2 text-slate-500/10 pointer-events-none group-hover:scale-110 transition-transform">
                <Type className="w-14 h-14" />
              </div>
              <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1 font-sans">Characters</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono block">
                {charsCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 p-5 rounded-2xl text-center relative overflow-hidden group">
              <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1 font-sans">Sentences</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono block">
                {sentencesCount}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800/80 p-5 rounded-2xl text-center relative overflow-hidden group">
              <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 block mb-1 font-sans">Paragraphs</span>
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white font-mono block">
                {paragraphsCount}
              </span>
            </div>
          </div>

          {/* Additional text parameters (spaces, avg word length, etc) */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2.5 border-b border-gray-100 dark:border-slate-800/60 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Advanced Text Metrics</span>
            </h3>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 dark:text-gray-400">Characters (no spaces)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{charsNoSpaceCount}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 dark:text-gray-400">Space Characters</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{spacesCount}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 dark:text-gray-400">Average Word Length</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{avgWordLength} chars</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 dark:text-gray-400">Longest Word</span>
              <span 
                className="font-mono font-bold text-amber-600 dark:text-amber-400 truncate max-w-[150px]"
                title={longestWord}
              >
                {longestWord ? longestWord.replace(/[^a-zA-Z]/g, '') : 'N/A'}
              </span>
            </div>
          </div>

          {/* Reading & Speech Estimates */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2.5 border-b border-gray-100 dark:border-slate-800/60 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Speaking & Reading Times</span>
            </h3>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 block">Speaking Speed (130 WPM)</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                    ~{speakingTimeMin} min {speakingTimeMin > 1 ? 'speech' : 'reading'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 block">Silent Reading (200 WPM)</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                    ~{readingTimeMin} min read
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Flesch Readability Scoring */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2.5 border-b border-gray-100 dark:border-slate-800/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-500" />
                <span>Readability Level</span>
              </span>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg font-bold">
                {readabilityScore}/100
              </span>
            </h3>
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-600 dark:text-gray-400 block mb-1">
                Flesch Reading Ease Grade:
              </span>
              <p className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                {readabilityGrade}
              </p>
              <div className="mt-3.5 bg-gray-150 dark:bg-slate-800 rounded-full h-1.5 w-full">
                <div 
                  className="h-1.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-300"
                  style={{ width: `${readabilityScore}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
                Scores between 60-70 represent standard writing easy for 13-15 year olds to digest offline.
              </p>
            </div>
          </div>

          {/* Keyword Density List */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2.5 border-b border-gray-100 dark:border-slate-800/60 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span>Keyword Density (SEO)</span>
            </h3>
            
            {topKeywords.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-gray-400">Write longer sentences to view high-density search words.</p>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {topKeywords.map((kw, i) => (
                  <div key={kw.word} className="text-xs">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-gray-300 mb-1">
                      <span className="font-mono">#{i+1} {kw.word}</span>
                      <span className="font-semibold">{kw.count}x ({kw.density}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div 
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, kw.density * 5)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Share Box */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-2xl p-5 text-center shadow-md">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-3">Share This Copywriting Tool</span>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => triggerShare('twitter')}
                className="p-2.5 bg-sky-50 dark:bg-sky-950/20 hover:bg-sky-100 text-sky-600 dark:text-sky-400 rounded-xl transition-colors"
                title="Share on Twitter"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => triggerShare('linkedin')}
                className="p-2.5 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 text-blue-700 dark:text-blue-400 rounded-xl transition-colors"
                title="Share on LinkedIn"
              >
                <Award className="w-4 h-4" />
              </button>
              <button 
                onClick={() => triggerShare('copy')}
                className="p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 text-slate-700 dark:text-gray-300 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Copy tool link to clipboard"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>
            </div>
            
            <AnimatePresence>
              {shareToast && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-3 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono"
                >
                  Tool URL copied to clipboard securely!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* SEO Section 1: How to use (staggered list) */}
      <div className="mt-16 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-lg" id="how-to-use">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Info className="w-6 h-6 text-amber-500" />
          How to Use the Word and Character Counter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black">1</div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Input Your Document Copy</h3>
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Paste your writing, school essay, blog draft, metadata snippets, or scripts into the clean editing sandbox. Calculations refresh on every keystroke.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black">2</div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Analyze Live Content Analytics</h3>
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Audit characters with or without spaces, check target metrics progress bars, inspect readability ratios, and track keyword densities.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black">3</div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Format & Export Offline</h3>
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Transform letters to title cases, remove double spaces, copy values instantly, or export your drafted files and reports directly as plain text.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Section 2: Copywriting Benefits (Grid with cards) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8" id="benefits">
        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-gray-150 dark:border-slate-800/60 p-6 sm:p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Optimized for Modern Copywriters
          </h3>
          <ul className="space-y-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>SEO Keyword Density Analysis:</strong> Prevent keyword stuffing by monitoring exactly what percentage of your document consists of critical search phrases.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Flesch Reading Ease:</strong> Ensure your articles target the ideal age group. Standard copywriting scores between 60 and 70 yield clear results for mass markets.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>Social Media Character Caps:</strong> Draft and audit Twitter posts (280 characters), LinkedIn essays, or YouTube titles safely within standard limits.</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-gray-150 dark:border-slate-800/60 p-6 sm:p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-500" />
            100% Secure & Client-Side Sandbox
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            Unlike many online tools, our Word and Character Counter runs entirely inside your browser's local RAM. 
          </p>
          <ul className="space-y-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>No Server Transmission:</strong> Your sensitive reports, proprietary business drafts, or private academic essays are never sent to external servers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>PWA Offline Capability:</strong> Disconnect your internet completely and continue working! The tool caches locally and computes math formulas completely offline.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SEO Section 3: FAQ Accordion */}
      <div className="mt-8 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/60 rounded-3xl p-6 sm:p-10 shadow-lg" id="faq">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-500" />
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {[
            {
              q: "What is the Flesch Reading Ease score?",
              a: "The Flesch Reading Ease score calculates readability on a scale from 1 to 100 based on average sentence lengths and syllable counts per word. Higher scores indicate copy that is much easier to digest, while lower scores represent highly specialized, academic, or professional structures."
            },
            {
              q: "Does this counter support languages other than English?",
              a: "Yes! The core character, word, sentence, and paragraph calculations operate across unicode scripts. However, keyword density lists and Flesch reading ease formula models are specifically optimized for standard English dictionaries and grammar structures."
            },
            {
              q: "Are my pasted texts stored on your database?",
              a: "Absolutely not. SmartCalc Hub operates under a zero-telemetry policy. Your files and characters are strictly processed inside your browser instance locally, protecting you from logs and leaks."
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="border border-gray-100 dark:border-slate-800/80 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }))}
                className="w-full flex items-center justify-between px-5 py-4 bg-gray-50/40 dark:bg-slate-900/40 text-left text-sm font-bold text-slate-800 dark:text-white hover:bg-gray-100/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${faqOpen[idx] ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {faqOpen[idx] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-800 leading-relaxed bg-white dark:bg-slate-950/20">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Section 4: Related Tools */}
      <div className="mt-8 bg-slate-50 dark:bg-slate-900/40 border border-gray-200/50 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8" id="related-tools">
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Related High-Performance Utilities
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          We offer over 50 free, robust tools designed for professional development, secure scripting, and daily calculations. Continue exploring:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate && onNavigate('tool-detail', 'text', 'case-converter')}
            className="p-4 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-sm group"
          >
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">Text Case Converter</h4>
            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">Convert strings to camelCase, UPPERCASE, Title Case and slugs instantly.</p>
          </div>

          <div 
            onClick={() => onNavigate && onNavigate('tool-detail', 'utility', 'password-generator')}
            className="p-4 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-sm group"
          >
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">Secure Password Generator</h4>
            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">Compute cryptographically secure passphrases and entropy-based strings.</p>
          </div>

          <div 
            onClick={() => onNavigate && onNavigate('tool-detail', 'developer', 'json-formatter')}
            className="p-4 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-sm group"
          >
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">JSON Formatter & Validator</h4>
            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">Pretty print, lint, and validate JSON feeds completely client-side.</p>
          </div>

          <div 
            onClick={() => onNavigate && onNavigate('tool-detail', 'developer', 'regex-tester')}
            className="p-4 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl cursor-pointer hover:border-amber-400 transition-all shadow-sm group"
          >
            <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">Regular Expression Debugger</h4>
            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">Test JavaScript regex patterns with live group highlighting and matches.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
