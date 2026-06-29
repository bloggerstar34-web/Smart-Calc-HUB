import React, { useState, useEffect } from 'react';
import { Ruler, Scale, Thermometer, Database, ArrowLeftRight, Copy, Check, Trash2, Info } from 'lucide-react';
import { toast } from '../common/ToastContainer';

type ConverterCategory = 'length' | 'weight' | 'temperature' | 'data';

interface Unit {
  key: string;
  name: string;
  symbol: string;
  factor?: number; // relative to base unit
}

const CATEGORIES: { key: ConverterCategory; name: string; icon: any; color: string; description: string }[] = [
  {
    key: 'length',
    name: 'Length',
    icon: Ruler,
    color: 'from-blue-500 to-cyan-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    description: 'Convert between metric and imperial length units'
  },
  {
    key: 'weight',
    name: 'Weight & Mass',
    icon: Scale,
    color: 'from-amber-500 to-orange-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    description: 'Convert between metric and US custom weights'
  },
  {
    key: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    color: 'from-rose-500 to-red-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
    description: 'Convert Celsius, Fahrenheit, and Kelvin scales'
  },
  {
    key: 'data',
    name: 'Data Storage',
    icon: Database,
    color: 'from-emerald-500 to-teal-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    description: 'Convert bytes, kilobytes, gigabytes with binary/decimal toggles'
  }
];

const LENGTH_UNITS: Unit[] = [
  { key: 'm', name: 'Meters', symbol: 'm', factor: 1 },
  { key: 'km', name: 'Kilometers', symbol: 'km', factor: 1000 },
  { key: 'cm', name: 'Centimeters', symbol: 'cm', factor: 0.01 },
  { key: 'mm', name: 'Millimeters', symbol: 'mm', factor: 0.001 },
  { key: 'mi', name: 'Miles', symbol: 'mi', factor: 1609.344 },
  { key: 'yd', name: 'Yards', symbol: 'yd', factor: 0.9144 },
  { key: 'ft', name: 'Feet', symbol: 'ft', factor: 0.3048 },
  { key: 'in', name: 'Inches', symbol: 'in', factor: 0.0254 }
];

const WEIGHT_UNITS: Unit[] = [
  { key: 'kg', name: 'Kilograms', symbol: 'kg', factor: 1000 },
  { key: 'g', name: 'Grams', symbol: 'g', factor: 1 },
  { key: 'mg', name: 'Milligrams', symbol: 'mg', factor: 0.001 },
  { key: 'lb', name: 'Pounds', symbol: 'lb', factor: 453.59237 },
  { key: 'oz', name: 'Ounces', symbol: 'oz', factor: 28.349523125 },
  { key: 'st', name: 'Stone', symbol: 'st', factor: 6350.29318 },
  { key: 't', name: 'Metric Tons', symbol: 't', factor: 1000000 }
];

const TEMP_UNITS: Unit[] = [
  { key: 'C', name: 'Celsius', symbol: '°C' },
  { key: 'F', name: 'Fahrenheit', symbol: '°F' },
  { key: 'K', name: 'Kelvin', symbol: 'K' }
];

