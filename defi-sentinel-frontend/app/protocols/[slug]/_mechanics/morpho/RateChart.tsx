import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { ChartDataPoint } from './types';

interface RateChartProps {
    data: ChartDataPoint[];
}

const RateChart: React.FC<RateChartProps> = ({ data }) => {
    return (
        <div className="h-64 w-full bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">APY Comparison</h3>
            <div className="w-full h-[85%]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 20,
                            left: -10,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            dy={5}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            cursor={{ fill: '#1e293b', opacity: 0.5 }}
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                borderRadius: '8px',
                                border: '1px solid #1e293b',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                                color: '#f8fafc'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#cbd5e1' }}
                        />
                        <Bar dataKey="Pool" fill="#475569" radius={[4, 4, 0, 0]} name="Standard Pool" />
                        <Bar dataKey="Morpho" fill="#6366f1" radius={[4, 4, 0, 0]} name="Morpho Optimized">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RateChart;
