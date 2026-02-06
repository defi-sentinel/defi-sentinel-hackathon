import React from 'react';
import { StrategyType } from '../types';

interface StrategyModifierCardProps {
  strategies: StrategyType[];
  totalMultiplier: number;
}

export const StrategyModifierCard: React.FC<StrategyModifierCardProps> = ({ strategies, totalMultiplier }) => {
  return (
    <div className="flex flex-col h-full gap-2">
      {/* Summary Score - Compact */}
      <div
        className="p-3 bg-gray-900 rounded-lg flex items-center justify-between"
      >
        <span className="text-sm text-gray-500 font-bold">Cumulative</span>
        <span className={`text-2xl font-bold font-mono ${totalMultiplier < 1 ? 'text-orange-400' : 'text-emerald-400'}`}>
          {totalMultiplier.toFixed(2)}x
        </span>
      </div>

      {/* List - Scrollable if too many, but compact */}
      <div className="flex-grow overflow-y-auto pr-1 space-y-2 custom-scrollbar min-h-[80px]">
        {strategies.map((strat) => (
          <div
            key={strat.id}
            className="flex items-center justify-between p-2 rounded bg-gray-900/50 border border-gray-800/50 text-sm"
          >
            <span className="text-gray-300 font-medium truncate max-w-[100px]">{strat.name}</span>
            <span className={`px-1.5 py-0.5 rounded font-mono font-bold ${strat.multiplier < 1
              ? 'text-orange-400 bg-orange-500/10'
              : 'text-emerald-400 bg-emerald-500/10'
              }`}>
              {strat.multiplier}x
            </span>
          </div>
        ))}
        {strategies.length === 0 && (
          <div className="text-center text-gray-600 text-xs italic py-4">None active</div>
        )}
      </div>
    </div>
  );
};
