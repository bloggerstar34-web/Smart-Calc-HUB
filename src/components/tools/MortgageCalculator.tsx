import React, { useState } from 'react';
import { Home, DollarSign, Percent, Calendar, PieChart, Sparkles } from 'lucide-react';

export const MortgageCalculator: React.FC = () => {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(4800);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState(1200);

  const principal = Math.max(0, homePrice - downPayment);
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;

  // Monthly Principal & Interest
  let monthlyPI = 0;
  if (monthlyRate > 0) {
    monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  } else {
    monthlyPI = principal / totalPayments;
  }

  const monthlyTax = propertyTaxAnnual / 12;
  const monthlyInsurance = homeInsuranceAnnual / 12;
  const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance;
  const totalInterestPaid = (monthlyPI * totalPayments) - principal;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-2xl text-blue-600 dark:text-blue-400 font-bold">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mortgage Amortization Estimator</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Fixed interest rate annuity model</span>
          </div>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5" /> Instant Calculation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Form */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">Home Purchase Price ($)</label>
            <input 
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-gray-900 dark:text-white font-bold text-lg focus:outline-none focus:border-blue-600 transition-colors"
            />
            <input 
              type="range" min="50000" max="2000000" step="10000"
              value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full mt-2 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">Down Payment ($)</label>
              <input 
                type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-blue-600"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">{((downPayment/homePrice)*100 || 0).toFixed(1)}% of price</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">Loan Term (Years)</label>
              <select 
                value={loanTermYears} onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-blue-600"
              >
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">Interest Rate (%)</label>
              <input 
                type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-gray-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">Annual Property Tax</label>
              <input 
                type="number" value={propertyTaxAnnual} onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-gray-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">Annual Insurance</label>
              <input 
                type="number" value={homeInsuranceAnnual} onChange={(e) => setHomeInsuranceAnnual(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-gray-900 dark:text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-blue-600/20">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-200 block mb-1">Estimated Monthly Payment</span>
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
              ${Math.round(totalMonthlyPayment).toLocaleString()}
            </div>

            <div className="space-y-3 pt-4 border-t border-blue-500/30 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white"></span> Principal & Interest</span>
                <span className="font-bold">${Math.round(monthlyPI).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-300"></span> Property Taxes</span>
                <span className="font-bold">${Math.round(monthlyTax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-400"></span> Home Insurance</span>
                <span className="font-bold">${Math.round(monthlyInsurance).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-500/30 space-y-2 text-xs text-blue-100">
            <div className="flex justify-between">
              <span>Total Principal Loan:</span>
              <strong className="text-white font-mono">${principal.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Interest Paid (30 yrs):</span>
              <strong className="text-white font-mono">${Math.round(totalInterestPaid).toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Cost of Home:</span>
              <strong className="text-white font-mono">${Math.round(principal + totalInterestPaid + downPayment).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
