import React, { useState, useMemo } from 'react';
import { RefreshCw, Info, ShieldCheck, Zap } from 'lucide-react';
import MorphoAnimation from './MorphoAnimation';
import RateChart from './RateChart';
import { SimulationState, ChartDataPoint } from './types';

const MorphoMechanics: React.FC = () => {
    // State for the simulation
    const [simulation, setSimulation] = useState<SimulationState>({
        p2pMatchingRatio: 0.5, // 50% matched initially
        poolSupplyApy: 2.5,
        poolBorrowApy: 6.0,
        p2pApy: 4.25, // Mid-rate
    });

    // Derived calculations for the current state
    const currentSupplyApy = useMemo(() => {
        return (simulation.p2pMatchingRatio * simulation.p2pApy) +
            ((1 - simulation.p2pMatchingRatio) * simulation.poolSupplyApy);
    }, [simulation]);

    const currentBorrowApy = useMemo(() => {
        return (simulation.p2pMatchingRatio * simulation.p2pApy) +
            ((1 - simulation.p2pMatchingRatio) * simulation.poolBorrowApy);
    }, [simulation]);

    const chartData: ChartDataPoint[] = useMemo(() => [
        {
            name: 'Supply APY',
            Pool: simulation.poolSupplyApy,
            Morpho: parseFloat(currentSupplyApy.toFixed(2)),
        },
        {
            name: 'Borrow APY',
            Pool: simulation.poolBorrowApy,
            Morpho: parseFloat(currentBorrowApy.toFixed(2)),
        }
    ], [simulation, currentSupplyApy, currentBorrowApy]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSimulation(prev => ({
            ...prev,
            p2pMatchingRatio: parseFloat(e.target.value)
        }));
    };

    return (

        <div className="w-full h-full space-y-8">
            {/* Animation Stage (Hero) */}


            {/* Interactive Module Container */}
            <div className="grid lg:grid-cols-12 gap-8">

                {/* Left Column: Controls & Stats */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">

                    {/* Control Card */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                                <RefreshCw size={18} className="text-indigo-500" /> Simulation
                            </h3>
                            <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">
                                Live
                            </span>
                        </div>

                        <div className="mb-8">
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-slate-500">Pool Fallback</span>
                                <span className="text-indigo-400">P2P Matched</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={simulation.p2pMatchingRatio}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                            />
                            <div className="mt-2 text-center font-mono text-sm text-slate-400">
                                Matching Efficiency: <span className="font-bold text-white">{Math.round(simulation.p2pMatchingRatio * 100)}%</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                                <span className="text-sm text-emerald-400 font-medium">Net Supply APY</span>
                                <span className="text-xl font-bold text-emerald-500">{currentSupplyApy.toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-rose-950/30 rounded-lg border border-rose-500/20">
                                <span className="text-sm text-rose-400 font-medium">Net Borrow APY</span>
                                <span className="text-xl font-bold text-rose-500">{currentBorrowApy.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Explanation Card */}
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden border border-slate-800 flex-1">
                        <div className="relative z-10">
                            <h3 className="font-semibold flex items-center gap-2 mb-4 text-indigo-400">
                                <Info size={18} /> Protocol Mechanics
                            </h3>

                            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                                <div>
                                    <strong className="block text-slate-200 mb-1">Peer-to-Peer (P2P) Layer</strong>
                                    <p>When supply matches borrow demand, the protocol connects users directly. This eliminates the pool's fee spread, splitting the benefit to give lenders higher yields and borrowers lower costs.</p>
                                </div>
                                <div>
                                    <strong className="block text-slate-200 mb-1">Liquidity Fallback</strong>
                                    <p>If no direct match is available, funds automatically flow to the underlying pool (like Aave or Compound). This ensures you always have liquidity and earn at least the standard market rate.</p>
                                </div>
                            </div>
                        </div>

                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                </div>



                {/* Right Column: Visualization */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Animation Stage */}
                    <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-1">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-300">Liquidity Flow</h3>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> P2P</div>
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-600"></div> Pool</div>
                            </div>
                        </div>
                        <div className="p-4">
                            <MorphoAnimation matchingRatio={simulation.p2pMatchingRatio} />
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
                            <div className="mb-4">
                                <h3 className="font-semibold text-slate-400 text-sm uppercase tracking-wide">The Spread</h3>
                                <p className="text-xs text-slate-500 mt-1">Difference between Supply and Borrow rates</p>
                            </div>
                            <div className="h-32 flex items-end justify-center gap-8 relative">
                                {/* Pool Spread */}
                                <div className="flex flex-col items-center gap-2 w-16 group">
                                    <div className="w-full bg-slate-700 rounded-t-md relative transition-all duration-500" style={{ height: '100px' }}>
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-400"></div> {/* Borrow Top */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400"></div> {/* Supply Bottom */}
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-300">
                                            {(simulation.poolBorrowApy - simulation.poolSupplyApy).toFixed(1)}%
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">Pool</span>
                                </div>

                                {/* Morpho Spread */}
                                <div className="flex flex-col items-center gap-2 w-16">
                                    <div
                                        className="w-full bg-indigo-500/20 rounded-t-md relative transition-all duration-500 overflow-hidden"
                                        style={{ height: `${100 * (currentBorrowApy - currentSupplyApy) / (simulation.poolBorrowApy - simulation.poolSupplyApy)}px` }}
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-400">
                                            {(currentBorrowApy - currentSupplyApy).toFixed(2)}%
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-indigo-400">Morpho</span>
                                </div>
                            </div>
                        </div>

                        <RateChart data={chartData} />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default MorphoMechanics;