// We will dynamically compute data unit factors based on binary vs decimal settings
const DATA_UNITS_BASE = [
  { key: 'B', name: 'Bytes', symbol: 'B', exponent: 0 },
  { key: 'KB', name: 'Kilobytes', symbol: 'KB', exponent: 1 },
  { key: 'MB', name: 'Megabytes', symbol: 'MB', exponent: 2 },
  { key: 'GB', name: 'Gigabytes', symbol: 'GB', exponent: 3 },
  { key: 'TB', name: 'Terabytes', symbol: 'TB', exponent: 4 },
  { key: 'PB', name: 'Petabytes', symbol: 'PB', exponent: 5 }
];

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<ConverterCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [isBinaryData, setIsBinaryData] = useState<boolean>(true); // binary (1024) vs decimal (1000)
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // When changing categories, reset corresponding default units
  useEffect(() => {
    switch (category) {
      case 'length':
        setFromUnit('m');
        setToUnit('ft');
        break;
      case 'weight':
        setFromUnit('kg');
        setToUnit('lb');
        break;
      case 'temperature':
        setFromUnit('C');
        setToUnit('F');
        break;
      case 'data':
        setFromUnit('MB');
        setToUnit('GB');
        break;
    }
  }, [category]);

  // Helper to format output neatly, avoiding infinite decimal trails or excessive notation
  const formatNumber = (num: number): string => {
    if (isNaN(num)) return '0';
    if (num === 0) return '0';
    
    const absVal = Math.abs(num);
    
    // Very small numbers
    if (absVal < 0.000001) {
      return num.toExponential(6);
    }
    
    // Decimals
    if (num % 1 !== 0) {
      // Find dynamic decimals
      const decimalStr = num.toString().split('.')[1] || '';
      if (decimalStr.length > 8) {
        // Trim trailing zeros after precision
        const trimmed = parseFloat(num.toFixed(8));
        return trimmed.toString();
      }
    }
    
    return num.toLocaleString(undefined, { maximumFractionDigits: 8 });
  };

  // Convert custom value between two units
  const performConversion = (valStr: string, from: string, to: string): number => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return 0;

    if (from === to) return val;

    // --- TEMPERATURE CONVERSION ---
    if (category === 'temperature') {
      let celsius = 0;
      // Convert to Celsius first
      if (from === 'C') celsius = val;
      else if (from === 'F') celsius = (val - 32) * 5 / 9;
      else if (from === 'K') celsius = val - 273.15;

      // Convert from Celsius to destination
      if (to === 'C') return celsius;
      if (to === 'F') return (celsius * 9 / 5) + 32;
      if (to === 'K') return celsius + 273.15;
      return 0;
    }

    // --- DATA STORAGE CONVERSION ---
    if (category === 'data') {
      const baseVal = isBinaryData ? 1024 : 1000;
      const fromObj = DATA_UNITS_BASE.find(u => u.key === from);
      const toObj = DATA_UNITS_BASE.find(u => u.key === to);
      if (!fromObj || !toObj) return 0;

      // Convert to bytes first, then to destination
      const bytes = val * Math.pow(baseVal, fromObj.exponent);
      return bytes / Math.pow(baseVal, toObj.exponent);
    }

    // --- LENGTH & WEIGHT CONVERSION (Factor-based) ---
    const unitsList = category === 'length' ? LENGTH_UNITS : WEIGHT_UNITS;
    const fromObj = unitsList.find(u => u.key === from);
    const toObj = unitsList.find(u => u.key === to);

    if (!fromObj || !toObj || !fromObj.factor || !toObj.factor) return 0;

    // Convert from unit to base, then base to to unit
    const baseValue = val * fromObj.factor;
    return baseValue / toObj.factor;
  };

  const activeUnits: Unit[] = (() => {
    if (category === 'length') return LENGTH_UNITS;
    if (category === 'weight') return WEIGHT_UNITS;
    if (category === 'temperature') return TEMP_UNITS;
    
    // Data storage (dynamic factor)
    const baseVal = isBinaryData ? 1024 : 1000;
    return DATA_UNITS_BASE.map(u => ({
      key: u.key,
      name: u.name,
      symbol: u.symbol,
      factor: Math.pow(baseVal, u.exponent)
    }));
  })();

  const outputValue = performConversion(inputValue, fromUnit, toUnit);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      toast('Copied value to clipboard', 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const handleClear = () => {
    setInputValue('');
  };

  const currentCategoryObj = CATEGORIES.find(c => c.key === category)!;
  const ActiveIcon = currentCategoryObj.icon;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-800 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-gray-100 dark:border-gray-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-2xl text-blue-600 dark:text-blue-400 font-bold">
            <ActiveIcon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Universal Unit Converter</h3>
            <span className="text-xs text-gray-500">Fast, premium offline conversion calculator</span>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="px-3.5 py-2 bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-500 dark:bg-gray-800/50 dark:hover:bg-rose-950/30 dark:text-gray-400 dark:hover:text-rose-400 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-gray-150 dark:border-gray-800 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const isActive = category === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-250 cursor-pointer group ${
                isActive
                  ? 'bg-blue-600/5 border-blue-500 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-500 ring-2 ring-blue-500/10'
                  : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <CatIcon className={`w-5 h-5 mb-2 transition-transform duration-250 group-hover:scale-110 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className="text-xs font-bold tracking-tight">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Conversion Main Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gray-50/70 dark:bg-slate-950/30 border border-gray-150 dark:border-gray-850 p-6 rounded-3xl mb-8">
        
        {/* FROM INPUT PANEL */}
        <div className="md:col-span-5 space-y-2">
          <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">From Unit</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={(e) => {
                // Allow empty inputs, digits, decimal points, and minus signs (for temperatures)
                const val = e.target.value;
                if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
                  setInputValue(val);
                }
              }}
              placeholder="0.00"
              className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-lg font-semibold text-gray-900 dark:text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-800 dark:text-gray-200 px-3 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm min-w-[120px]"
            >
              {activeUnits.map(unit => (
                <option key={unit.key} value={unit.key}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SWAP BUTTON */}
        <div className="md:col-span-2 flex justify-center py-2 md:py-0">
          <button
            onClick={handleSwap}
            className="p-3 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-850 border border-gray-250 dark:border-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Swap conversion units"
          >
            <ArrowLeftRight className="w-5 h-5 rotate-90 md:rotate-0" />
          </button>
        </div>

        {/* TO INPUT PANEL */}
        <div className="md:col-span-5 space-y-2">
          <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">To Unit</label>
          <div className="flex gap-2">
            <div className="relative w-full">
              <input
                type="text"
                readOnly
                value={formatNumber(outputValue)}
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-lg font-extrabold text-blue-600 dark:text-blue-400 px-4 py-3 pr-10 rounded-2xl focus:outline-none shadow-sm cursor-text"
              />
              <button
                onClick={() => copyToClipboard(outputValue.toString(), 'to-unit')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                title="Copy converted value"
              >
                {copiedKey === 'to-unit' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-800 dark:text-gray-200 px-3 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm min-w-[120px]"
            >
              {activeUnits.map(unit => (
                <option key={unit.key} value={unit.key}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Dynamic Data Protocol Switch (Only when Data category is active) */}
      {category === 'data' && (
        <div className="flex items-center justify-between bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-4 mb-8">
          <div className="flex gap-2.5 items-start">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">Data Exponent Scheme Settings</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Binary uses IEC standard bases (1 KB = 1024 Bytes) while Decimal uses SI standard bases (1 KB = 1000 Bytes).</p>
            </div>
          </div>
          <div className="flex bg-gray-100 dark:bg-gray-850 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setIsBinaryData(true)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isBinaryData ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              Binary (1024)
            </button>
            <button
              onClick={() => setIsBinaryData(false)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isBinaryData ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              Decimal (1000)
            </button>
          </div>
        </div>
      )}

      {/* Multi-Unit Equivalents Grid (Unified high performance visualizer) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">All Equivalent Unit Values</h4>
          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">Based on: <span className="font-bold text-gray-600 dark:text-gray-300">{inputValue || '0'} {activeUnits.find(u => u.key === fromUnit)?.name}</span></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeUnits.map((unit) => {
            const equivValue = performConversion(inputValue || '0', fromUnit, unit.key);
            const isSelectedFrom = unit.key === fromUnit;
            const isSelectedTo = unit.key === toUnit;
            
            return (
              <div
                key={unit.key}
                onClick={() => setFromUnit(unit.key)}
                className={`relative group p-4 border rounded-2xl transition-all duration-200 text-left cursor-pointer ${
                  isSelectedFrom
                    ? 'bg-blue-50/20 border-blue-500/70 dark:bg-blue-950/10 ring-2 ring-blue-500/10'
                    : isSelectedTo
                    ? 'bg-amber-50/20 border-amber-500/50 dark:bg-amber-950/10'
                    : 'bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-850 hover:border-gray-300 dark:hover:border-gray-800 hover:shadow-sm'
                }`}
              >
                {/* Accent highlights */}
                {isSelectedFrom && (
                  <span className="absolute right-3 top-3 text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded-lg">FROM</span>
                )}
                {isSelectedTo && !isSelectedFrom && (
                  <span className="absolute right-3 top-3 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded-lg">TO</span>
                )}

                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-0.5">{unit.name} ({unit.symbol})</span>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white font-mono truncate max-w-[80%]">
                    {formatNumber(equivValue)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(equivValue.toString(), unit.key);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all cursor-pointer"
                    title={`Copy ${unit.name} value`}
                  >
                    {copiedKey === unit.key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
