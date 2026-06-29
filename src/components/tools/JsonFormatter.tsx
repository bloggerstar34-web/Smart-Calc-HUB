import React, { useState } from 'react';
import { Copy, Check, Minimize2, Maximize2, AlertCircle, Sparkles, Trash2 } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('{\n  "name": "SmartCalc Hub",\n  "version": 1.0,\n  "offline": true,\n  "features": ["PWA", "Calculators", "SEO"]\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number = 2) => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, spaces);
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON Syntax');
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON Syntax');
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>JSON Formatter & Syntax Validator</span>
          </h3>
          <span className="text-xs text-gray-500">Zero network upload • Evaluated locally in browser sandbox</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => formatJson(2)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all"
          >
            Format (2 Spaces)
          </button>
          <button 
            onClick={() => formatJson(4)}
            className="px-4 py-2 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 text-gray-700 dark:text-gray-200 font-semibold rounded-xl text-xs sm:text-sm transition-colors"
          >
            4 Spaces
          </button>
          <button 
            onClick={minifyJson}
            className="px-4 py-2 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 text-gray-700 dark:text-gray-200 font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" /> Minify
          </button>
          <button 
            onClick={() => { setInput(''); setOutput(''); setError(null); }}
            className="p-2 text-gray-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Clear All"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input Pane */}
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase text-gray-500 mb-2">Input Raw JSON or JS Object:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste {"key": "value"} here...'
            className="w-full h-80 sm:h-96 bg-gray-50 dark:bg-slate-950 font-mono text-xs sm:text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 focus:outline-none focus:border-blue-600 resize-none selection:bg-blue-500 selection:text-white"
          />
        </div>

        {/* Right Output Pane */}
        <div className="flex flex-col relative">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase text-gray-500">Output Result:</label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Formatted'}</span>
              </button>
            )}
          </div>

          {error ? (
            <div className="w-full h-80 sm:h-96 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
              <h4 className="font-bold text-rose-800 dark:text-rose-300 text-base mb-1">JSON Parsing Error</h4>
              <p className="text-xs font-mono text-rose-600 dark:text-rose-400 max-w-md bg-white dark:bg-gray-900 p-3 rounded-xl border border-rose-200 dark:border-rose-800">
                {error}
              </p>
            </div>
          ) : (
            <textarea
              readOnly
              value={output || 'Click "Format" or "Minify" to generate output...'}
              className="w-full h-80 sm:h-96 bg-slate-900 font-mono text-xs sm:text-sm text-emerald-400 border border-slate-800 rounded-2xl p-4 focus:outline-none resize-none selection:bg-emerald-600 selection:text-white shadow-inner"
            />
          )}
        </div>
      </div>
    </div>
  );
};
