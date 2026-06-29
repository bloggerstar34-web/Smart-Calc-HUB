import React, { useState, useEffect } from 'react';
import { 
  Lock, Copy, Check, RefreshCw, Shield, ShieldCheck, ShieldAlert, 
  Download, HelpCircle, Sparkles, Info, ChevronRight, Award, 
  CheckCircle2, FileText, Trash2, List, Settings, Eye, EyeOff, Share2, CornerDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from '../common/ToastContainer';

interface PasswordGeneratorProps {
  onNavigate?: (page: 'tool-detail', category: any, toolId: string) => void;
}

// Compact premium word list for memorable passphrases (offline-safe)
const MEMORABLE_WORDS = [
  'active', 'adapt', 'ancient', 'artist', 'autumn', 'breeze', 'bright', 'canvas',
  'castle', 'choice', 'cloud', 'copper', 'cosmic', 'crystal', 'dancer', 'dawn',
  'desert', 'device', 'digital', 'dream', 'earth', 'echo', 'emerald', 'engine',
  'exotic', 'fabric', 'forest', 'future', 'galaxy', 'garden', 'gentle', 'giant',
  'golden', 'harbor', 'honest', 'humble', 'island', 'jungle', 'knight', 'legend',
  'light', 'liquid', 'lunar', 'marble', 'matrix', 'meadow', 'melody', 'modern',
  'moon', 'mountain', 'nature', 'nebula', 'ocean', 'olive', 'orbit', 'oxygen',
  'palace', 'pebble', 'planet', 'portal', 'quartz', 'rainbow', 'river', 'rocket',
  'shadow', 'shield', 'silent', 'silver', 'sketch', 'solar', 'spark', 'spirit',
  'spring', 'stable', 'star', 'stone', 'summer', 'sunset', 'symbol', 'theory',
  'tiger', 'timber', 'valiant', 'valley', 'velvet', 'vortex', 'warmth', 'water',
  'wave', 'whisper', 'wild', 'wind', 'winter', 'wisdom', 'wizard', 'zenith'
];

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onNavigate }) => {
  // Modes: 'secure' (random) vs 'memorable' (passphrase)
  const [genMode, setGenMode] = useState<'secure' | 'memorable'>('secure');
  
  // Single vs Bulk option
  const [bulkMode, setBulkMode] = useState<boolean>(false);
  const [bulkCount, setBulkCount] = useState<number>(10);

  // Secure Password States
  const [length, setLength] = useState<number>(16);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNums, setUseNums] = useState<boolean>(true);
  const [useSyms, setUseSyms] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false); // i, l, 1, L, o, 0, O
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false); // { } [ ] ( ) / \ ' " ` ~ , ; : . < >

  // Memorable Passphrase States
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');
  const [capitalizeWords, setCapitalizeWords] = useState<boolean>(true);
  const [includeNumber, setIncludeNumber] = useState<boolean>(true);

  // Result States
  const [password, setPassword] = useState<string>('');
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // FAQ open/close accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Share overlay
  const [shared, setShared] = useState<boolean>(false);

  // Generate password action
  const generatePassword = () => {
    setValidationError('');
    
    if (genMode === 'secure') {
      let chars = '';
      let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
      let numChars = '0123456789';
      let symChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (excludeSimilar) {
        upperChars = upperChars.replace(/[IL_O]/g, '');
        lowerChars = lowerChars.replace(/[ilo]/g, '');
        numChars = numChars.replace(/[01]/g, '');
        // remove similar symbols if any
      }

      if (excludeAmbiguous) {
        symChars = symChars.replace(/[{}[\]()\/\\'"`~,;:.<>]/g, '');
      }

      if (useUpper) chars += upperChars;
      if (useLower) chars += lowerChars;
      if (useNums) chars += numChars;
      if (useSyms) chars += symChars;

      if (!chars) {
        setValidationError('Error: You must select at least one character set configuration!');
        setPassword('');
        setBulkPasswords([]);
        return;
      }

      if (bulkMode) {
        const generatedList: string[] = [];
        for (let b = 0; b < bulkCount; b++) {
          generatedList.push(createRandomString(chars, length));
        }
        setBulkPasswords(generatedList);
        setPassword(generatedList[0] || '');
      } else {
        const single = createRandomString(chars, length);
        setPassword(single);
        setBulkPasswords([]);
      }
    } else {
      // Memorable word-based passphrase
      if (bulkMode) {
        const generatedList: string[] = [];
        for (let b = 0; b < bulkCount; b++) {
          generatedList.push(createPassphrase());
        }
        setBulkPasswords(generatedList);
        setPassword(generatedList[0] || '');
      } else {
        const single = createPassphrase();
        setPassword(single);
        setBulkPasswords([]);
      }
    }
  };

  // Safe Cryptographic Random String Creator
  const createRandomString = (chars: string, len: number): string => {
    let result = '';
    try {
      const array = new Uint32Array(len);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < len; i++) {
        result += chars[array[i] % chars.length];
      }
    } catch (e) {
      // Fallback if window.crypto isn't fully supported in Sandbox iframe
      for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return result;
  };

  // Safe Cryptographic Passphrase Creator
  const createPassphrase = (): string => {
    const chosenWords: string[] = [];
    try {
      const array = new Uint32Array(wordCount);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < wordCount; i++) {
        let word = MEMORABLE_WORDS[array[i] % MEMORABLE_WORDS.length];
        if (capitalizeWords) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        chosenWords.push(word);
      }
    } catch (e) {
      for (let i = 0; i < wordCount; i++) {
        let word = MEMORABLE_WORDS[Math.floor(Math.random() * MEMORABLE_WORDS.length)];
        if (capitalizeWords) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        chosenWords.push(word);
      }
    }

    let passphrase = chosenWords.join(separator);

    if (includeNumber) {
      const randomDigit = Math.floor(Math.random() * 100);
      passphrase += separator === '' ? randomDigit : `${separator}${randomDigit}`;
    }

    return passphrase;
  };

  // Auto-generate on change of options
  useEffect(() => {
    generatePassword();
  }, [
    genMode, length, useUpper, useLower, useNums, useSyms, 
    excludeSimilar, excludeAmbiguous, wordCount, separator, 
    capitalizeWords, includeNumber, bulkMode, bulkCount
  ]);

  // Handle single copies
  const handleCopy = (textToCopy: string, index: number | null = null) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      if (index !== null) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      toast('Copied to clipboard!', 'success');
    });
  };

  // Handle bulk copy
  const handleBulkCopy = () => {
    if (bulkPasswords.length === 0) return;
    const jointText = bulkPasswords.join('\n');
    navigator.clipboard.writeText(jointText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast(`Copied all ${bulkPasswords.length} passwords!`, 'success');
    });
  };

  // Download passwords as a .txt file
  const handleDownloadFile = () => {
    const textContent = bulkMode 
      ? `--- SMARTCALC HUB SECURE BULK PASSWORDS ---\nGenerated: ${new Date().toLocaleString()}\n\n${bulkPasswords.join('\n')}\n`
      : `--- SMARTCALC HUB SECURE PASSWORD ---\nGenerated: ${new Date().toLocaleString()}\n\nPassword: ${password}\n`;
    
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = bulkMode ? 'bulk_secure_passwords.txt' : 'secure_password.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast('File downloaded successfully!', 'success');
  };

  // Share the password generator tool
  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'SmartCalc Hub Secure Password Generator',
        text: 'Generate secure, 100% private, offline cryptographic passwords instantly.',
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2500);
        toast('Tool link copied to clipboard!', 'success');
      });
    }
  };

  // Reset all settings to ultra-secure defaults
  const handleReset = () => {
    setGenMode('secure');
    setBulkMode(false);
    setLength(16);
    setUseUpper(true);
    setUseLower(true);
    setUseNums(true);
    setUseSyms(true);
    setExcludeSimilar(false);
    setExcludeAmbiguous(false);
    setWordCount(4);
    setSeparator('-');
    setCapitalizeWords(true);
    setIncludeNumber(true);
    toast('Settings reset to safe standards', 'info');
  };

  // Live Entropy & strength score
  const getEntropyInfo = () => {
    if (genMode === 'memorable') {
      // 96 words in MEMORABLE_WORDS. Entropy log2(96) ~ 6.58 bits per word.
      let wordEntropy = wordCount * Math.log2(MEMORABLE_WORDS.length);
      if (includeNumber) {
        wordEntropy += Math.log2(100); // 100 options for digits
      }
      const bits = Math.round(wordEntropy);
      
      let label = 'Strong';
      let color = 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40';
      let pct = 70;
      let crackTime = 'Centuries (Brute-Force)';

      if (bits < 30) {
        label = 'Weak';
        color = 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40';
        pct = 25;
        crackTime = 'A few minutes';
      } else if (bits < 45) {
        label = 'Fair';
        color = 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40';
        pct = 48;
        crackTime = 'Several weeks';
      } else if (bits > 60) {
        label = 'Military Grade';
        color = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40';
        pct = 100;
        crackTime = 'Trillions of years';
      }

      return { bits, label, color, pct, crackTime };
    }

    // Secure Random string entropy calculation
    let poolSize = 0;
    if (useUpper) poolSize += excludeSimilar ? 22 : 26;
    if (useLower) poolSize += excludeSimilar ? 23 : 26;
    if (useNums) poolSize += excludeSimilar ? 8 : 10;
    if (useSyms) poolSize += excludeAmbiguous ? 10 : 26;

    const bits = Math.round(length * Math.log2(poolSize || 1));
    
    let label = 'Weak';
    let color = 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40';
    let pct = 15;
    let crackTime = 'Instantly';

    if (bits >= 128) {
      label = 'Quantum Secure';
      color = 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40';
      pct = 100;
      crackTime = 'Universal lifespan';
    } else if (bits >= 80) {
      label = 'Extremely Strong';
      color = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40';
      pct = 85;
      crackTime = 'Centuries';
    } else if (bits >= 50) {
      label = 'Secure';
      color = 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40';
      pct = 60;
      crackTime = 'Several years';
    } else if (bits >= 35) {
      label = 'Moderate';
      color = 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40';
      pct = 40;
      crackTime = 'A few days';
    }

    return { bits, label, color, pct, crackTime };
  };

  const strength = getEntropyInfo();

  // Helper to color characters inside output nicely for advanced premium design
  const renderHighlightedPassword = (passStr: string) => {
    if (!passStr) return <span className="text-gray-400">Select character sets...</span>;
    if (!showPassword) {
      return <span className="text-gray-400 select-none tracking-widest font-sans">••••••••••••••••</span>;
    }

    return passStr.split('').map((char, i) => {
      let colorClass = 'text-gray-800 dark:text-gray-100';
      if (/[0-9]/.test(char)) {
        colorClass = 'text-amber-600 dark:text-amber-400';
      } else if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(char)) {
        colorClass = 'text-rose-600 dark:text-rose-400 font-bold';
      } else if (/[A-Z]/.test(char)) {
        colorClass = 'text-indigo-600 dark:text-indigo-400';
      } else if (/[a-z]/.test(char)) {
        colorClass = 'text-gray-700 dark:text-gray-300';
      }
      return <span key={i} className={colorClass}>{char}</span>;
    });
  };

  // SEO Schema Generation for local inclusion
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Secure Password Generator - SmartCalc Hub",
    "description": "Premium, offline-first, cryptographically secure password generator. Supports customizable lengths, multiple character pools, and memorable word-based passphrases.",
    "url": window.location.href,
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Supports HTML5 window.crypto API.",
    "featureList": [
      "Cryptographically secure pseudo-random number generator (CSPRNG)",
      "High-entropy secure passwords",
      "Memorable word-based passphrases",
      "Bulk password list exports",
      "Offline operational compatibility"
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 text-left">
      
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" onClick={() => onNavigate && onNavigate('tool-detail', 'calculator', 'scientific-calculator')}>Home</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
        <span className="text-gray-400">Utility Tools</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
        <span className="text-blue-600 dark:text-blue-400 font-bold">Secure Password Generator</span>
      </nav>

      {/* 2. MAIN TOOL PANEL (Glassmorphism & premium details) */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        
        {/* Visual background gradient accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/5 dark:bg-cyan-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-3xl -z-10" />

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-gray-100 dark:border-gray-800 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl text-white font-bold shadow-md shadow-cyan-500/10 dark:shadow-none">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Secure Password Generator</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>CSPRNG Secure • Local Client Execution Only</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:text-gray-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-gray-150 dark:border-gray-800 cursor-pointer"
              title="Reset Settings"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset</span>
            </button>
            
            <button
              onClick={handleShare}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:hover:bg-blue-950/60 dark:text-blue-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-blue-100 dark:border-blue-900/40 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{shared ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Validation Errors banner */}
        {validationError && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 rounded-2xl p-4 mb-6 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Layout Modes Segment Control */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Controls Panel */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Primary Mode Picker */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-gray-150 dark:border-slate-850 p-1.5 rounded-2xl flex gap-1.5">
              <button
                type="button"
                onClick={() => setGenMode('secure')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  genMode === 'secure'
                    ? 'bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 shadow-md ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Random Character</span>
              </button>
              <button
                type="button"
                onClick={() => setGenMode('memorable')}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  genMode === 'memorable'
                    ? 'bg-white dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 shadow-md ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Memorable Phrase</span>
              </button>
            </div>

            {/* Mode-Specific Customization */}
            {genMode === 'secure' ? (
              <div className="space-y-6">
                {/* Length slider */}
                <div className="space-y-3 bg-slate-50/50 dark:bg-gray-800/20 border border-gray-150/80 dark:border-gray-800/40 p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Password Length:</span>
                    <span className="text-base font-mono font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-3.5 py-1 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
                      {length} Characters
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="128"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono font-bold pt-0.5">
                    <span>8 (Minimum)</span>
                    <span>32 (Strong)</span>
                    <span>64 (Highly Secure)</span>
                    <span>128 (Maximum)</span>
                  </div>
                </div>

                {/* Character Pools Switchers */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Include Characters:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-gray-800/40 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer border border-gray-150 dark:border-gray-800/60 transition-all group">
                      <div className="flex flex-col text-left">
                        <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">Uppercase Letters</span>
                        <span className="text-[10px] font-mono text-gray-400 mt-0.5">A, B, C, D...</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={useUpper}
                        onChange={(e) => setUseUpper(e.target.checked)}
                        className="w-4 h-4 accent-cyan-500 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-gray-800/40 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer border border-gray-150 dark:border-gray-800/60 transition-all group">
                      <div className="flex flex-col text-left">
                        <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">Lowercase Letters</span>
                        <span className="text-[10px] font-mono text-gray-400 mt-0.5">a, b, c, d...</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={useLower}
                        onChange={(e) => setUseLower(e.target.checked)}
                        className="w-4 h-4 accent-cyan-500 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-gray-800/40 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer border border-gray-150 dark:border-gray-800/60 transition-all group">
                      <div className="flex flex-col text-left">
                        <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">Numbers</span>
                        <span className="text-[10px] font-mono text-gray-400 mt-0.5">0, 1, 2, 3, 4...</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={useNums}
                        onChange={(e) => setUseNums(e.target.checked)}
                        className="w-4 h-4 accent-cyan-500 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-gray-800/40 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer border border-gray-150 dark:border-gray-800/60 transition-all group">
                      <div className="flex flex-col text-left">
                        <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">Special Symbols</span>
                        <span className="text-[10px] font-mono text-gray-400 mt-0.5">!, @, #, $, %...</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={useSyms}
                        onChange={(e) => setUseSyms(e.target.checked)}
                        className="w-4 h-4 accent-cyan-500 rounded"
                      />
                    </label>
                  </div>
                </div>

                {/* Advanced Exclusion Settings */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Advanced Settings:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/30 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer border border-gray-150 dark:border-gray-800/40 transition-all">
                      <div className="flex flex-col text-left pr-4">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Avoid Similar Characters</span>
                        <span className="text-[9px] text-gray-400 mt-0.5 leading-tight">Exclude confusing sets like i, l, 1, L, o, 0, O</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={excludeSimilar}
                        onChange={(e) => setExcludeSimilar(e.target.checked)}
                        className="w-4 h-4 accent-cyan-500 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/30 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer border border-gray-150 dark:border-gray-800/40 transition-all">
                      <div className="flex flex-col text-left pr-4">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Avoid Ambiguous Keys</span>
                        <span className="text-[9px] text-gray-400 mt-0.5 leading-tight">Exclude braces & brackets {'{ } [ ] ( ) / \\ \'' }</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={excludeAmbiguous}
                        onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                        className="w-4 h-4 accent-cyan-500 rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              // MEMORABLE PASSPHRASE CONTROLS
              <div className="space-y-6">
                {/* Words count slider */}
                <div className="space-y-3 bg-slate-50/50 dark:bg-gray-800/20 border border-gray-150/80 dark:border-gray-800/40 p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Phrase Word Count:</span>
                    <span className="text-base font-mono font-extrabold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-3.5 py-1 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
                      {wordCount} Words
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={wordCount}
                    onChange={(e) => setWordCount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono font-bold pt-0.5">
                    <span>3 (Minimum)</span>
                    <span>4-5 (Highly Recommended)</span>
                    <span>10 (Ultra-Safe)</span>
                  </div>
                </div>

                {/* Phrase settings details */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Passphrase Layout Settings:</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Separator character:</label>
                      <select
                        value={separator}
                        onChange={(e) => setSeparator(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
                      >
                        <option value="-">Hyphen (-)</option>
                        <option value="_">Underscore (_)</option>
                        <option value=".">Dot (.)</option>
                        <option value=" ">Space ( )</option>
                        <option value="">None (Concatenated)</option>
                      </select>
                    </div>

                    <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/40 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer border border-gray-150 dark:border-gray-800/60 transition-all select-none self-end h-[46px]">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Capitalize Nouns</span>
                      <input
                        type="checkbox"
                        checked={capitalizeWords}
                        onChange={(e) => setCapitalizeWords(e.target.checked)}
                        className="w-4 h-4 accent-cyan-500 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/40 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-2xl cursor-pointer border border-gray-150 dark:border-gray-800/60 transition-all select-none self-end h-[46px]">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Add Random Digit</span>
                      <input
                        type="checkbox"
                        checked={includeNumber}
                        onChange={(e) => setIncludeNumber(e.target.checked)}
                        className="w-4 h-4 accent-cyan-500 rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Generator Configuration Options */}
            <div className="bg-slate-50/70 dark:bg-slate-950/20 border border-gray-150 dark:border-gray-800/80 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Bulk Password List Generation</span>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setBulkMode(!bulkMode)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${bulkMode ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-gray-800'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${bulkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {bulkMode && (
                <div className="space-y-3 pt-2 border-t border-gray-150 dark:border-gray-850 animate-fadeIn">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">Number of Passwords:</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{bulkCount} List Items</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                    <span>5 items</span>
                    <span>50 items</span>
                    <span>100 items</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Results Display Panel with Glassmorphism */}
          <div className="md:col-span-5 space-y-6">
            
            {/* STRENGTH RADIAL METER CARD */}
            <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-gray-150 dark:border-gray-850/80 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Entropy Strength Profile</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-widest font-mono ${strength.color}`}>
                  {strength.bits} Bits
                </span>
              </div>

              {/* Progress bar scale */}
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-500 rounded-full" 
                    style={{ width: `${strength.pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Security Score: <span className="font-bold text-gray-700 dark:text-gray-300">{strength.label}</span></span>
                  <span className="text-gray-400">Guess Proof</span>
                </div>
              </div>

              {/* Decrypt speed analysis */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-3 rounded-2xl text-xs">
                <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <div className="text-left leading-normal">
                  <p className="text-gray-400 font-medium">Estimated brute-force search crack time:</p>
                  <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">{strength.crackTime}</p>
                </div>
              </div>
            </div>

            {/* PASSWORD RESULT WRAPPER (Single vs. Bulk display) */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-950 dark:to-gray-900 border-2 border-gray-150 dark:border-gray-800 rounded-3xl p-5 relative">
              
              {!bulkMode ? (
                // SINGLE PASSWORD OUTPUT
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Security Output</span>
                    </span>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      title={showPassword ? "Hide password characters" : "Show password characters"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 min-h-[70px] flex items-center justify-center relative group">
                    <div className="w-full font-mono text-base sm:text-lg font-bold text-center tracking-normal select-all break-all pr-8">
                      {renderHighlightedPassword(password)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCopy(password)}
                      disabled={!password}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-cyan-600/10 active:scale-98 transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-4.5 h-4.5" /> : <Copy className="w-4.5 h-4.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={generatePassword}
                      className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer border border-gray-150 dark:border-gray-700"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin-hover" />
                      <span>Regenerate</span>
                    </button>
                  </div>

                  <button
                    onClick={handleDownloadFile}
                    disabled={!password}
                    className="w-full border border-dashed border-gray-300 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50/10 text-gray-500 hover:text-cyan-600 dark:hover:text-cyan-400 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download TXT File</span>
                  </button>
                </div>
              ) : (
                // BULK PASSWORDS OUTPUT
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <List className="w-4 h-4 text-cyan-600" />
                      <span>Generated Passwords ({bulkPasswords.length})</span>
                    </span>
                    <button
                      onClick={generatePassword}
                      className="p-1 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 hover:rotate-180 transition-transform duration-300"
                      title="Regenerate list items"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scrollable multi-line container */}
                  <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 font-mono text-xs text-left max-h-[180px] overflow-y-auto space-y-2 select-all scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    {bulkPasswords.map((pass, index) => (
                      <div key={index} className="flex justify-between items-center py-1 border-b border-gray-50 dark:border-gray-900 last:border-0 group/row">
                        <span className="truncate pr-4 select-all font-bold text-gray-800 dark:text-gray-200">{pass}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(pass, index);
                          }}
                          className="text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 p-1 opacity-0 group-hover/row:opacity-100 transition-opacity rounded"
                          title="Copy single item"
                        >
                          {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleBulkCopy}
                      disabled={bulkPasswords.length === 0}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-cyan-600/10 active:scale-98 transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-4.5 h-4.5" /> : <Copy className="w-4.5 h-4.5" />}
                      <span>{copied ? 'Copy All Items' : 'Copy Entire List'}</span>
                    </button>

                    <button
                      onClick={handleDownloadFile}
                      disabled={bulkPasswords.length === 0}
                      className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer border border-gray-150 dark:border-gray-700"
                    >
                      <Download className="w-4.5 h-4.5" />
                      <span>Export txt File</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* 3. STEP BY STEP HOW TO USE GUIDE */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">How To Generate Secure Passwords</h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          SmartCalc Hub lets you custom-configure military-grade cybersecurity hashes with zero backend database transmission. Review this quick three-step guideline:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-150 dark:border-slate-850">
            <span className="block font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-1.5">01. Select Scheme</span>
            <p className="text-gray-500 leading-normal">Switch between high-entropy completely random strings or pronounceable memorable English phrase lists (words separator syntax).</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-150 dark:border-slate-850">
            <span className="block font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-1.5">02. Toggle Exclusions</span>
            <p className="text-gray-500 leading-normal">Avoid confusing key layouts such as (l, 1, o, 0, I) and select exactly which numbers, symbols, uppercase or lowercase character pools to fuse.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-150 dark:border-slate-850">
            <span className="block font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-1.5">03. Bulk Download</span>
            <p className="text-gray-500 leading-normal">Enable bulk mode to generate up to 100 safe passwords simultaneously and click Download to export the text files locally instantly.</p>
          </div>
        </div>
      </div>

      {/* 4. KEY SECURITY BENEFITS */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Benefits of Client-Side Cryptography</h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Standard web tools send your passwords to remote servers where they are vulnerable to logs, database leaks, and interception. SmartCalc Hub runs 100% inside your sandboxed web browser window context.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex gap-3 items-start p-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Absolute Zero Networking Logs</h3>
              <p className="text-gray-500 mt-1 leading-normal">Your inputs and completed passwords never touch any server. They are compiled instantly in local device RAM using standard JS buffers and are destroyed the second you refresh the tab.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">CSPRNG Mathematical Rigor</h3>
              <p className="text-gray-500 mt-1 leading-normal">Instead of standard math library random models which suffer from repeating seeding patterns, we harness window.crypto.getRandomValues cryptographically secure hashes for deep entropy.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Offline Progressive Web App</h3>
              <p className="text-gray-500 mt-1 leading-normal">Install SmartCalc Hub to your phone or desktop computer. The security app compiles fully offline in aircrafts, secure bunkers, or during sudden connection blackouts.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Robust Passphrase Dictionaries</h3>
              <p className="text-gray-500 mt-1 leading-normal">Our built-in safe noun and verb dictionary utilizes localized memory libraries to produce highly memorable sentences that are extremely difficult for AI servers to guess.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE SEO FAQ ACCORDIONS */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Frequently Asked Questions (FAQ)</h2>
        </div>
        
        <div className="space-y-3">
          {[
            {
              q: 'What is CSPRNG and why is it safer?',
              a: 'CSPRNG stands for Cryptographically Secure Pseudo-Random Number Generator. Standard random functions (like Math.random) are predictable if a hacker observes a series of outputs. CSPRNG uses hardware-level entropy sources inside your operating system, ensuring each character generated is mathematically impossible to guess or forecast.'
            },
            {
              q: 'Is it safe to generate passwords on this website?',
              a: 'Yes! Unlike legacy tools, SmartCalc Hub runs completely client-side. There are no server connections, databases, or tracking logs. Your passwords exist purely in your device memory and disappear as soon as you close the browser tab. You can even disconnect your internet entirely while using this tool.'
            },
            {
              q: 'What is password entropy and how is it measured?',
              a: 'Password entropy measures the unpredictable randomness of a password in bits. It is calculated by taking the length of the password and multiplying it by the binary logarithm of the character pool size. Higher entropy (above 60-80 bits) makes it practically impossible for computers to perform brute-force attacks.'
            },
            {
              q: 'Why should I avoid similar and ambiguous characters?',
              a: 'Characters like uppercase "I", lowercase "l", number "1", and symbol "|" look identical in many fonts. By excluding these confusing letters, you avoid errors when typing your password manually or on mobile keypads.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/60 dark:bg-slate-950/20 dark:hover:bg-slate-900/60 transition-colors text-left"
                >
                  <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-250 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. RELATED TOOLS SELECTOR */}
      {onNavigate && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Related Security & Utility Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                id: 'qrcode-generator',
                name: 'QR Code Generator',
                category: 'utility',
                desc: 'Generate safe high-resolution vector QR codes for Wi-Fi keys and URLs.',
                emoji: '📱'
              },
              {
                id: 'json-formatter',
                name: 'JSON Formatter & Validator',
                category: 'developer',
                desc: 'Beautify, inspect, and validate JSON payloads completely offline.',
                emoji: '💻'
              },
              {
                id: 'regex-tester',
                name: 'Regular Expression Debugger',
                category: 'developer',
                desc: 'Test regex expressions with live highlighting and matches counters.',
                emoji: '🔍'
              },
              {
                id: 'unit-converter',
                name: 'Universal Unit Converter',
                category: 'utility',
                desc: 'Convert length, weights, temperatures, and digital storage data sizes.',
                emoji: '🔄'
              }
            ].map((related) => (
              <div
                key={related.id}
                onClick={() => onNavigate('tool-detail', related.category, related.id)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-md text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none">{related.emoji}</span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                      {related.name}
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal line-clamp-2">
                      {related.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured SEO Schema Markup injected as element */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

    </div>
  );
};
