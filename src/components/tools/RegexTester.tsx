import React, { useState } from 'react';
import { Terminal, Check, AlertCircle, Sparkles, Filter } from 'lucide-react';

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Contact us at support@smartcalchub.com or hello@example.org for offline PWA help. Invalid email: john@doe');

  let matches: string[] = [];
  let error: string | null = null;

  try {
    if (pattern) {
      const regex = new RegExp(pattern, flags);
      if (flags.includes('g')) {
        matches = testString.match(regex) || [];
      } else {
        const m = testString.match(regex);
        matches = m ? [m[0]] : [];
      }
    }
  } catch (err: any) {
    error = err.message;
  }

  const toggleFlag = (f: string) => {
    if (flags.includes(f)) {
      setFlags(flags.replace(f, ''));
    } else {
      setFlags(flags + f);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-2xl text-purple-600 dark:text-purple-400 font-bold">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Regular Expression Debugger</h3>
            <span className="text-xs text-gray-500">Live V8 RegExp execution</span>
          </div>
        </div>
        <span className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-xl">
          {matches.length} Matches Found
        </span>
      </div>

      <div className="space-y-6">
        {/* Pattern & Flags Bar */}
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Regular Expression Pattern:</label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full flex items-center bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-2 font-mono text-sm">
              <span className="text-gray-400 font-bold select-none mr-1">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="regex pattern..."
                className="w-full bg-transparent text-gray-900 dark:text-emerald-400 font-bold focus:outline-none"
              />
              <span className="text-gray-400 font-bold select-none ml-1">/{flags}</span>
            </div>

            {/* Flags toggles */}
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
              <button
                onClick={() => toggleFlag('g')}
                className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${flags.includes('g') ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                title="Global search"
              >
                g
              </button>
              <button
                onClick={() => toggleFlag('i')}
                className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${flags.includes('i') ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                title="Case-insensitive"
              >
                i
              </button>
              <button
                onClick={() => toggleFlag('m')}
                className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${flags.includes('m') ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                title="Multiline"
              >
                m
              </button>
            </div>
          </div>
          {error && <span className="text-xs font-mono text-rose-500 mt-1 block">{error}</span>}
        </div>

        {/* Test String Input */}
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Sample Test String:</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="w-full h-40 bg-gray-50 dark:bg-slate-950 font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 focus:outline-none focus:border-purple-600 resize-y"
          />
        </div>

        {/* Matches Output List */}
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Match Results List ({matches.length}):</label>
          {matches.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs text-gray-400 font-mono">
              No substring matched the specified RegExp pattern.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {matches.map((m, idx) => (
                <div key={idx} className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 rounded-xl p-3 font-mono text-xs flex items-center justify-between gap-2">
                  <span className="truncate text-purple-900 dark:text-purple-200 font-semibold" title={m}>{m}</span>
                  <span className="text-[10px] text-purple-400 font-bold bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded border border-purple-100 dark:border-purple-900">#{idx+1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
