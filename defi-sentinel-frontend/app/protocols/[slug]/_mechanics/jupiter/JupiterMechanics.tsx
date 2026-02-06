'use client';

import React, { useState, useEffect } from 'react';
import { ProtocolDetail } from '@/lib/types';
import { JupiterVisualizer } from './JupiterVisualizer';
import { Activity, Zap, Info, ArrowRight, Shuffle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface JupiterMechanicsProps {
    protocol: ProtocolDetail;
}

const JupiterMechanics: React.FC<JupiterMechanicsProps> = ({ protocol }) => {
    const [tradeSize, setTradeSize] = useState(25);
    const [isSwapping, setIsSwapping] = useState(false);

    // Simulate a swap ending automatically
    useEffect(() => {
        if (isSwapping) {
            const timer = setTimeout(() => setIsSwapping(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isSwapping]);

    return (
        <div className="w-full bg-slate-900  rounded-2xl p-6 shadow-2xl space-y-8">
            {/* Header Control Panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <Zap className="text-lime-400 fill-lime-400/20" size={24} />
                        Smart Routing Engine
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Interactive demo: Simulate how Jupiter splits orders across Solana DEXs.
                    </p>
                </div>
                <button
                    onClick={() => setIsSwapping(true)}
                    disabled={isSwapping}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${isSwapping ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-lime-500 text-slate-900 hover:brightness-110 hover:shadow-lime-500/20 active:scale-95'}`}
                >
                    {isSwapping ? (
                        <>
                            <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" /> Routing...
                        </>
                    ) : 'Simulate Swap'}
                </button>
            </div>

            {/* The Visualization Component */}
            <JupiterVisualizer tradeSize={tradeSize} isSwapping={isSwapping} />

            {/* Sliders / Inputs */}
            <div className="px-2 sm:px-4">
                <div className="flex justify-between text-sm mb-3 font-medium">
                    <span className="text-slate-400">Trade Size (SOL)</span>
                    <span className="text-lime-400 font-mono">
                        {tradeSize < 30 ? '< 100 SOL' : tradeSize < 70 ? '~1,000 SOL' : '10,000+ SOL'}
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={tradeSize}
                    onChange={(e) => setTradeSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-500 hover:accent-lime-400 transition-colors"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>Small Trade</span>
                    <span>Whale Trade</span>
                </div>
            </div>

            {/* Dynamic Legend */}
            <div className="flex justify-center">
                <AnimatePresence mode="wait">
                    {tradeSize < 30 ? (
                        <motion.div
                            key="direct"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 text-lime-400 text-xs font-semibold border border-lime-400/20"
                        >
                            <ArrowRight size={12} /> Direct Route (Low Slippage)
                        </motion.div>
                    ) : (
                        <motion.div
                            key="split"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20"
                        >
                            <Shuffle size={12} /> Smart Split (Multi-Hop)
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Explanation Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-green-500/10">
                            <Activity size={16} className="text-green-400" />
                        </div>
                        Slippage Protection
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        By splitting large trades across multiple liquidity pools (like Orca and Raydium), the engine ensures your trade doesn't drain a single pool.
                    </p>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-blue-500/10">
                            <Info size={16} className="text-blue-400" />
                        </div>
                        Atomic Composition
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Trades are "atomic", meaning they either succeed completely or fail completely. If one part of the split route fails, the entire transaction reverts.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JupiterMechanics;
