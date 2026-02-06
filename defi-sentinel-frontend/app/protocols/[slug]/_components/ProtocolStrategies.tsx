import React from 'react';
import { ProtocolDetail } from '@/lib/types';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface ProtocolStrategiesProps {
  protocol: ProtocolDetail;
}

const ProtocolStrategies: React.FC<ProtocolStrategiesProps> = ({ protocol }) => {
  return (
    <div className="">
      <div className="flex flex-row items-center justify-between pb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Active Strategies
        </h3>
        <button className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          View All
        </button>
      </div>
      <div className="">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(protocol.strategies || []).map((strat) => (
            <div key={strat.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 hover:border-emerald-500 transition-colors cursor-pointer group shadow-sm">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                  {strat.type}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${(strat.rating || '').startsWith('A')
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                  }`}>
                  {strat.rating}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{strat.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{strat.description}</p>
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">APY</div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{strat.apy}%</div>
                </div>
                <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-md text-xs font-medium transition-colors">
                  Analyze <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProtocolStrategies;
