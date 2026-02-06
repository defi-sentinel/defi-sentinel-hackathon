import { getRiskColor, getRiskColorClass } from '../utils';
import { RiskAnalysisResult, StrategyType } from '../types';

interface FormulaCardProps {
  result: RiskAnalysisResult;
  strategies: StrategyType[];
}

export const FormulaCard: React.FC<FormulaCardProps> = ({ result, strategies }) => {
  return (
    <div className="flex flex-col xl:flex-row items-center justify-between gap-4 text-gray-300 font-mono h-full">

      {/* Base Score Segment */}
      <div
        className="flex-1 w-full bg-gray-900 rounded-lg p-3 flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white font-sans tracking-wider">Base Safety Score</span>
        </div>
        <div className={`font-bold text-3xl ${getRiskColorClass(result.baseScore).split(' ')[0]}`}>
          {result.baseScore}
        </div>
      </div>

      <div className="text-gray-600 text-2xl font-bold">×</div>

      {/* Modifier Segment */}
      <div
        className="flex-1 w-full bg-gray-900 rounded-lg p-3 flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white font-sans tracking-wider">Strategy Adjustment</span>
        </div>
        <div className={`font-bold text-3xl ${result.totalMultiplier < 1 ? 'text-orange-400' : 'text-emerald-400'}`}>
          {result.totalMultiplier.toFixed(2)}x
        </div>
      </div>

      <div className="text-gray-600 text-2xl font-bold">=</div>

      {/* Final Score Segment */}
      <div
        className="flex-1 w-full bg-gray-900 rounded-lg p-3 flex items-center justify-between"
      >
        <span className="text-xs font-bold text-white font-sans tracking-wider">Final Safety Score</span>
        <div className={`font-bold text-3xl ${getRiskColorClass(result.finalScore).split(' ')[0]}`}>
          {result.finalScore}
        </div>
      </div>

    </div>
  );
};
