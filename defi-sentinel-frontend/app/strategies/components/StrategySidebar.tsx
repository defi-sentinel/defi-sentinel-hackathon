"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Strategy } from '@/lib/types';
import { getScoreBgColor, getScoreStyle } from '@/lib/data';
import { Lock } from 'lucide-react';

interface StrategySidebarProps {
  strategies: Strategy[];
  selectedStrategyId: string | null;
  onSelectStrategy: (id: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function StrategySidebar({
  strategies,
  selectedStrategyId,
  onSelectStrategy,
  isMobileOpen,
  onCloseMobile
}: StrategySidebarProps) {
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Low Risk': true,
    'Middle Risk': true,
    'High Risk': true
  });
  const [minApy, setMinApy] = useState<number>(5);
  const [minRisk, setMinRisk] = useState<number>(50);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleSwitchToLite = () => {
    router.push('/strategies/lite');
  };

  const groupedClasses = useMemo(() => {
    // 1. Filter strategies by APY and Risk Score
    const filteredStrategies = strategies.filter(s => s.apy >= minApy && s.score >= minRisk);

    // 2. Group by strategyClass
    const classGroups: Record<string, Strategy[]> = {};
    filteredStrategies.forEach(s => {
      const className = s.strategyClass || s.name; // Fallback to name if class undefined
      if (!classGroups[className]) {
        classGroups[className] = [];
      }
      classGroups[className].push(s);
    });

    // 3. Convert to array of class objects
    const classes = Object.entries(classGroups).map(([className, classStrategies]) => {
      const firstStrat = classStrategies[0];
      const apys = classStrategies.map(s => s.apy);
      return {
        id: className,
        name: className,
        riskLevel: firstStrat.riskLevel,
        strategies: classStrategies,
        apyRange: {
          min: Math.min(...apys),
          max: Math.max(...apys)
        }
      };
    });

    // 4. Group by risk level based on score
    const groups: Record<string, typeof classes> = {
      'Low Risk': [],
      'Middle Risk': [],
      'High Risk': []
    };

    classes.forEach(cls => {
      // Use the actual riskLevel property from the strategy data
      const riskLevel = cls.riskLevel;

      // Map riskLevel to group keys
      let riskKey = 'High Risk'; // Default
      if (riskLevel === 'Low') {
        riskKey = 'Low Risk';
      } else if (riskLevel === 'Middle') {
        riskKey = 'Middle Risk';
      } else if (riskLevel === 'High') {
        riskKey = 'High Risk';
      }
      else {
        riskKey = 'Middle Risk';
      }

      if (groups[riskKey]) {
        groups[riskKey].push(cls);
      }
    });

    return groups;
  }, [strategies, minApy, minRisk]);

  // Helper to check if a class is "selected" (contains the selected strategy)
  const isClassSelected = (strategies: Strategy[]) => {
    return strategies.some(s => s.id === selectedStrategyId);
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
    transform transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide
    md:translate-x-0 md:sticky md:top-[64px] md:h-[calc(100vh-64px)]
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center md:hidden">
          <h2 className="font-bold text-lg">Strategies</h2>
          <button onClick={onCloseMobile} className="p-2">✕</button>
        </div>

        <div className="p-2 space-y-2">
          {/* Toggle to Lite View and Apply Filter */}
          <div className="mb-4 space-y-3">
            <button
              onClick={handleSwitchToLite}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Switch to Lite View</span>
            </button>
            {/* Min APY Filter */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Min APY Filter: {minApy}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={minApy}
                onChange={(e) => setMinApy(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0%</span>
                <span>50%</span>
              </div>
            </div>
            {/* Min Risk Score Filter */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Min Safety Score: {minRisk}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minRisk}
                onChange={(e) => setMinRisk(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {Object.entries(groupedClasses).map(([groupName, classes]) => {
            if (classes.length === 0) return null;

            return (
              <div key={groupName} className="mb-4">
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-wider bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full shadow-lg ${groupName === 'Low Risk' ? 'bg-green-500' :
                      groupName === 'Middle Risk' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    <span className="text-base font-extrabold">{groupName}</span>
                  </div>
                  <span className={`transform transition-transform duration-300 ${expandedGroups[groupName] ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${expandedGroups[groupName] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-1 mt-1">
                      {classes.map(cls => {
                        const isSelected = isClassSelected(cls.strategies);
                        const score = cls.strategies[0].score || 50;

                        return (
                          <button
                            key={cls.id}
                            onClick={() => {
                              // Select the first strategy in the class
                              if (cls.strategies.length > 0) {
                                onSelectStrategy(cls.strategies[0].id);
                              } else {
                                console.warn("Sidebar: No strategies in class", cls.name);
                              }
                              onCloseMobile();
                            }}
                            className={`
                              w-full text-left p-4 rounded-xl transition-all duration-200 relative group
                              ${isSelected
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700 shadow-md'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'}
                            `}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className={`font-semibold text-sm ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'} flex items-center gap-1.5`}>
                                {cls.name}
                                {cls.strategies.some(s => s.isPro) && <Lock size={12} className="text-amber-500" />}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400"> APY</span>
                            </div>


                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {cls.strategies.length} Strategies
                              </div>

                              {/* APY Range */}
                              <span className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">
                                {cls.apyRange.min === cls.apyRange.max
                                  ? `${cls.apyRange.min.toFixed(1)}%`
                                  : `${cls.apyRange.min.toFixed(1)}% - ${cls.apyRange.max.toFixed(1)}%`
                                }
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
