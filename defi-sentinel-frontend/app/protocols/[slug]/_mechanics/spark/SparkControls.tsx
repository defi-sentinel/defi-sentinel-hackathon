import React from 'react';
import { SparkState } from './types';

interface Props {
    sparkState: SparkState;
    onUpdate: (updates: Partial<SparkState>) => void;
}

const SparkControls: React.FC<Props> = ({ sparkState, onUpdate }) => {
    return (
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Simulation Controls
            </h3>

            <div className="space-y-8">

                {/* Section: User Actions */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300">Deposit Collateral (ETH)</label>
                            <span className="text-sm text-blue-400 font-mono">{sparkState.collateralAmount} ETH</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            step="0.5"
                            value={sparkState.collateralAmount}
                            onChange={(e) => onUpdate({ collateralAmount: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300">Borrow DAI</label>
                            <span className="text-sm text-amber-400 font-mono">{sparkState.borrowAmount.toLocaleString()} DAI</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={sparkState.borrowAmount}
                            onChange={(e) => onUpdate({ borrowAmount: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-300">Supply DAI (Earn DSR)</label>
                            <span className="text-sm text-emerald-400 font-mono">{sparkState.supplyDaiAmount.toLocaleString()} DAI</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50000"
                            step="500"
                            value={sparkState.supplyDaiAmount}
                            onChange={(e) => onUpdate({ supplyDaiAmount: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>
                </div>

                {/* Right Col: Market Conditions */}
                <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-bold text-slate-200">Market Simulation</h4>
                                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-400">External Factors</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-slate-400">ETH Price</label>
                                    <span className="text-sm text-white font-mono">${sparkState.ethPrice}</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="5000"
                                    step="50"
                                    value={sparkState.ethPrice}
                                    onChange={(e) => onUpdate({ ethPrice: parseFloat(e.target.value) })}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                                    <span>Bear Market ($500)</span>
                                    <span>Bull Market ($5000)</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="text-slate-400">Loan-to-Value (LTV)</span>
                                    <span className="text-slate-200 font-mono">
                                        {sparkState.collateralValue > 0
                                            ? ((sparkState.borrowAmount / sparkState.collateralValue) * 100).toFixed(1)
                                            : '0.0'}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${sparkState.healthFactor < 1.1 ? 'bg-red-500' : 'bg-indigo-500'}`}
                                        style={{ width: `${Math.min(100, (sparkState.borrowAmount / (sparkState.collateralValue || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="text-xs text-slate-500 italic">
                        * Note: Spark liquidation threshold for ETH is ~82%. If LTV exceeds this, your collateral is at risk.
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SparkControls;
