import React from 'react';
import { Asset, Protocol, StrategyType } from '../types';
import { getRiskColorClass } from '../utils';

interface DetailListProps {
  title: string;
  items: (Protocol | Asset | StrategyType)[];
  minItemId: string;
  type: 'protocol' | 'asset' | 'strategy';
}

export const DetailList: React.FC<DetailListProps> = ({ title, items, minItemId, type }) => {
  return (
    <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
        <h4 className="text-base font-semibold text-gray-300">{title}</h4>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-base text-left">
          <thead className="text-sm text-gray-500 uppercase bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">
                {type === 'protocol' ? 'Role' : type === 'asset' ? 'Type' : 'Reason'}
              </th>
              <th className="px-4 py-3 font-medium text-right">
                {type === 'strategy' ? 'Mult' : 'Score'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map((item) => {
              const isMin = item.id === minItemId && type !== 'strategy';
              const rowClass = isMin ? 'bg-red-500/5' : 'hover:bg-gray-900/50';

              let scoreDisplay;
              let scoreClass = '';

              if (type === 'strategy') {
                const strat = item as StrategyType;
                scoreDisplay = `${strat.multiplier}x`;
                scoreClass = strat.multiplier < 1
                  ? 'text-orange-500 border-orange-500 bg-orange-500/10'
                  : 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
              } else {
                const scoredItem = item as (Protocol | Asset);
                scoreDisplay = scoredItem.score;
                scoreClass = getRiskColorClass(scoredItem.score);
              }

              const typeText = type === 'protocol'
                ? (item as Protocol).role
                : type === 'asset'
                  ? (item as Asset).type
                  : (item as StrategyType).reason;

              const nameText = item.name;

              return (
                <tr key={item.id} className={`${rowClass} transition-colors`}>
                  <td className="px-4 py-3 font-bold text-gray-200">
                    {nameText}
                    {isMin && (
                      <span className="ml-2 text-xs text-red-500 border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 rounded uppercase">
                        Primary
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm max-w-[150px] truncate">
                    {typeText}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-sm font-mono font-bold border ${scoreClass}`}>
                      {scoreDisplay}
                    </span>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-600 text-xs italic">
                  No items selected
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
