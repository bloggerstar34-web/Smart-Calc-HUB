import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center sm:text-left mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Last Updated: June 2026. Please read these offline utility utilization terms carefully.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or downloading SmartCalc Hub (the "App"), you confirm that you accept these Terms of Service and agree to comply with them. If you do not agree to these terms, you must cease using our suite of calculators.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">2. License to Use</h2>
          <p>
            We grant you a limited, non-exclusive, non-transferable, and revocable license to use the App and its calculators strictly for personal, commercial, or academic computational purposes. No scraping, mirroring, or reverse engineering of the static scripts is allowed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">3. Client-Side Integrity & Security</h2>
          <p>
            All computations are carried out using your local system memory and processor power. SmartCalc Hub bears zero responsibility for hardware overloads, browser tab lockups, or computation delays on complex tasks (such as extremely long JSON parsing or recursive regex evaluation).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">4. Modifications to Utilities</h2>
          <p>
            We reserve the right to add, modify, or remove any calculation module, helper article, or utility parameters at any point without notice.
          </p>
        </section>
      </div>
    </div>
  );
};
