import React, { useState } from 'react';
import { Delete, RotateCcw, History, Sparkles } from 'lucide-react';

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isRad, setIsRad] = useState(false); // Degrees vs Radians

  const handleInput = (val: string) => {
    if (display === '0' && val !== '.') {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const calculateResult = () => {
    try {
      // Substitute trig/log functions
      let expr = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      if (isRad) {
        expr = expr
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(');
      } else {
        // Convert deg to rad
        expr = expr
          .replace(/sin\(([^)]+)\)/g, (_, angle) => `Math.sin(${angle} * Math.PI / 180)`)
          .replace(/cos\(([^)]+)\)/g, (_, angle) => `Math.cos(${angle} * Math.PI / 180)`)
          .replace(/tan\(([^)]+)\)/g, (_, angle) => `Math.tan(${angle} * Math.PI / 180)`);
      }

      expr = expr
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(');

      // Evaluate safely
      const func = new Function(`return ${expr}`);
      const res = Number(func().toFixed(8));
      
      setFormula(`${display} =`);
      setDisplay(res.toString());
      setHistory([`${display} = ${res}`, ...history.slice(0, 9)]);
    } catch (err) {
      setDisplay('Error');
    }
  };

  const insertFunc = (fnName: string) => {
    if (display === '0') {
      setDisplay(`${fnName}(`);
    } else {
      setDisplay(`${display}${fnName}(`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 text-white">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-gray-400">
        <span className="flex items-center gap-1.5 font-mono text-emerald-400">
          <Sparkles className="w-4 h-4" /> V8 Web-Worker Math Engine
        </span>
        <button 
          onClick={() => setIsRad(!isRad)}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold transition-colors text-blue-400"
        >
          MODE: {isRad ? 'RAD' : 'DEG'}
        </button>
      </div>

      {/* Display Screen */}
      <div className="bg-slate-950 rounded-2xl p-6 mb-6 text-right font-mono border border-slate-800/80 shadow-inner">
        <div className="text-sm text-gray-400 min-h-[20px] truncate">{formula}</div>
        <div className="text-4xl sm:text-5xl font-extrabold tracking-tight truncate text-white mt-1 selection:bg-blue-600">
          {display}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-5 gap-2.5">
        {/* Row 1: Trig & Sci */}
        <button onClick={() => insertFunc('sin')} className="btn-sci">sin</button>
        <button onClick={() => insertFunc('cos')} className="btn-sci">cos</button>
        <button onClick={() => insertFunc('tan')} className="btn-sci">tan</button>
        <button onClick={() => handleInput('(')} className="btn-sci">(</button>
        <button onClick={() => handleInput(')')} className="btn-sci">)</button>

        {/* Row 2: Logs & Roots */}
        <button onClick={() => insertFunc('log')} className="btn-sci">log</button>
        <button onClick={() => insertFunc('ln')} className="btn-sci">ln</button>
        <button onClick={() => insertFunc('sqrt')} className="btn-sci">√</button>
        <button onClick={() => handleInput('^')} className="btn-sci">^</button>
        <button onClick={handleClear} className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl py-3 font-bold text-sm transition-colors">AC</button>

        {/* Row 3 */}
        <button onClick={() => handleInput('π')} className="btn-sci">π</button>
        <button onClick={() => handleInput('7')} className="btn-num">7</button>
        <button onClick={() => handleInput('8')} className="btn-num">8</button>
        <button onClick={() => handleInput('9')} className="btn-num">9</button>
        <button onClick={() => handleInput('÷')} className="btn-op">÷</button>

        {/* Row 4 */}
        <button onClick={() => handleInput('e')} className="btn-sci">e</button>
        <button onClick={() => handleInput('4')} className="btn-num">4</button>
        <button onClick={() => handleInput('5')} className="btn-num">5</button>
        <button onClick={() => handleInput('6')} className="btn-num">6</button>
        <button onClick={() => handleInput('×')} className="btn-op">×</button>

        {/* Row 5 */}
        <button onClick={handleBackspace} className="btn-sci flex items-center justify-center"><Delete className="w-4 h-4" /></button>
        <button onClick={() => handleInput('1')} className="btn-num">1</button>
        <button onClick={() => handleInput('2')} className="btn-num">2</button>
        <button onClick={() => handleInput('3')} className="btn-num">3</button>
        <button onClick={() => handleInput('-')} className="btn-op">-</button>

        {/* Row 6 */}
        <button onClick={() => setHistory([])} className="btn-sci text-[10px]">Tape AC</button>
        <button onClick={() => handleInput('0')} className="btn-num col-span-2">0</button>
        <button onClick={() => handleInput('.')} className="btn-num">.</button>
        <button onClick={() => handleInput('+')} className="btn-op">+</button>
      </div>

      <button
        onClick={calculateResult}
        className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xl rounded-2xl shadow-lg shadow-blue-600/30 transition-all transform active:scale-[0.99]"
      >
        = Calculate Offline
      </button>

      {/* History Tape */}
      {history.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Recent Calculations</span>
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-xs text-gray-300">
            {history.map((item, i) => (
              <div key={i} className="bg-slate-950 p-2 rounded-lg border border-slate-800/60 flex justify-between">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .btn-sci {
          background-color: #1e293b;
          color: #94a3b8;
          border-radius: 0.75rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.15s;
        }
        .btn-sci:hover { background-color: #334155; color: #ffffff; }
        .btn-num {
          background-color: #334155;
          color: #ffffff;
          border-radius: 0.75rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          font-weight: 700;
          font-size: 1.125rem;
          transition: all 0.15s;
        }
        .btn-num:hover { background-color: #475569; }
        .btn-op {
          background-color: #2563eb;
          color: #ffffff;
          border-radius: 0.75rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          font-weight: 800;
          font-size: 1.25rem;
          transition: all 0.15s;
        }
        .btn-op:hover { background-color: #3b82f6; }
      `}</style>
    </div>
  );
};
