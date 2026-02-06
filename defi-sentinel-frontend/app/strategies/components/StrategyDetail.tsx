"use client";

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Strategy, fetchAds, Ad } from '@/lib/api'; // Added fetchAds and Ad
import { getScoreBgColor, getScoreColor, getScoreStyle } from '@/lib/data'; // Removed strategies import
import ProGate from '@/app/components/ProGate';
import { StrategyRiskModule } from './risk-visualizer/components/StrategyRiskModule';
import { Protocol, Asset, StrategyType } from './risk-visualizer/types';
// import RiskDecayModule, { RiskData } from './RiskDecayModule'; // Deprecated

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  ReferenceLine
} from 'recharts';
import {
  Shield, AlertTriangle, ExternalLink, Share2,
  CheckCircle, TrendingUp, Sparkles, Lock, ArrowRight, Info,
  Lightbulb, ChevronRight, ChevronLeft, BarChart3, PieChart as PieChartIcon, Activity, X, Maximize2
} from 'lucide-react';

interface StrategyDetailProps {
  strategy: Strategy | null;
  onStrategyChange?: (id: string) => void;
  allStrategies: Strategy[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

const getScoreTextColor = (score: number) => {
  if (score >= 95) return "text-green-600 dark:text-green-400";
  if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 75) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 65) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};



// Smart Transition Card Component with smooth fade/slide animations
// Inspired by smart-transition-widget
interface SmartTransitionCardProps {
  ad: Ad | null;
}

