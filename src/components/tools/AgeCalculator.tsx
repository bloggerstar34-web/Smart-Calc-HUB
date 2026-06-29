import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, Copy, Share2, Printer, Download, RefreshCw, AlertCircle, Check, 
  HelpCircle, Sparkles, Star, Award, Heart, Info, ChevronRight, Share, FileText, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgeCalculatorProps {
  id?: string;
  onNavigate?: (page: 'tool-detail', category: any, toolId: string) => void;
}

interface ZodiacInfo {
  sign: string;
  symbol: string;
  emoji: string;
  element: string;
  ruler: string;
  stone: string;
  color: string;
  compatibility: string;
  traits: string;
}

export const AgeCalculator: React.FC<AgeCalculatorProps> = ({ id, onNavigate }) => {
  // Input states
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('00:00');
  const [targetDate, setTargetDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [targetTime, setTargetTime] = useState('23:59');
  const [useCurrentTime, setUseCurrentTime] = useState(true);

  // Verification & feedback states
  const [error, setError] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [liveMode, setLiveMode] = useState(false);

  // Calculation Results
  const [results, setResults] = useState<{
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
    nextBdayCountdown: {
      months: number;
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
      totalDays: number;
    };
    dayOfBirth: string;
    birthDayOfYear: number;
    isLeapYear: boolean;
    zodiac: ZodiacInfo;
  } | null>(null);

  // Interval for ticking age
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getZodiacSign = (dateStr: string): ZodiacInfo => {
    const date = new Date(dateStr);
    const m = date.getMonth() + 1;
    const d = date.getDate();

    if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) {
      return {
        sign: 'Capricorn',
        symbol: '♑',
        emoji: '🐐',
        element: 'Earth',
        ruler: 'Saturn',
        stone: 'Garnet',
        color: 'Dark Brown / Charcoal',
        compatibility: 'Taurus, Virgo',
        traits: 'Disciplined, ambitious, patient, and highly practical.'
      };
    } else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) {
      return {
        sign: 'Aquarius',
        symbol: '♒',
        emoji: '🏺',
        element: 'Air',
        ruler: 'Uranus',
        stone: 'Amethyst',
        color: 'Electric Blue',
        compatibility: 'Gemini, Libra',
        traits: 'Innovative, original, independent, and humanitarian.'
      };
    } else if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) {
      return {
        sign: 'Pisces',
        symbol: '♓',
        emoji: '🐟',
        element: 'Water',
        ruler: 'Neptune',
        stone: 'Aquamarine',
        color: 'Sea Green',
        compatibility: 'Cancer, Scorpio',
        traits: 'Compassionate, artistic, intuitive, and wise.'
      };
    } else if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) {
      return {
        sign: 'Aries',
        symbol: '♈',
        emoji: '🐏',
        element: 'Fire',
        ruler: 'Mars',
        stone: 'Diamond',
        color: 'Red',
        compatibility: 'Leo, Sagittarius',
        traits: 'Eager, dynamic, quick, and highly competitive.'
      };
    } else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) {
      return {
        sign: 'Taurus',
        symbol: '♉',
        emoji: '🐂',
        element: 'Earth',
        ruler: 'Venus',
        stone: 'Emerald',
        color: 'Green',
        compatibility: 'Virgo, Capricorn',
        traits: 'Strong, dependable, sensual, and creative.'
      };
    } else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) {
      return {
        sign: 'Gemini',
        symbol: '♊',
        emoji: '♊',
        element: 'Air',
        ruler: 'Mercury',
        stone: 'Pearl',
        color: 'Yellow',
        compatibility: 'Libra, Aquarius',
        traits: 'Versatile, expressive, curious, and kind.'
      };
    } else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) {
      return {
        sign: 'Cancer',
        symbol: '♋',
        emoji: '🦀',
        element: 'Water',
        ruler: 'Moon',
        stone: 'Ruby',
        color: 'White / Silver',
        compatibility: 'Scorpio, Pisces',
        traits: 'Intuitive, sentimental, compassionate, and protective.'
      };
    } else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) {
      return {
        sign: 'Leo',
        symbol: '♌',
        emoji: '🦁',
        element: 'Fire',
        ruler: 'Sun',
        stone: 'Peridot',
        color: 'Gold',
        compatibility: 'Aries, Sagittarius',
        traits: 'Dramatic, outgoing, self-assured, and generous.'
      };
    } else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) {
      return {
        sign: 'Virgo',
        symbol: '♍',
        emoji: '♍',
        element: 'Earth',
        ruler: 'Mercury',
        stone: 'Sapphire',
        color: 'Grey / Pale Yellow',
        compatibility: 'Taurus, Capricorn',
        traits: 'Loyal, analytical, kind, and hardworking.'
      };
    } else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) {
      return {
        sign: 'Libra',
        symbol: '♎',
        emoji: '⚖️',
        element: 'Air',
        ruler: 'Venus',
        stone: 'Opal',
        color: 'Pink / Blue',
        compatibility: 'Gemini, Aquarius',
        traits: 'Diplomatic, gracious, peaceful, and artistic.'
      };
    } else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) {
      return {
        sign: 'Scorpio',
        symbol: '♏',
        emoji: '🦂',
        element: 'Water',
        ruler: 'Pluto',
        stone: 'Topaz',
        color: 'Scarlet / Rust',
        compatibility: 'Cancer, Pisces',
        traits: 'Passionate, stubborn, resourceful, and brave.'
      };
    } else {
      return {
        sign: 'Sagittarius',
        symbol: '♐',
        emoji: '🏹',
        element: 'Fire',
        ruler: 'Jupiter',
        stone: 'Turquoise',
        color: 'Blue',
        compatibility: 'Aries, Leo',
        traits: 'Extroverted, optimistic, funny, and generous.'
      };
    }
  };

  const calculateAge = () => {
    if (!birthDate) {
      setError('Please provide a valid date of birth.');
      return;
    }

    const birthStamp = new Date(`${birthDate}T${birthTime}`);
    const currentStamp = useCurrentTime ? new Date() : new Date(`${targetDate}T${targetTime}`);

    if (isNaN(birthStamp.getTime())) {
      setError('Invalid Birth Date value.');
      return;
    }
    if (isNaN(currentStamp.getTime())) {
      setError('Invalid Target Calculation Date.');
      return;
    }

    if (birthStamp > currentStamp) {
      setError('Birth date cannot be in the future relative to the calculation date.');
      setIsCalculated(false);
      return;
    }

    setError('');

    // Exact chronological calculation
    let years = currentStamp.getFullYear() - birthStamp.getFullYear();
    let months = currentStamp.getMonth() - birthStamp.getMonth();
    let days = currentStamp.getDate() - birthStamp.getDate();

    if (days < 0) {
      const prevMonth = new Date(currentStamp.getFullYear(), currentStamp.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    const totalMs = currentStamp.getTime() - birthStamp.getTime();
    const totalSeconds = Math.floor(totalMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Number((totalDays / 7).toFixed(1));
    const totalMonths = (years * 12) + months;

    // Next Birthday Countdown
    let nextBdayYear = currentStamp.getFullYear();
    let nextBday = new Date(nextBdayYear, birthStamp.getMonth(), birthStamp.getDate(), birthStamp.getHours(), birthStamp.getMinutes());
    if (nextBday < currentStamp) {
      nextBdayYear++;
      nextBday = new Date(nextBdayYear, birthStamp.getMonth(), birthStamp.getDate(), birthStamp.getHours(), birthStamp.getMinutes());
    }

    const msToNext = nextBday.getTime() - currentStamp.getTime();
    const nextSec = Math.floor(msToNext / 1000);
    const nextMin = Math.floor(nextSec / 60);
    const nextHr = Math.floor(nextMin / 60);
    const nextDy = Math.floor(nextHr / 24);

    const bdayCountdown = {
      months: Math.floor(nextDy / 30.4375), // approximate average month length
      days: nextDy % 30,
      hours: nextHr % 24,
      minutes: nextMin % 60,
      seconds: nextSec % 60,
      totalDays: nextDy
    };

    // Day of Birth
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfBirth = dayNames[birthStamp.getDay()];

    // Leap Year checks
    const birthYear = birthStamp.getFullYear();
    const isLeapYear = (birthYear % 4 === 0 && birthYear % 100 !== 0) || (birthYear % 400 === 0);

    // Birth day of year
    const startOfYear = new Date(birthYear, 0, 1);
    const diff = birthStamp.getTime() - startOfYear.getTime();
    const birthDayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

    setResults({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBdayCountdown: bdayCountdown,
      dayOfBirth,
      birthDayOfYear,
      isLeapYear,
      zodiac: getZodiacSign(birthDate)
    });

    setIsCalculated(true);
  };

  // Start real-time tick if calculation date is current
  useEffect(() => {
    if (isCalculated && useCurrentTime) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        calculateAge();
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCalculated, useCurrentTime, birthDate, birthTime]);

  const handleReset = () => {
    setBirthDate('');
    setBirthTime('00:00');
    setTargetDate(() => {
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    setTargetTime('23:59');
    setUseCurrentTime(true);
    setIsCalculated(false);
    setResults(null);
    setError('');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const copySummaryText = () => {
    if (!results) return;
    const text = `SmartCalc Hub - Exact Age Report 📝
----------------------------------
📅 Date of Birth: ${birthDate} at ${birthTime}
⏳ Age: ${results.years} Years, ${results.months} Months, ${results.days} Days
🔢 Total Days Alive: ${results.totalDays.toLocaleString()} Days
🚀 Cumulative Stats:
  - Months: ${results.totalMonths.toLocaleString()}
  - Weeks: ${results.totalWeeks.toLocaleString()}
  - Hours: ${results.totalHours.toLocaleString()}
  - Minutes: ${results.totalMinutes.toLocaleString()}
  - Seconds: ${results.totalSeconds.toLocaleString()}
🎂 Next Birthday: In ${results.nextBdayCountdown.totalDays} Days
🌟 Day of Birth: ${results.dayOfBirth}
💫 Zodiac Sign: ${results.zodiac.sign} (${results.zodiac.symbol} ${results.zodiac.emoji})
❄️ Born in Leap Year: ${results.isLeapYear ? 'Yes' : 'No'}
----------------------------------
Calculated instantly and privately at SmartCalc Hub.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareSummary = () => {
    if (!results) return;
    if (navigator.share) {
      navigator.share({
        title: 'SmartCalc Hub Exact Age Report',
        text: `I am ${results.years} years, ${results.months} months, and ${results.days} days old! Total days alive: ${results.totalDays.toLocaleString()}. Calculated fully client-side on SmartCalc.`,
        url: window.location.href
      }).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }).catch(() => {
        copySummaryText();
      });
    } else {
      copySummaryText();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id={id} className="space-y-8 select-none">
      
      {/* 1. INPUT CARD */}
      <div className="bg-slate-50 dark:bg-slate-950/60 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-slate-800/80 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.01] rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200/50 dark:border-slate-800/50 pb-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Enter Demographics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          
          {/* Birth date and time */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5">Date of Birth (DOB) *</label>
              <div className="relative">
                <input 
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5">Time of Birth (Optional)</label>
              <input 
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
              />
            </div>
          </div>

          {/* Target calculate date */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">Calculate Age At</label>
              <button 
                type="button"
                onClick={() => setUseCurrentTime(!useCurrentTime)}
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border transition-all ${
                  useCurrentTime 
                    ? 'bg-blue-600/10 border-blue-600/30 text-blue-600 dark:text-blue-400' 
                    : 'bg-slate-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500'
                }`}
              >
                {useCurrentTime ? '🔴 LIVE NOW' : 'SPECIFY DATE'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {!useCurrentTime ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <input 
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                  />
                  <input 
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                  />
                </motion.div>
              ) : (
                <div className="h-[92px] flex items-center justify-center border border-dashed border-gray-200 dark:border-slate-800 rounded-xl bg-gray-100/50 dark:bg-slate-900/30">
                  <span className="text-xs font-mono font-bold text-gray-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 animate-spin text-blue-500" /> System Time Synced Locally
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {error && (
          <div className="mt-4 p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8 flex gap-3 flex-wrap">
          <button
            onClick={calculateAge}
            className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-600/10 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 fill-current text-white/80" /> Compute Age Profile
          </button>
          
          <button
            onClick={handleReset}
            className="px-5 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>

      </div>

      {/* 2. RESULTS CONTAINER */}
      <AnimatePresence>
        {isCalculated && results && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            
            {/* Primary Highlight Card */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="text-[10px] font-mono font-bold tracking-widest text-blue-200 uppercase">Exact Chronological Age</span>
                <div className="flex gap-2">
                  <button 
                    onClick={copySummaryText}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    title="Copy Profile Summary"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={shareSummary}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    title="Share Profile Summary"
                  >
                    {shared ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    title="Print / Save PDF Report"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center sm:text-left sm:flex sm:items-center sm:gap-12">
                <div>
                  <div className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">{results.years}</div>
                  <div className="text-xs sm:text-sm font-mono font-bold tracking-wider text-blue-100 mt-2 uppercase">Years</div>
                </div>
                <div>
                  <div className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">{results.months}</div>
                  <div className="text-xs sm:text-sm font-mono font-bold tracking-wider text-blue-100 mt-2 uppercase">Months</div>
                </div>
                <div>
                  <div className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">{results.days}</div>
                  <div className="text-xs sm:text-sm font-mono font-bold tracking-wider text-blue-100 mt-2 uppercase">Days</div>
                </div>
              </div>

              {useCurrentTime && (
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-blue-100/90 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                  <span>Ticking age live: {results.totalSeconds.toLocaleString()} seconds elapsed since birth!</span>
                </div>
              )}
            </div>

            {/* Breakdowns & Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Total breakdown */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">Cumulative Calculations</span>
                  
                  <div className="space-y-3.5">
                    {[
                      { label: 'Total Months', value: results.totalMonths.toLocaleString(), unit: 'Months' },
                      { label: 'Total Weeks', value: results.totalWeeks.toLocaleString(), unit: 'Weeks' },
                      { label: 'Total Days', value: results.totalDays.toLocaleString(), unit: 'Days' },
                      { label: 'Total Hours', value: results.totalHours.toLocaleString(), unit: 'Hours' },
                      { label: 'Total Minutes', value: results.totalMinutes.toLocaleString(), unit: 'Min' },
                      { label: 'Total Seconds', value: results.totalSeconds.toLocaleString(), unit: 'Sec' },
                    ].map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-slate-800/50 pb-2">
                        <span className="font-medium text-gray-500">{row.label}</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 text-[10px] text-gray-400 font-medium">
                  * Average month length calculated as 30.4375 days.
                </div>
              </div>

              {/* Card 2: Next birthday countdown */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Next Birthday Countdown</span>
                    <span className="text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      In {results.nextBdayCountdown.totalDays} Days
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    {[
                      { label: 'Months', val: results.nextBdayCountdown.months },
                      { label: 'Days', val: results.nextBdayCountdown.days },
                      { label: 'Hours', val: results.nextBdayCountdown.hours },
                      { label: 'Minutes', val: results.nextBdayCountdown.minutes },
                    ].map((box, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-850">
                        <span className="block text-2xl font-black text-gray-900 dark:text-white leading-none font-mono">{box.val}</span>
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mt-1 block">{box.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800/60 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  <Star className="w-4.5 h-4.5 text-amber-500 fill-current" />
                  <span>Next milestone: {results.years + 1} Years Old!</span>
                </div>
              </div>

              {/* Card 3: Astrological & Leap Year profile */}
              <div className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-4">Astrological & Leap Year Profile</span>
                  
                  <div className="flex items-center gap-3.5 bg-indigo-50/50 dark:bg-slate-950 p-4 rounded-2xl border border-indigo-100/10 mb-4">
                    <span className="text-3xl select-none leading-none">{results.zodiac.emoji}</span>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5 leading-none">
                        {results.zodiac.sign} <span className="text-indigo-600 dark:text-indigo-400 font-normal">{results.zodiac.symbol}</span>
                      </h4>
                      <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mt-1">Element: {results.zodiac.element} • Ruler: {results.zodiac.ruler}</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800/50">
                      <span className="font-medium text-gray-500">Day of Birth</span>
                      <span className="font-bold text-gray-900 dark:text-white">{results.dayOfBirth}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800/50">
                      <span className="font-medium text-gray-500">Day of the Year</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{results.birthDayOfYear} of 365</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800/50">
                      <span className="font-medium text-gray-500">Born in Leap Year?</span>
                      <span className={`font-bold px-2 py-0.5 rounded-md ${results.isLeapYear ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                        {results.isLeapYear ? 'Yes (366 Days)' : 'No (365 Days)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-slate-950 p-2.5 rounded-xl">
                  "{results.zodiac.traits}"
                </div>
              </div>

            </div>

            {/* Custom Print / Report Frame */}
            <div className="hidden print:block print:bg-white print:text-black print:p-8 space-y-6">
              <div className="text-center border-b-2 border-black pb-4">
                <h1 className="text-2xl font-black uppercase tracking-widest">Chronological Age Report</h1>
                <p className="text-xs font-mono">Generated fully client-side via SmartCalc Hub</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-bold">Demographics:</p>
                  <ul className="list-disc pl-5">
                    <li>Birthdate: {birthDate} at {birthTime}</li>
                    <li>Day of Birth: {results.dayOfBirth}</li>
                    <li>Leap Year Birth: {results.isLeapYear ? 'Yes' : 'No'}</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold">Zodiac Details:</p>
                  <ul className="list-disc pl-5">
                    <li>Sign: {results.zodiac.sign}</li>
                    <li>Element: {results.zodiac.element}</li>
                    <li>Ruler: {results.zodiac.ruler}</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-black pt-4">
                <p className="font-black text-lg">Calculated Age: {results.years} Years, {results.months} Months, {results.days} Days</p>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div>Total Days: {results.totalDays.toLocaleString()}</div>
                  <div>Total Hours: {results.totalHours.toLocaleString()}</div>
                  <div>Total Minutes: {results.totalMinutes.toLocaleString()}</div>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. PRINTING MEDIA QUERY STYLE OVERRIDES */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* 4. EDUCATIONAL DOCUMENTATION SECTIONS */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 mt-12">
        
        {/* How To Use */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">How To Use the Age Calculator</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Quickly check chronological details by completing these three quick steps:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-850">
              <span className="block font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">01. Choose DOB</span>
              <p className="text-gray-500">Pick your birth date and optional exact birth time to start live millisecond computation.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-850">
              <span className="block font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">02. Set Compare Date</span>
              <p className="text-gray-500">Compare with current live device clocks or specify any exact past or future date.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-850">
              <span className="block font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">03. Review Profile</span>
              <p className="text-gray-500">Instantly inspect next birthdays, Chinese/Western zodiac traits, and exact cumulative seconds.</p>
            </div>
          </div>
        </div>

        {/* Benefits of Client-Side Age Calculations */}
        <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Benefits of Using SmartCalc Hub</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Our Exact Age Calculator is compiled to run fully inside local client memory. Here are the core benefits:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex gap-2.5 items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Absolute Local Privacy</h4>
                <p className="text-gray-500">Zero database logging. Since calculation values never hit external networks, it is completely secure and safe.</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Hardware Bound Speeds</h4>
                <p className="text-gray-500">Instantly processes chronological intervals without waiting for server response loops or API lag.</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Offline Availability</h4>
                <p className="text-gray-500">Works fully inside cellars, airplanes, or deep subways without internet signal.</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Astrology & Leap Year Sync</h4>
                <p className="text-gray-500">Integrated celestial calculations, day of week indicators, and exact calendar checks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-850">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Is my Birth Date private?</h4>
              <p className="text-gray-500">Yes, completely. There are no server trackers, analytic cookies, or cloud database storage layers. Everything resolves locally on your phone or computer.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-850">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">How is Leap Year checked?</h4>
              <p className="text-gray-500">We run standard mathematical calculations checking divisible bounds: year must be divisible by 4, not by 100 unless also divisible by 400.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-850">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">How can I download the report as a PDF?</h4>
              <p className="text-gray-500">Simply click the print icon or standard PDF download button. Select "Save as PDF" as the target destination in your browser's printing dialogue menu.</p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        {onNavigate && (
          <div className="space-y-4 pt-8 border-t border-gray-50 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Related Calculation Tools</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'bmi-calculator',
                  name: 'BMI Calculator',
                  category: 'calculator',
                  desc: 'Calculate Body Mass Index and determine healthy weight zones.',
                  emoji: '⚖️'
                },
                {
                  id: 'scientific-calculator',
                  name: 'Scientific Calculator',
                  category: 'calculator',
                  desc: 'Run advanced math, trigonometry, log, and root computations.',
                  emoji: '🧮'
                },
                {
                  id: 'mortgage-calculator',
                  name: 'Mortgage Calculator',
                  category: 'calculator',
                  desc: 'Compute monthly mortgage payments with dynamic amortization.',
                  emoji: '🏠'
                },
                {
                  id: 'discount-calculator',
                  name: 'Shopping Discount Calc',
                  category: 'calculator',
                  desc: 'Calculate final prices after store promo codes and discounts.',
                  emoji: '🏷️'
                }
              ].map((related) => (
                <div
                  key={related.id}
                  onClick={() => onNavigate('tool-detail', related.category, related.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none">{related.emoji}</span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
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

      </div>

    </div>
  );
};
