import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center sm:text-left mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Last Updated: June 2026. Important safety guidelines regarding computation accuracies.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Warning card */}
        <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/10 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Not Professional Advice</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Computations made in SmartCalc Hub (specifically mortgage estimations, compound interests, or code processing) should be treated strictly as directional estimates. Always consult a certified financial or developer professional before making critical real-life commitments.
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">1. Math & Calculation Accuracies</h2>
            <p>
              While we meticulously test our algorithms, mathematical models, and scripting engines, edge cases may exist where browser float representations, rounding factors, or specific localization parameters lead to slight variances. We make no guarantees about absolute mathematical precision.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">2. Financial Estimations</h2>
            <p>
              Mortgage calculations rely on simplified, standard loan amortization formulas. They exclude dynamic local factors such as specific regional home insurance premiums, changing homeowners association (HOA) fees, private mortgage insurance (PMI) tier shifts, or specific local tax assessment fluctuations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">3. Code Generation & Security</h2>
            <p>
              Utilities like the Password Generator use browser standard `crypto.getRandomValues()` APIs which are secure. However, we are not liable for password breeches, credential management failures, or misapplied regex statements developed using our testing sandboxes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
