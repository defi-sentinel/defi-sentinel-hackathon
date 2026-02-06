'use client';

import React, { useState, useEffect } from 'react';
import { ProtocolDetail } from '@/lib/types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Coins,
  Users,
  Code,
  Info,
  Activity,
  ShieldAlert
} from 'lucide-react';

interface ProtocolRisksProps {
  protocol: ProtocolDetail;
}

// --- Helper Components ---

const ScoreBadge = ({ score, maxScore = 100, size = "md" }: { score: number; maxScore?: number; size?: "sm" | "md" | "lg" }) => {
  // Normalize score to percentage for coloring logic
  const percentage = (maxScore > 0) ? (score / maxScore) * 100 : 0;

  let colorClass = "bg-red-500/20 text-red-500 border-red-500/50 dark:text-red-400";
  if (percentage >= 80) colorClass = "bg-emerald-500/20 text-emerald-600 border-emerald-500/50 dark:text-emerald-400";
  else if (percentage >= 60) colorClass = "bg-yellow-500/20 text-yellow-600 border-yellow-500/50 dark:text-yellow-400";

  // Handle negative scores visually (keep red)
  if (score < 0) colorClass = "bg-red-500/20 text-red-600 border-red-500/50 dark:text-red-400";

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-lg px-4 py-2 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border ${colorClass} ${sizeClasses[size]}`}
    >
      {score}/{maxScore}
    </span>
  );
};

const ScoreBar = ({ score, maxScore }: { score: number; maxScore: number }) => {
  const safeScore = Math.max(0, score); // Treat negative as 0 for bar width
  const percentage = (maxScore > 0) ? (safeScore / maxScore) * 100 : 0;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  let colorClass = "bg-red-500";
  if (percentage >= 80) colorClass = "bg-emerald-500";
  else if (percentage >= 60) colorClass = "bg-yellow-500";

  return (
    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden mt-2">
      <div
        className={`h-full ${colorClass} transition-all duration-500 ease-out`}
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  );
};

const getCategoryIcon = (categoryName: string) => {
  const lower = categoryName.toLowerCase();

  if (lower.includes("smart contract") || lower.includes("security")) return <Shield className="w-5 h-5" />;
  if (lower.includes("economic") || lower.includes("market")) return <Coins className="w-5 h-5" />;
  if (lower.includes("governance") || lower.includes("centralization")) return <Users className="w-5 h-5" />;
  if (lower.includes("innovation") || lower.includes("technology")) return <Zap className="w-5 h-5" />;
  if (lower.includes("sustainability")) return <Activity className="w-5 h-5" />;
  if (lower.includes("reputation")) return <ShieldAlert className="w-5 h-5" />;
  if (lower.includes("usability")) return <Code className="w-5 h-5" />;

  return <Info className="w-5 h-5" />;
};

const ProtocolRisks: React.FC<ProtocolRisksProps> = ({ protocol }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  // Initialize expanded state for the first category on load
  const [expandedSubFields, setExpandedSubFields] = useState<Record<string, boolean>>(() => {
    const initialExpanded: Record<string, boolean> = {};
    if (protocol.risks?.categories?.[0]?.subfields) {
      protocol.risks.categories[0].subfields.forEach(sub => {
        initialExpanded[sub.name] = true;
      });
    }
    return initialExpanded;
  });

  const risks = protocol.risks;
  const categories = risks?.categories || [];
  const selectedCategory = categories[selectedCategoryIndex];

  // Logic moved to onClick handler to prevent jitter from useEffect

  const toggleSubField = (name: string) => {
    setExpandedSubFields((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleCategoryClick = (idx: number) => {
    setSelectedCategoryIndex(idx);

    // Synchronously set expanded fields for the new category
    const newCategory = categories[idx];
    if (newCategory?.subfields) {
      const allExpanded: Record<string, boolean> = {};
      newCategory.subfields.forEach(sub => {
        allExpanded[sub.name] = true;
      });
      setExpandedSubFields(allExpanded);
    } else {
      setExpandedSubFields({});
    }
  };

  const RADAR_SHORT_NAMES: Record<string, string> = {
    'Smart Contract & Technical Risk': 'Smart Contract',
    'Economic Design & Market Risk': 'Economic',
    'Governance & Centralization Risk': 'Governance',
    'Sustainability & Competitive Position': 'Sustainability',
    'Reputation & Social Trust Risk': 'Reputation',
  };

  const radarData = categories.map((cat) => ({
    subject: RADAR_SHORT_NAMES[cat.category] || cat.category,
    originalCategory: cat.category,
    A: cat.score,
    fullMark: 100,
  }));

  if (!risks || !selectedCategory) {
    return <div className="p-6 text-center text-slate-500 dark:text-slate-400">No risk data available.</div>;
  }

  return (
    <div className="w-full space-y-6">

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Visual Overview (Radar + Navigation) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              Risk Profile Overview
            </h2>
            <div className="h-[300px] w-full flex items-center justify-center -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={protocol.name}
                    dataKey="A"
                    stroke="#818cf8"
                    strokeWidth={3}
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8' }}
                    formatter={(value: number) => [value, 'Score']}
                    labelFormatter={(label) => label}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4 mt-2">
              <div className="text-sm text-slate-500 dark:text-slate-400">Overall Rating</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{risks.tier}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">({risks.overallScore}/100)</span>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="grid grid-cols-1 gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(idx)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left ${idx === selectedCategoryIndex
                  ? "bg-slate-100 dark:bg-slate-700/60 border-indigo-500/50 shadow-sm transform scale-[1.02]"
                  : "bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/40 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors ${idx === selectedCategoryIndex
                      ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                      : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400"
                      }`}
                  >
                    {getCategoryIcon(cat.category)}
                  </div>
                  <span
                    className={`font-medium ${idx === selectedCategoryIndex ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"
                      }`}
                  >
                    {cat.category}
                  </span>
                </div>
                <ScoreBadge score={cat.score} maxScore={100} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Breakdown (Drill-down) */}
        <div className="lg:col-span-12 xl:col-span-7">
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/50 h-full overflow-hidden flex flex-col shadow-sm">

            {/* Detail Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    {getCategoryIcon(selectedCategory.category)}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedCategory.category}
                  </h2>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {selectedCategory.score}<span className="text-lg text-slate-400 font-medium ml-1">/100</span>
                </div>
              </div>
              {/* Visual bar for main category (always out of 100) */}
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden mt-2">
                <div className={`h-full ${selectedCategory.score >= 80 ? 'bg-emerald-500' : selectedCategory.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'} transition-all duration-500`} style={{ width: `${Math.max(0, selectedCategory.score)}%` }}></div>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {selectedCategory.description || `Detailed breakdown of ${selectedCategory.category}.`}
              </p>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 max-h-[600px] xl:max-h-[none]">
              {selectedCategory.subfields && selectedCategory.subfields.length > 0 ? (
                selectedCategory.subfields.map((subField, idx) => {
                  const isExpanded = expandedSubFields[subField.name];

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border transition-all duration-300 ${isExpanded
                        ? "bg-slate-50 dark:bg-slate-700/10 border-slate-300 dark:border-slate-600 shadow-sm"
                        : "bg-white dark:bg-slate-800/20 border-slate-200 dark:border-slate-700/30 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                    >
                      {/* Sub-Category Header (Clickable) */}
                      <button
                        onClick={() => toggleSubField(subField.name)}
                        className="w-full flex items-center justify-between p-4 focus:outline-none"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{subField.name}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* Only show bar if expanded or on large screens */}
                          <div className="hidden sm:block w-24">
                            <ScoreBar score={subField.score} maxScore={subField.max} />
                          </div>
                          <ScoreBadge score={subField.score} maxScore={subField.max} size="md" />
                        </div>
                      </button>

                      {/* Expanded Content (Explanation) */}
                      {isExpanded && (
                        <div className="border-t border-slate-200 dark:border-slate-700/50 p-4 bg-slate-100/30 dark:bg-black/20 rounded-b-xl animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <Info className="w-4 h-4 text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {subField.notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-500">
                  No detailed metrics available for this category.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolRisks;
