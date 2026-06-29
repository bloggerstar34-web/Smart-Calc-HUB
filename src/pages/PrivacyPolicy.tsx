import React from 'react';
import { ShieldAlert, EyeOff, KeyRound, ServerOff } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center sm:text-left mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Last Updated: June 2026. Learn why SmartCalc Hub is the safest calculations provider on the web.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Core pillar */}
        <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl p-6 border border-blue-50 dark:border-blue-900/10 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Zero Transmitted Inputs</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              We never transmit, view, log, or cache any of the data, values, parameters, JSON content, or passwords you submit to our calculators. Everything happens inside your local device processor.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">1. Information We Do Not Collect</h2>
            <p>
              SmartCalc Hub operates as a static client-side application. We do not provision background storage nodes to analyze user text or input matrices. Unlike server-based calculation portals, your equations, personal mortgage values, or formatting inputs remain strictly private to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">2. Local Browser Caching (PWA Storage)</h2>
            <p>
              To maintain immediate offline availability, our application relies on standard browser capabilities such as **Service Workers**, **Cache Storage**, and **LocalStorage**:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>**Cache Storage:** Stores application shell assets (code, styling, icons) to allow running calculators in offline conditions.</li>
              <li>**LocalStorage:** Stores user-configured settings (such as dark mode preferences or persistent tool input history if configured) purely on your browser profile.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">3. Third-Party Analytics & Ads</h2>
            <p>
              We may utilize cookies or basic analytical utilities to track high-level visitor metrics (such as page views or bounce rates) and optimize search engine positioning. These tools do not possess permissions to monitor values computed in our application layers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">4. Policy Adaptability</h2>
            <p>
              We reserve rights to update this Privacy Policy to match browser standards or new utility additions. Continued utility operations signify agreement to these offline terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
