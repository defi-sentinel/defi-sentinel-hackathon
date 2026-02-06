"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Strategy, fetchStrategies } from '@/lib/api';
import { getScoreBgColor, getScoreStyle } from '@/lib/data';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { StrategiesLoadingSkeleton } from '../StrategiesLoadingSkeleton';

type ApyTimeRange = 'current' | '24h' | '7d' | '30d';

export default function LiteStrategiesPage() {
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apyTimeRange, setApyTimeRange] = useState<ApyTimeRange>('current');
  const [minApy, setMinApy] = useState<number>(5);
  const [minRisk, setMinRisk] = useState<number>(50);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    async function loadStrategies() {
      try {
        setLoading(true);
        const data = await fetchStrategies();
        setStrategies(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load strategies:", err);
        setError("Failed to load strategies. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadStrategies();
  }, []);

  // Group strategies by risk level
  const groupedStrategies = useMemo(() => {
    const groups: Record<string, Strategy[]> = {
      'Low Risk': [],
      'Middle Risk': [],
      'High Risk': []
    };

    strategies.forEach(strategy => {
      // Get APY based on time range
      let apy = strategy.apy;
      if (apyTimeRange === '30d') {
        apy = strategy.apy30d || strategy.apy;
      }

      // Filter by min APY and Risk Score
      if (apy >= minApy && (strategy.score || 0) >= minRisk) {
        // Use the actual riskLevel property from the strategy data
        const riskLevel = strategy.riskLevel;

        // Map riskLevel to group keys, default to Middle Risk
        let riskKey = 'Middle Risk'; // Default
        if (riskLevel === 'Low') {
          riskKey = 'Low Risk';
        } else if (riskLevel === 'Middle') {
          riskKey = 'Middle Risk';
        } else if (riskLevel === 'High') {
          riskKey = 'High Risk';
        }

        if (groups[riskKey]) {
          groups[riskKey].push(strategy);
        }
      }
    });

    // Sort each group by APY (descending)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const apyA = apyTimeRange === '30d' ? (a.apy30d || a.apy) : a.apy;
        const apyB = apyTimeRange === '30d' ? (b.apy30d || b.apy) : b.apy;
        return apyB - apyA;
      });
    });

    return groups;
  }, [strategies, apyTimeRange, minApy, minRisk]);

  // Trigger animation when filters change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [apyTimeRange, minApy, minRisk]);

  const handleViewDetail = (strategyId: string) => {
    router.push(`/strategies?strategy=${strategyId}`);
  };

  const handleBackToClassic = () => {
    router.push('/strategies');
  };

  const getApyForStrategy = (strategy: Strategy): number => {
    if (apyTimeRange === '24h') return strategy.apy;
    if (apyTimeRange === '7d') return strategy.apy * 0.95;
    return strategy.apy;
  };

  if (loading) {
    return <StrategiesLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-center px-4">
        <div className="text-red-500 mb-2 font-bold">Error loading content</div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with toggles */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Strategy Center - Lite View</h1>
            <button
              onClick={handleBackToClassic}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold">Back to Classic</span>
            </button>
          </div>

          {/* APY Time Range Toggle and Filter in Same Row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 h-10">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">APY Display:</span>
              <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
                {(['current', '24h', '7d'] as ApyTimeRange[]).map(range => (
                  <button
                    key={range}
                    onClick={() => setApyTimeRange(range)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all h-full ${apyTimeRange === range
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    {range === 'current' ? 'Current APR' : range === '24h' ? '24h Avg' : '7d Avg'}
                  </button>
                ))}
              </div>
            </div>

            {/* APY Filter - Same Row */}
            <div className="flex items-center gap-3 h-10">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Min APY:</span>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700 h-full flex items-center gap-3 min-w-[200px]">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={minApy}
                  onChange={(e) => setMinApy(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[3rem] text-right">{minApy}%</span>
              </div>
            </div>

            {/* Min Risk Score Filter */}
            <div className="flex items-center gap-3 h-10">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Min Safety Score:</span>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700 h-full flex items-center gap-3 min-w-[200px]">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={minRisk}
                  onChange={(e) => setMinRisk(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[3rem] text-right">{minRisk}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(['Low Risk', 'Middle Risk', 'High Risk'] as const).map(riskLevel => (
            <div key={riskLevel} className="space-y-4">
              {/* Column Header */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full shadow-lg ${riskLevel === 'Low Risk' ? 'bg-green-500' :
                    riskLevel === 'Middle Risk' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{riskLevel}</h2>
                  <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                    {groupedStrategies[riskLevel]?.length || 0} strategies
                  </span>
                </div>
              </div>

              {/* Strategy Cards */}
              <div className="space-y-2" key={animationKey}>
                {groupedStrategies[riskLevel]?.map((strategy, idx) => {
                  const apy = getApyForStrategy(strategy);
                  const score = strategy.score || 50;

                  return (
                    <div
                      key={strategy.id}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      {/* Strategy Name, Rating, and Score in One Row */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white flex-1 truncate">
                          {strategy.name}
                        </h3>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">

                        </div>
                      </div>

                      {/* APY and Actions in Same Row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {apy.toFixed(2)}%
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">APY</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetail(strategy.id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Detail
                          </button>
                          <a
                            href={`/protocols/${strategy.projectId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Link
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(!groupedStrategies[riskLevel] || groupedStrategies[riskLevel].length === 0) && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No strategies found</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

