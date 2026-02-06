import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, AlertTriangle, Gauge, GitMerge, Shield } from 'lucide-react';
import { Protocol, Asset, StrategyType } from '../types';
import { analyzeRisk } from '../utils';
import { ScoreHeader } from './ScoreHeader';
import { FormulaCard } from './FormulaCard';
import { BottleneckSection } from './BottleneckSection';
import { StrategyModifierCard } from './StrategyModifierCard';
import { RiskTree } from './RiskTree';
import { DetailList } from './DetailList';
interface StrategyRiskModuleProps {
  protocols: Protocol[];
  assets: Asset[];
  strategies: StrategyType[];
}

export const StrategyRiskModule: React.FC<StrategyRiskModuleProps> = ({
  protocols,
  assets,
  strategies,
}) => {
  const result = analyzeRisk(protocols, assets, strategies);
  const [detailsOpen, setDetailsOpen] = useState(true);

  // Unified Card Style matching StrategyDetail.tsx
  const cardStyle = "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col h-full shadow-sm relative overflow-hidden";
  const headerStyle = "flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700/50";
  const titleStyle = "text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wider";
  const iconStyle = "w-4 h-4 text-indigo-500";

  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg font-sans">

      {/* Layer 1: Final Result Header - Updated Color and Layout */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-600 px-6 py-4 border-b border-slate-700/50">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Safety Analysis
          </h3>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 bg-gray-50 dark:bg-gray-900/50">

        {/* Layer 1.5: Score Header moved inside content area */}
        <div className="mb-6">
          <ScoreHeader result={result} />
        </div>

        {/* Layer 2: Main Grid Layout - 50/50 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* Left Column (50%) */}
          <div className="flex flex-col gap-6 h-full">

            {/* Module 1: Core Logic */}
            <section className={cardStyle}>
              <div className={headerStyle}>
                <Calculator className={iconStyle} />
                <h3 className={titleStyle}>Score Composition</h3>
              </div>
              <FormulaCard result={result} strategies={strategies} />
            </section>

            {/* Split Row: Bottlenecks & Strategies */}
            <div className="grid grid-cols-2 gap-6 flex-grow">
              {/* Module 2: Risk Bottlenecks */}
              <section className={cardStyle}>
                <div className={headerStyle}>
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <h3 className={titleStyle}>Primary Risk Sources</h3>
                </div>
                <BottleneckSection result={result} />
              </section>

              {/* Module 3: Strategy Modifiers */}
              <section className={cardStyle}>
                <div className={headerStyle}>
                  <Gauge className={iconStyle} />
                  <h3 className={titleStyle}>Strategy Risk Adjustment</h3>
                </div>
                <StrategyModifierCard strategies={strategies} totalMultiplier={result.totalMultiplier} />
              </section>
            </div>
          </div>

          {/* Right Column (50%) */}
          <div className="h-full">
            {/* Module 4: Risk Dependency Flow */}
            <section className={cardStyle}>
              <div className={`${headerStyle} justify-between border-none mb-0`}>
                <div className="flex items-center gap-2">
                  <GitMerge className={iconStyle} />
                  <h3 className={titleStyle}>Risk Contribution Flow</h3>
                </div>
              </div>
              <div className="flex-grow flex items-center justify-center w-full overflow-hidden min-h-[400px]">
                <RiskTree
                  minProtocol={result.minProtocol}
                  minAsset={result.minAsset}
                  strategies={strategies}
                  baseScore={result.baseScore}
                  finalScore={result.finalScore}
                />
              </div>
            </section>
          </div>
        </div>

        {/* Layer 3: Expandable Details */}
        <section className="pt-4 border-t border-gray-200 dark:border-gray-700/50">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
          >
            <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Risk Contributors
            </span>
            {detailsOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {detailsOpen && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <DetailList
                title="Protocols"
                items={protocols}
                minItemId={result.minProtocol.id}
                type="protocol"
              />
              <DetailList
                title="Assets"
                items={assets}
                minItemId={result.minAsset.id}
                type="asset"
              />
              <DetailList
                title="Strategy Characteristics"
                items={strategies}
                minItemId=""
                type="strategy"
              />
            </div>
          )}
        </section>

      </div>
    </div>
  );
};
