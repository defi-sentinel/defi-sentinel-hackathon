import React from 'react';
import { ProtocolDetail } from '@/lib/types';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, Users, Coins } from 'lucide-react';

interface ProtocolMetricsProps {
  protocol: ProtocolDetail;
}

const MetricCard = ({ label, value, subValue, icon: Icon, trend }: any) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <div className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</div>
      {subValue && (
        <div className={`text-xs mt-1 flex items-center ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : trend === 'down' ? <ArrowDownRight className="w-3 h-3 mr-1" /> : null}
          {subValue}
        </div>
      )}
    </div>
    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white">
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

const ProtocolMetrics: React.FC<ProtocolMetricsProps> = ({ protocol }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);

  const metrics = protocol.metrics || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="TVL"
        value={protocol.tvl}
        subValue={metrics.tvlChange7d ? `${metrics.tvlChange7d}% (7d)` : 'N/A'}
        trend={(metrics.tvlChange7d || 0) >= 0 ? 'up' : 'down'}
        icon={DollarSign}
      />
      <MetricCard
        label="Volume (24h)"
        value={metrics.volume24h ? formatCurrency(metrics.volume24h) : 'N/A'}
        subValue="Daily Volume"
        icon={Activity}
      />
      <MetricCard
        label="Revenue (Ann.)"
        value={metrics.revenueAnnualized ? formatCurrency(metrics.revenueAnnualized) : 'N/A'}
        subValue="Protocol Revenue"
        icon={Coins}
      />
      <MetricCard
        label="Active Users"
        value={metrics.activeUsers?.toLocaleString() || 'N/A'}
        subValue="Daily Active"
        icon={Users}
      />
    </div>
  );
};

export default ProtocolMetrics;
