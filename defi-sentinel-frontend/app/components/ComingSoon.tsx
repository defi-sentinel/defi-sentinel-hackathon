"use client";

import { useEffect, useState } from "react";
import { Clock, Mail, Sparkles } from "lucide-react";

export default function ComingSoon() {
  const [daysRemaining, setDaysRemaining] = useState(60);

  useEffect(() => {
    // Add class to body to hide header and footer
    document.body.classList.add('coming-soon-page');

    // Get or set the launch date (60 days from first visit)
    const getLaunchDate = () => {
      const stored = localStorage.getItem("launchDate");
      if (stored) {
        return new Date(stored);
      } else {
        // Set launch date to 60 days from now
        const launchDate = new Date();
        launchDate.setDate(launchDate.getDate() + 60);
        localStorage.setItem("launchDate", launchDate.toISOString());
        return launchDate;
      }
    };

    const calculateDaysRemaining = () => {
      const launchDate = getLaunchDate();
      const now = new Date();
      const diffTime = launchDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    };

    // Calculate initial days
    setDaysRemaining(calculateDaysRemaining());

    // Update countdown every minute (to catch day changes)
    const interval = setInterval(() => {
      setDaysRemaining(calculateDaysRemaining());
    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
      // Remove class when component unmounts
      document.body.classList.remove('coming-soon-page');
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center px-4 py-12 z-50">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in-up relative z-0">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            DeFi Sentinel
          </h1>
          <div className="flex items-center justify-center gap-2 text-emerald-400/80">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg font-medium">Coming Soon</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Institutional‑Grade DeFi Intelligence & Ratings
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We&apos;re building something amazing. Get ready for comprehensive DeFi protocol ratings, 
            risk analysis, and investment strategies.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mt-12 mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-emerald-500/30 shadow-2xl">
            <Clock className="w-8 h-8 text-emerald-400" />
            <div className="text-left">
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                Launching In
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mt-1">
                {daysRemaining}
                <span className="text-2xl md:text-3xl text-emerald-400 ml-2">
                  {daysRemaining === 1 ? "Day" : "Days"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
          <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Protocol Ratings</h3>
            <p className="text-sm text-gray-400">
              Comprehensive risk assessments for 100+ DeFi protocols
            </p>
          </div>
          <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-white mb-2">Yield Strategies</h3>
            <p className="text-sm text-gray-400">
              Expert insights on yield farming and investment strategies
            </p>
          </div>
          <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-white mb-2">Security Analysis</h3>
            <p className="text-sm text-gray-400">
              Real-time security alerts and risk monitoring
            </p>
          </div>
        </div>

      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

