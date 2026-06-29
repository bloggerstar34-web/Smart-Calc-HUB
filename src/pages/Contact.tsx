import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { AdBanner } from '../components/common/AdBanner';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Simulate contact submission client side
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Info Area */}
        <div className="lg:col-span-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Contact Support & Feedback
          </h1>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Have feature suggestions for new calculators? Encountered a calculation glitch? Or looking to collaborate on developer modules? Let us know.
          </p>

          <div className="space-y-6 mt-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Email Support</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">support@smartcalchub.com</p>
                <a href="mailto:support@smartcalchub.com" className="text-xs font-semibold text-blue-600 hover:underline mt-1 inline-block">Send Direct Email</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Community Forum</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Participate in open source code improvements.</p>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline mt-1 inline-block">GitHub Discussions</a>
              </div>
            </div>
          </div>

          <AdBanner position="sidebar" className="mt-10" />
        </div>

        {/* Contact Form Container */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-950/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Dispatched!</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                Thank you for contacting SmartCalc Hub. Our community curators will review your feedback shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Feature Request / Glitch Report"
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help? Provide details if complaining about formulas..."
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-gray-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Dispatch Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
