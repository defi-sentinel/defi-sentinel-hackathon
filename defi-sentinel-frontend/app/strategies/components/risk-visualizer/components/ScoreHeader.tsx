import React from 'react';
import { RiskAnalysisResult } from '../types';
import { getRiskColorClass } from '../utils';

interface ScoreHeaderProps {
  result: RiskAnalysisResult;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({ result }) => {

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-1">
          <h2 className="text-2xl text-gray-900 dark:text-gray-100 font-bold">Total Strategy Safety Score:</h2>
          <div className="px-4 py-1 rounded-xl flex items-baseline gap-2 bg-transparent">
            <span className={`text-6xl font-black font-mono tracking-tighter ${getRiskColorClass(result.finalScore).split(' ')[0]}`}>
              {result.finalScore}
            </span>
            <span className="text-xl font-bold font-mono tracking-normal text-gray-500">/100</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <a href="/rating-methodology" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">
            Learn more about strategy rating
          </a>
        </div>
      </div>
    </div>
  );
};