const SmartTransitionCard: React.FC<SmartTransitionCardProps> = ({ ad }) => {
  // Ad content from prop or fallback
  const displayAd = ad || {
    title: "Aave",
    description: "Leading lending protocol offering competitive yields with robust security and deep liquidity. Welcome to our website and new user so one please purchase membership to see pro tips and more juicy tips and more and more. only 99.9 usdc per year, you will get much more you want",
    link: "/protocols/aave"
  };

  const bgClasses = "bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-white/10";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl transition-all duration-700 ease-in-out border ${bgClasses}`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Decorative background elements */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl transition-colors duration-700 bg-amber-500/10" />
      <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-emerald-900/10 rounded-full blur-3xl" />

      {/* Header / Status Bar - Always show AD badge */}
      <div className="absolute top-3 right-4 z-20">
        <div className="px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wider bg-amber-500/20 border border-amber-500/30 text-amber-400">
          ✨ AD
        </div>
      </div>

      {/* Ads Content */}
      <div className="relative z-10 px-5 py-6 flex flex-col h-full">
        <div className="flex-1 min-h-0 flex flex-col">
          <h5 className="font-bold text-white mb-2 flex items-center gap-2 text-base shrink-0">
            <Sparkles size={20} className="text-amber-400" /> {displayAd.title}
          </h5>
          <div className="flex-1 min-h-0 overflow-hidden">
            <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
              {displayAd.description}
            </p>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-2 flex items-center justify-between group cursor-pointer">
          <a
            href={displayAd.link}
            className="text-sm font-bold text-white group-hover:underline underline-offset-4 decoration-white/50"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};
export default function StrategyDetail({ strategy, onStrategyChange, allStrategies }: StrategyDetailProps) {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | 'ALL'>('ALL');
  const [showShareToast, setShowShareToast] = useState(false);
  const [ad, setAd] = useState<Ad | null>(null);
  const [chartView, setChartView] = useState<'APY' | 'TVL'>('APY');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchAds().then(setAd);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  useEffect(() => {
    // Lock body scroll when lightbox is open
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxIndex]);

  // Use real chart data from backend
  const chartData = React.useMemo(() => {
    if (!strategy) return [];

    const apyHistory = strategy.apyHistory as any;
    const tvlHistory = strategy.tvlHistory as any;

    const selectedApy = (apyHistory && apyHistory[timeRange]) ? apyHistory[timeRange] : [];
    const selectedTvl = (tvlHistory && tvlHistory[timeRange]) ? tvlHistory[timeRange] : [];

    // Merge APY and TVL data based on index (assuming aligned dates from seed) or date match
    return selectedApy.map((point: any, index: number) => {
      const tvlPoint = selectedTvl[index] || {};
      return {
        date: point.date.substring(5).replace('-', '/'), // MM/DD format
        value: point.value,
        tvl: tvlPoint.value || 0 // Backend TVL history uses 'value' key too
      };
    });
  }, [strategy, timeRange]);

  if (!strategy) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <TrendingUp className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-600 dark:text-gray-300">Select a Strategy</h2>
        <p className="max-w-md">Choose a strategy from the sidebar to view detailed analytics, risk breakdown, and execution steps.</p>
      </div>
    );
  }

  // Get related strategies for tabs (same strategy class)
  const currentClass = strategy.strategyClass || strategy.name;
  const relatedStrategies = allStrategies.filter(s =>
    (s.strategyClass === currentClass) || (s.projectId === strategy.projectId && !s.strategyClass)
  );



  const avgApy = chartData.reduce((acc: number, curr: { value: number; tvl: number }) => acc + curr.value, 0) / chartData.length;
  const avgTvl = chartData.reduce((acc: number, curr: { value: number; tvl: number }) => acc + curr.tvl, 0) / chartData.length;

  const handleShare = () => {
    const url = `${window.location.origin}/strategies?strategy=${strategy.id}`;
    const message = `Share this with your friend! I found a ${strategy.apy.toFixed(1)}% APY strategy on DeFi Sentinel: ${url}`;
    navigator.clipboard.writeText(message);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  // Handler for tab change
  const handleTabChange = (strategyId: string) => {
    if (onStrategyChange) {
      onStrategyChange(strategyId);
    }
  };

  // Use real steps from backend
  const displaySteps = strategy.steps ? [...strategy.steps] : [];


  const nextStep = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex < displaySteps.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  // RiskData preparation removed


  return (
    <div className="h-full">
      {/* Strategy Type Tabs */}
      {/* Strategy Type Tabs - Always render container to prevent layout shift */}
      <div className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800 px-6 pt-4 shadow-sm transition-all">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-0 min-h-[44px]">
          {relatedStrategies.length > 1 ? (
            relatedStrategies.map(strat => (
              <button
                key={strat.id}
                onClick={() => handleTabChange(strat.id)}
                className={`px-6 py-3 text-sm font-bold whitespace-nowrap rounded-t-xl transition-all ${strategy.id === strat.id
                  ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                {strat.name}
              </button>
            ))
          ) : (
            // Placeholder to maintain height
            <div className="px-6 py-3 text-sm font-bold opacity-0 pointer-events-none">
              Placeholder
            </div>
          )}
        </div>
      </div>

      {/* 4.4.3 Header Section */}
      <ProGate condition={!!strategy.isPro}>
        <div className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6`}>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white">{strategy.name}</h1>

                {strategy.status === 'Experimental' && (
                  <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-purple-200 dark:border-purple-800">
                    Experimental
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${strategy.riskLevel === 'Low' ? 'bg-green-500' :
                    strategy.riskLevel === 'Middle' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  {strategy.riskLevel} Risk
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full self-center" />
                <span>{strategy.complexity || 'Intermediate'}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full self-center" />
                <div className="flex gap-1">
                  {strategy.tags?.map(tag => (
                    <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-emerald-500 transition-colors relative"
                title="Share Strategy"
              >
                <Share2 size={18} />
                {showShareToast && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl z-50">
                    <div className="font-bold mb-1">Link Copied!</div>
                    <div className="text-gray-300 break-words">&quot;Share this with your friend! I found a {strategy.apy.toFixed(1)}% APY strategy...&quot;</div>
                  </div>
                )}
              </button>
              <a
                href={strategy.strategyLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                <ExternalLink size={18} />
                View Strategy
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Col 1: Current APY Stats */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <div className="text-2xl text-gray-500 mb-4 whitespace-nowrap">Current APY</div>
              <div className="text-6xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent -ml-1">
                {strategy.apy.toFixed(2)}%
              </div>
              <div className="flex gap-8 mt-8">
                <div>
                  <span className="block text-gray-400 text-lg mb-1">7D Avg</span>
                  <span className="font-mono text-4xl font-bold text-emerald-600">{(strategy.apy7d || 0).toFixed(2)}%</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-lg mb-1">30D Avg</span>
                  <span className="font-mono text-4xl font-bold text-emerald-600">{(strategy.apy30d || 0).toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Col 2: Ads Section */}
            <div className="md:col-span-3 flex flex-col">
              <h4 className="text-xs font-semibold text-transparent mb-2 uppercase tracking-wider select-none">
                Ads
              </h4>
              <SmartTransitionCard ad={ad} />
            </div>

            {/* Col 3: APY Chart */}
            <div className="md:col-span-3 flex flex-col">
              <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">APY History</h4>
              <div
                className="w-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-emerald-200 dark:border-gray-700 shadow-sm transition-all"
                style={{ aspectRatio: '16/9' }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" stroke="#e5e7eb" opacity={0.3} vertical={false} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis domain={['auto', 'auto']} stroke="#9ca3af" fontSize={10} tickFormatter={(val) => `${val.toFixed(0)}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937', fontSize: '12px' }}
                      formatter={(value: any) => [`${value.toFixed(2)}%`, 'APY']}
                      labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                    />
                    <ReferenceLine y={avgApy} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} label={{ value: `Avg: ${avgApy.toFixed(1)}%`, position: 'insideRight', fill: '#10b981', fontSize: 10 }} />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Col 4: TVL Chart */}
            <div className="md:col-span-3 flex flex-col">
              <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">TVL Growth</h4>
              <div
                className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-blue-200 dark:border-gray-700 shadow-sm transition-all"
                style={{ aspectRatio: '16/9' }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" stroke="#e5e7eb" opacity={0.3} vertical={false} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis domain={['auto', 'auto']} stroke="#9ca3af" fontSize={10} tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937', fontSize: '12px' }}
                      formatter={(value: any) => [`$${(value / 1000000).toFixed(1)}M`, 'TVL']}
                      labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                    />
                    <ReferenceLine y={avgTvl} stroke="#3b82f6" strokeDasharray="3 3" opacity={0.5} label={{ value: `Avg: $${(avgTvl / 1000000).toFixed(1)}M`, position: 'insideRight', fill: '#3b82f6', fontSize: 10 }} />
                    <Area type="monotone" dataKey="tvl" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTvl)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 pb-20">
          {/* 3-Column Layout: Overview, Yield, Tutorial */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:grid-rows-1">

            {/* 1. Overview Section */}
            <section className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg h-[420px] flex flex-col">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 border-b border-blue-700/20 flex-shrink-0">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Info className="w-6 h-6 text-blue-100" />
                    Overview
                  </h3>
                </div>
                <div className="p-6 flex-1 overflow-y-auto">
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {strategy.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">Protocol</span>
                      <span className="font-semibold">
                        {strategy.protocols && strategy.protocols.length > 0
                          ? strategy.protocols.join(', ')
                          : strategy.projectId}
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">Chain</span>
                      <span className="font-semibold">
                        {strategy.chains && strategy.chains.length > 0
                          ? strategy.chains.join(', ')
                          : 'Ethereum'}
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">Type</span>
                      <span className="font-semibold">{strategy.type}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">Score</span>
                      <span className={`font-black ${getScoreColor(strategy.score)}`}>{strategy.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Yield Breakdown Section (Donut Chart) */}
            <section className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg h-[420px] flex flex-col">
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 border-b border-emerald-700/20 flex-shrink-0">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <PieChartIcon className="w-6 h-6 text-emerald-100" />
                    Yield Breakdown
                  </h3>
                </div>

                <div className="p-6 flex-1 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={strategy.yieldBreakdown || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={(strategy.yieldBreakdown || []).length > 1 ? 5 : 0}
                        dataKey="value"
                        nameKey="source"
                      >
                        {(strategy.yieldBreakdown || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#1f2937' }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry: any) => (
                          <span className="text-xs text-gray-600 dark:text-gray-300 ml-1">
                            {entry.payload.source}: <span className="font-bold text-gray-900 dark:text-white">{entry.payload.value?.toFixed(1)}%</span>
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Label */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Total</div>
                      <div className="text-xl font-bold text-emerald-600">{strategy.apy.toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Tips Section */}
            <section className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg h-[420px] flex flex-col">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 border-b border-amber-600/20 flex-shrink-0">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-amber-100" />
                    Tips
                  </h3>
                </div>
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                    {strategy.proTips && strategy.proTips.length > 0 ? (
                      strategy.proTips.map((tip, idx) => (
                        <div key={idx} className="relative flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                        No specific tips available for this strategy.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Row 3: Tutorial Grid (Step-by-Step) */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 border-b border-indigo-700/20">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-indigo-200" />
                Step-by-Step Tutorial
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displaySteps.map((step, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  {/* Image - 16:9 Aspect Ratio with Lightbox */}
                  <div className="aspect-video bg-gray-100 dark:bg-gray-900 relative overflow-hidden group cursor-zoom-in"
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <img
                      src={step.image || `/images/strategy/test/s${(idx % 5) + 1}.PNG`}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-gray-100', 'to-gray-200', 'dark:from-gray-800', 'dark:to-gray-900');
                        const textNode = document.createElement('div');
                        textNode.className = "text-center px-4";
                        textNode.innerHTML = `<span class="block text-4xl font-black text-gray-300 dark:text-gray-600 mb-2">${step.step}</span><span class="text-xs text-gray-400 font-medium uppercase tracking-wider">Image Placeholder</span>`;
                        target.parentElement?.appendChild(textNode);
                      }}
                    />
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800 z-10">
                      {step.step}
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-lg backdrop-blur-sm">
                        <Maximize2 size={20} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{step.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4 flex-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Lightbox Implementation - A bit primitive but meets "zoom in" req if we use state. 
                For now, the onClick above opens in new tab. 
                Let's upgrade to a real in-page lightbox if preferred.
                Replacing the onClick above with state-based one would be better.
            */}
          </section>

          {/* Row 4: Risk Visualization */}
          <section>
            <StrategyRiskModule
              protocols={strategy.riskProtocols || []}
              assets={strategy.riskAssets || []}
              strategies={strategy.riskStrategies || []}
            />
          </section>


        </div>
      </ProGate >

      {/* Full Screen Lightbox */}
      {
        lightboxIndex !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setLightboxIndex(null)}>
            <div className="relative w-full h-full p-4 md:p-8 flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Header Controls */}
              <div className="flex justify-end mb-4 z-50">
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-3 bg-gray-800/50 hover:bg-gray-700/80 rounded-full text-white transition-colors"
                  title="Close (Esc)"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 relative flex items-center justify-center min-h-0">
                {/* Prev Button */}
                {lightboxIndex > 0 && (
                  <button
                    onClick={prevStep}
                    className="absolute left-0 z-50 p-4 text-white/50 hover:text-white hover:bg-black/20 rounded-r-2xl transition-all"
                    title="Previous Step (Left Arrow)"
                  >
                    <ChevronLeft size={48} />
                  </button>
                )}

                {/* Next Button */}
                {lightboxIndex < displaySteps.length - 1 && (
                  <button
                    onClick={nextStep}
                    className="absolute right-0 z-50 p-4 text-white/50 hover:text-white hover:bg-black/20 rounded-l-2xl transition-all"
                    title="Next Step (Right Arrow)"
                  >
                    <ChevronRight size={48} />
                  </button>
                )}

                {/* Image Container */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    key={lightboxIndex} // Force re-render on change for animation if needed
                    src={`/images/strategy/test/s${(lightboxIndex % 5) + 1}.PNG`}
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in fade-in zoom-in duration-300"
                    alt={displaySteps[lightboxIndex].title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        const placeholder = document.createElement('div');
                        placeholder.className = "text-white text-center";
                        placeholder.innerHTML = `<div class="text-6xl font-bold opacity-20 mb-4">${displaySteps[lightboxIndex].step}</div><div>Image Unavailable</div>`;
                        target.parentElement.appendChild(placeholder);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Footer with Info */}
              <div className="mt-6 mx-auto w-full max-w-4xl bg-gray-900/90 text-white p-6 rounded-2xl border border-gray-800 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-sm font-bold shadow-lg ring-2 ring-indigo-400/50">
                        {displaySteps[lightboxIndex].step}
                      </span>
                      {displaySteps[lightboxIndex].title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {displaySteps[lightboxIndex].description}
                    </p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <div className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-1">Step</div>
                    <div className="text-2xl font-mono font-bold text-white">
                      {lightboxIndex + 1} <span className="text-gray-600 text-lg">/ {displaySteps.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

    </div >
  );
}
