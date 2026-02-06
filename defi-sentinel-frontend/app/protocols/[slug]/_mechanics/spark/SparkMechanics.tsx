import React, { useState } from 'react';
import SparkAnimation from './SparkAnimation';
import SparkControls from './SparkControls';
import { SparkState, DEFAULT_STATE } from './types';
import { Info, Zap } from 'lucide-react';

const SparkMechanics: React.FC = () => {
    // State
    const [sparkState, setSparkState] = useState<SparkState>(DEFAULT_STATE);

    // Logic to calculate derived state
    const calculateDerivedState = (state: SparkState) => {
        const ethPrice = state.ethPrice;
        const daiPrice = 1;

        const collateralValue = state.collateralAmount * ethPrice;
        const borrowValue = state.borrowAmount * daiPrice;

        // Max LTV for ETH on Spark is approx 82%
        const liquidationThreshold = 0.82;

        let healthFactor = 0;
        if (borrowValue > 0) {
            healthFactor = (collateralValue * liquidationThreshold) / borrowValue;
        } else {
            healthFactor = 999; // Infinite safety
        }

        return { ...state, healthFactor, collateralValue };
    };

    const handleStateChange = (updates: Partial<SparkState>) => {
        setSparkState(prev => calculateDerivedState({ ...prev, ...updates }));
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 w-full h-full">

            {/* Left Column: Controls */}
            <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                <SparkControls sparkState={sparkState} onUpdate={handleStateChange} />
            </div>

            {/* Right Column: Animation & Info */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Animation Stage */}
                <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-1">
                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-indigo-500" /> Liquidity Flow
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Collateral</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Earn</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Borrow</div>
                        </div>
                    </div>
                    <div className="p-4">
                        <SparkAnimation sparkState={sparkState} />
                    </div>
                </div>

                {/* How It Works Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/50 shadow-md">
                        <strong className="text-white block mb-2 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Supply & Earn
                        </strong>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Deposit DAI to access the DAI Savings Rate (DSR). Effectively lending to the Maker protocol earning yield from revenue.
                        </p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/50 shadow-md">
                        <strong className="text-white block mb-2 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Collateralize
                        </strong>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Deposit volatile assets like ETH as collateral to mint or borrow DAI without selling your holdings.
                        </p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/50 shadow-md">
                        <strong className="text-white block mb-2 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Efficiency Mode
                        </strong>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            High-leverage borrowing for correlated assets (e.g. ETH vs wstETH) with up to 98% LTV maximizing efficiency.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SparkMechanics;
