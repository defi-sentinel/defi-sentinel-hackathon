'use client';

import React, { useState, useMemo } from 'react';
import { ProtocolDetail } from '@/lib/types';
import { Vote, Wallet, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProtocolGovernanceProps {
  protocol: ProtocolDetail;
}

const ProtocolGovernance: React.FC<ProtocolGovernanceProps> = ({ protocol }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'All'>('30d');

  if (!protocol.governance) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">This protocol does not have governance or token information.</p>
      </div>
    );
  }

  const { governance } = protocol;

  const priceData = useMemo(() => {
    if (!governance.token?.history) return [];

    // History is now an object with pre-calculated arrays
    const historyObj = governance.token.history;
    let dataPoints: number[] = [];

    if (timeRange === '7d') {
      dataPoints = historyObj.day7 || [];
    } else if (timeRange === '30d') {
      dataPoints = historyObj.day30 || [];
    } else {
      dataPoints = historyObj.all || [];
    }

    // Map to recharts format (just index based or simple mock dates if dates aren't strictly provided for each point yet)
    // Users requested "3 lists", so we assume backend sends array of numbers. 
    // Wait, type definition has `history: { day7: number[], ... }`. 
    // Front end needs { date, price } for chart.
    // If backend sends just numbers, we need to mock dates or just use index.
    // Let's assume we map them to a simple index or relative days for now as the prompt implied just "lists".
    // Actually, seed data has numbers. I'll map to simple objects.

    // Generate dates working backwards from today
    const today = new Date();

    // For 'All', we interpolate between launchDate (if available) and today
    // If launchDate missing, default to 1 year ago.
    const launchDateStr = protocol.launchDate;
    const launchDate = launchDateStr ? new Date(launchDateStr) : new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    return dataPoints.map((price, i) => {
      let date = new Date(today);

      if (timeRange === '7d') {
        // Last 7 days
        date.setDate(today.getDate() - (dataPoints.length - 1 - i));
      } else if (timeRange === '30d') {
        // Last 30 days
        date.setDate(today.getDate() - (dataPoints.length - 1 - i));
      } else {
        // 'All': Linear interpolation from launchDate to Today
        const totalTime = today.getTime() - launchDate.getTime();
        const timeStep = totalTime / Math.max(1, dataPoints.length - 1);
        date = new Date(launchDate.getTime() + (i * timeStep));
      }

      return {
        date: date.toISOString(),
        price: price
      };
    });
  }, [timeRange, governance.token?.history]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="h-full">
        <div className="pb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Vote className="w-5 h-5" /> Governance Model
          </h3>
        </div>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model Overview</div>
            <div className="prose prose-sm dark:prose-invert">
              {/* Render simple string or markdown */}
              <p>{governance.model}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full">
        <div className="pb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" /> Tokenomics
          </h3>
        </div>
        <div className="space-y-6">
          {governance.token ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Token Price</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">${governance.token.price?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {governance.token.marketCap >= 1e9
                      ? `$${(governance.token.marketCap / 1e9).toFixed(2)}B`
                      : governance.token.marketCap >= 1e6
                        ? `$${(governance.token.marketCap / 1e6).toFixed(0)}M`
                        : `$${(governance.token.marketCap / 1e3).toFixed(0)}K`
                    }
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Price History</h4>
                  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    {(['7d', '30d', 'All'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeRange === range
                          ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[200px] bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(str) => {
                          const date = new Date(str);
                          if (timeRange === 'All') { // 'All' assumes backend sends 'all'
                            return date.toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }); // mm/yyyy
                          }
                          return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }); // mm/dd
                        }}
                        stroke="#9ca3af"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                      />
                      <YAxis
                        tickFormatter={(val) => `$${val.toFixed(2)}`}
                        stroke="#9ca3af"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={1000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">This protocol does not have a token.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolGovernance;
