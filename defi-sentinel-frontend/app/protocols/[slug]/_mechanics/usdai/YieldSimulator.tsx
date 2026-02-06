import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';

export const YieldSimulator: React.FC = () => {
    const [utilization, setUtilization] = useState(70); // 70% to GPUs
    const [depositAmount, setDepositAmount] = useState(10000);

    const GPU_APR = 20.0;
    const TBILL_APR = 4.5;

    const blendedAPR = useMemo(() => {
        return ((utilization / 100) * GPU_APR) + (((100 - utilization) / 100) * TBILL_APR);
    }, [utilization]);

    const annualYield = (depositAmount * blendedAPR) / 100;
    const monthlyYield = annualYield / 12;

    const chartData = [
        { name: 'GPU Allocation', value: utilization, color: '#FACC15' }, // Yellow-400
        { name: 'Treasury Allocation', value: 100 - utilization, color: '#34D399' }, // Emerald-400
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full min-h-[720px]">

            {/* Left Col: Controls */}
            <div className="md:col-span-7 space-y-8 bg-slate-800/30 p-8 rounded-3xl border border-slate-700 shadow-sm">
                <div>
                    <h3 className="text-2xl font-serif text-slate-200 mb-6 flex items-center gap-2">
                        <Calculator size={24} className="text-blue-400" /> Simulator
                    </h3>

                    {/* Utilization Slider */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-semibold text-slate-400">Protocol Utilization (GPUs)</label>
                            <span className="text-sm font-bold text-slate-200">{utilization}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={utilization}
                            onChange={(e) => setUtilization(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Higher utilization means more funds are used to buy GPUs for AI lending, increasing risk but boosting yield.
                        </p>
                    </div>

                    {/* Deposit Input */}
                    <div className="mb-8">
                        <label className="text-sm font-semibold text-slate-400 mb-2 block">Your Deposit (USDC)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign size={18} className="text-slate-500" />
                            </div>
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(Number(e.target.value))}
                                className="block w-full pl-10 pr-12 py-3 border border-slate-700 rounded-xl bg-slate-900 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Breakdown Panel */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">GPU Source APR</div>
                        <div className="text-xl font-bold text-yellow-400">{GPU_APR.toFixed(1)}%</div>
                        <div className="text-xs text-slate-400 mt-1">Weight: {utilization}%</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Treasury Source APR</div>
                        <div className="text-xl font-bold text-emerald-400">{TBILL_APR.toFixed(1)}%</div>
                        <div className="text-xs text-slate-400 mt-1">Weight: {100 - utilization}%</div>
                    </div>
                </div>
            </div>

            {/* Right Col: Results */}
            <div className="md:col-span-5 bg-slate-800 p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden border border-slate-700">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-10 transform translate-x-10 -translate-y-10"></div>

                <div>
                    <h4 className="text-slate-400 text-sm font-medium tracking-wide uppercase mb-8">Projected Returns</h4>

                    <div className="mb-8">
                        <div className="flex items-end gap-2 mb-1">
                            <span className="text-5xl font-serif text-white">{blendedAPR.toFixed(2)}%</span>
                            <span className="text-xl mb-1 text-blue-400">APY</span>
                        </div>
                        <p className="text-slate-500 text-sm">Blended Yield Rate</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                            <span className="text-slate-300">Monthly Earnings</span>
                            <span className="font-mono text-lg text-emerald-400">+${monthlyYield.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4">
                            <span className="text-slate-300">Yearly Earnings</span>
                            <span className="font-mono text-xl font-bold text-emerald-400">+${annualYield.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Visual Chart */}
                <div className="h-40 w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center text-xs text-slate-500 -mt-2">Portfolio Composition</div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700 flex items-center gap-2 text-xs text-slate-400">
                    <TrendingUp size={12} />
                    <span>Estimates based on historical GPU rental demand.</span>
                </div>
            </div>
        </div>
    );
};
