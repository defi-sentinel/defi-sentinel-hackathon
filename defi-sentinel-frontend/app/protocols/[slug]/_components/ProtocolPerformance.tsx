'use client';

import React, { useState, useMemo } from 'react';
import { ProtocolDetail } from '@/lib/types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, Coins, TrendingUp, Calendar } from 'lucide-react';

interface ProtocolPerformanceProps {
  protocol: ProtocolDetail;
}

const FundingTimeline = ({ protocol }: { protocol: ProtocolDetail }) => {
  // Use real funding history if available, otherwise show empty state or fallback
  const fundingRounds = protocol.fundingHistory || [];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);

  const totalRaised = fundingRounds.reduce((sum, round) => sum + round.amount, 0);

  if (fundingRounds.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
        <DollarSign className="w-12 h-12 mb-3 opacity-20" />
        <p>No funding history available</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Funding Timeline</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRaised)}</div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pl-2 pr-2 scrollbar-hide">
        {fundingRounds.map((round, idx) => (
          <div key={idx} className="relative pl-6 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900"></div>
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{round.round}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {round.date}
                </div>
              </div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(round.amount)}</div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {round.investors.map((investor, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {investor}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Scroll indicator */}
      {fundingRounds.length > 3 && (
        <div className="pt-2 flex justify-center items-center text-xs text-gray-400 dark:text-gray-500 animate-pulse">
          <span>Scroll down for more details</span>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, percentile, icon: Icon, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center gap-3 flex-1 ${active
      ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 dark:border-emerald-500 shadow-md ring-1 ring-emerald-500'
      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm'
      }`}
  >
    <div className={`p-2 rounded-lg flex-shrink-0 ${active ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
      <div className="text-2xl font-bold mt-1 text-gray-900 dark:text-white truncate">{value}</div>
    </div>
    {percentile !== undefined && (
      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
        <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">{percentile}%</span>
        <div className="w-2.5 h-16 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
          <div
            className={`w-full bg-gradient-to-t ${percentile < 33 ? 'from-red-500 to-red-400' : percentile <= 66 ? 'from-yellow-400 to-yellow-300' : 'from-emerald-500 to-emerald-400'} rounded-full transition-all duration-500 absolute bottom-0`}
            style={{ height: `${percentile}%` }}
          />
        </div>
        <span className="text-[9px] text-gray-500 dark:text-gray-400 text-center leading-tight">Beat</span>
      </div>
    )}
  </button>
);

const ProtocolPerformance: React.FC<ProtocolPerformanceProps> = ({ protocol }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'All'>('30d');
  const [activeMetric, setActiveMetric] = useState<'tvl' | 'revenue' | 'raised'>('tvl');

  // Enforce valid time range when switching metrics
  React.useEffect(() => {
    if (activeMetric === 'revenue' && timeRange === 'All') {
      setTimeRange('30d');
    }
  }, [activeMetric, timeRange]);

  const chartData = useMemo(() => {
    // Determine data source based on active metric
    let rawData: number[] = [];
    if (activeMetric === 'tvl') {
      // Handle both array and object formats for tvlHistory
      const tvlHistory = protocol.tvlHistory;
      if (Array.isArray(tvlHistory)) {
        // Old format: array of values or objects with .value
        rawData = tvlHistory.map((val: any) => typeof val === 'object' ? val.value : val);
      } else if (tvlHistory && typeof tvlHistory === 'object') {
        // New format: { day7: [], day30: [], all: [] }
        if (timeRange === '7d' && tvlHistory.day7) {
          rawData = tvlHistory.day7;
        } else if (timeRange === '30d' && tvlHistory.day30) {
          rawData = tvlHistory.day30;
        } else if (tvlHistory.all) {
          rawData = tvlHistory.all;
        }
      }
    } else if (activeMetric === 'revenue') {
      const revHistory = protocol.revenueHistory;
      if (revHistory) {
        if (typeof revHistory === 'string') {
          // Handle stringified JSON if it comes that way (unlikely via API but possible)
          try {
            const parsed = JSON.parse(revHistory);
            if (timeRange === '7d' && parsed.day7) rawData = parsed.day7;
            else if (timeRange === '30d' && parsed.day30) rawData = parsed.day30;
            else if (parsed.all) rawData = parsed.all;
          } catch (e) { }
        } else if (typeof revHistory === 'object' && !Array.isArray(revHistory)) {
          const histObj = revHistory as { day7?: number[]; day30?: number[]; all?: number[] };
          if (timeRange === '7d' && histObj.day7) rawData = histObj.day7;
          else if (timeRange === '30d' && histObj.day30) rawData = histObj.day30;
          else if (histObj.all) rawData = histObj.all;
        }
      }
    }

    if (rawData.length === 0) {
      // Fallback generator if no data
      const limit = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      return Array.from({ length: limit }).map((_, i) => ({
        date: new Date(Date.now() - (limit - 1 - i) * 86400000).toISOString().split('T')[0],
        value: 0
      }));
    }

    // For object format, data is already filtered by range
    // For array format, we need to slice
    let slicedData = rawData;
    if (Array.isArray(protocol.tvlHistory)) {
      if (timeRange === '7d') slicedData = rawData.slice(-7);
      else if (timeRange === '30d') slicedData = rawData.slice(-30);
    }

    // Map to chart format
    // If backend provides dates, use them. If not, generate dates backwards from today.
    return slicedData.map((val, i) => {
      const points = slicedData.length;
      const date = new Date();
      date.setDate(date.getDate() - (points - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        value: val
      };
    });

  }, [timeRange, activeMetric, protocol.tvlHistory, protocol.revenueHistory]);

  const averageValue = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0) / chartData.length;
  }, [chartData]);

  const currentTvl = useMemo((): number => {
    // Decoupled from chartData/activeMetric to ensure stability
    const tvlHistory = protocol.tvlHistory;
    let latestValue = 0;

    if (Array.isArray(tvlHistory)) {
      if (tvlHistory.length > 0) latestValue = typeof tvlHistory[tvlHistory.length - 1] === 'object' ? (tvlHistory[tvlHistory.length - 1] as any).value : tvlHistory[tvlHistory.length - 1];
    } else if (tvlHistory && typeof tvlHistory === 'object' && !Array.isArray(tvlHistory)) {
      // Try to find the latest value from available ranges
      const histObj = tvlHistory as { day7?: number[]; day30?: number[]; all?: number[] };
      const allData = histObj.day7 || histObj.day30 || histObj.all || [];
      if (allData.length > 0) {
        latestValue = allData[allData.length - 1]; // Assuming primitive numbers in new format based on dataSync analysis
      }
    }

    // Fallback to static DB value if history is empty or 0
    // protocol.tvl is a formatted string like "$1.5B", so we use tvlValue instead
    return latestValue || (protocol as any).tvlValue || 0;
  }, [protocol.tvlHistory, protocol.tvl]);

  const totalRaised = useMemo(() => {
    const rounds = protocol.fundingHistory || [];
    if (rounds.length > 0) {
      return rounds.reduce((sum, round) => sum + round.amount, 0);
    }
    return protocol.metrics.totalRaised || 0; // Fallback to metric if no history
  }, [protocol.fundingHistory, protocol.metrics.totalRaised]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> Protocol Metrics
        </h3>

        {/* Time Range Switcher - Hide for Total Raised */}
        {activeMetric !== 'raised' && (
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {(activeMetric === 'revenue' ? ['7d', '30d'] : ['7d', '30d', 'All']).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === range
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Metrics Cards */}
          <div className="w-full lg:w-1/4 flex flex-col gap-2 lg:h-[420px]">
            <MetricCard
              label="Total Value Locked"
              value={formatCurrency(currentTvl)}
              percentile={protocol.metrics.tvlPercentile || 0}
              icon={DollarSign}
              active={activeMetric === 'tvl'}
              onClick={() => setActiveMetric('tvl')}
            />
            <MetricCard
              label="Revenue (Ann.)"
              value={protocol.metrics.revenueAnnualized ? formatCurrency(protocol.metrics.revenueAnnualized) : 'N/A'}
              percentile={protocol.metrics.revenuePercentile || 0}
              icon={Coins}
              active={activeMetric === 'revenue'}
              onClick={() => setActiveMetric('revenue')}
            />
            <MetricCard
              label="Total Raised"
              value={formatCurrency(totalRaised)}
              percentile={protocol.metrics.raisedPercentile || 0}
              icon={TrendingUp}
              active={activeMetric === 'raised'}
              onClick={() => setActiveMetric('raised')}
            />
          </div>

          {/* Right: Chart or Funding Timeline */}
          <div className="w-full lg:w-3/4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 relative h-[420px]">
            {activeMetric === 'raised' ? (
              <FundingTimeline protocol={protocol} />
            ) : (
              <>
                <div className="absolute top-4 left-4 z-10">
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {activeMetric === 'tvl' ? 'TVL Trend' : 'Daily Revenue'}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(chartData[chartData.length - 1].value)}
                  </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 80, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.06} vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(str) => {
                        const date = new Date(str);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                      stroke="#9ca3af"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={40}
                    />
                    <YAxis
                      hide={false} // Requested to keep Y axis
                      tickFormatter={(val) => formatCurrency(val)}
                      orientation="right"
                      stroke="#9ca3af"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#1f2937' }}
                      itemStyle={{ color: '#10b981', fontWeight: 600 }}
                      formatter={(value: number) => [formatCurrency(value), activeMetric.toUpperCase()]}
                      labelFormatter={(label) => new Date(label).toDateString()}
                    />

                    {/* Average Line */}
                    <ReferenceLine
                      y={averageValue}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      opacity={0.6}
                      label={{
                        value: `Avg: ${formatCurrency(averageValue)}`,
                        position: 'insideLeft',
                        fill: '#10b981',
                        fontSize: 12,
                        fontWeight: 600
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorGradient)"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolPerformance;
