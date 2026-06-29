import React from 'react';
import { ShieldCheck, Cpu, CloudLightning, Award, Users } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';
import { AdBanner } from '../components/common/AdBanner';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-4">
          Empowering Users with Safe, Instant Offline Tools
        </h1>
        <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-400">
          SmartCalc Hub is a Progressive Web App housing 50+ calculation, formatting, generation, and processing tools. Fully private, locally calculated, and optimized for immediate use.
        </p>
      </div>

      <AdBanner position="header" className="mb-12" />

      {/* Core Philosophies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">100% Privacy First</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            We never transmit your inputs, codes, passwords, or values to any cloud server. Everything is executed entirely inside your browser's virtual runtime environment.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
            <CloudLightning className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Offline Capability</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Equipped with a robust Progressive Service Worker, SmartCalc Hub remains fully usable even in flight, deep tunnels, or under spotty cellular connectivity.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Zero App Store Overhead</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Install this application directly onto your Android, iOS, Windows, macOS, or Linux home screen through your standard web browser. No subscriptions or hidden fees.
          </p>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 mb-16 border border-slate-900 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">50+</div>
            <div className="text-xs text-gray-400 mt-1 uppercase font-mono tracking-wider">Total Utilities</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">100%</div>
            <div className="text-xs text-gray-400 mt-1 uppercase font-mono tracking-wider">Client-Side Logic</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">0ms</div>
            <div className="text-xs text-gray-400 mt-1 uppercase font-mono tracking-wider">Network Latency</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">0$</div>
            <div className="text-xs text-gray-400 mt-1 uppercase font-mono tracking-wider">Hidden Cost</div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Loved by Developers & Professionals</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">See what our worldwide installable app audience says about SmartCalc Hub's reliability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed mb-6">"{t.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdBanner position="in-content" />
    </div>
  );
};
