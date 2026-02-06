import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Building2, ShieldAlert, TrendingUp, Info } from 'lucide-react';
import { SimulationState } from './types';
import { Tooltip } from './Tooltip';

const ETH_PRICE_INITIAL = 2500;
const MAX_LTV = 0.80; // 80% Loan to Value
const LIQUIDATION_THRESHOLD = 0.85;

export const AaveSimulation: React.FC = () => {
    const [state, setState] = useState<SimulationState>({
        collateralAmount: 0,
        borrowAmount: 0,
        ethPrice: ETH_PRICE_INITIAL,
        usdcPrice: 1,
        userWalletEth: 10, // User starts with 10 ETH
        userWalletUsdc: 0,
        isDragging: false,
        activeDirection: null,
    });

    // Derived calculations
    const totalCollateralValue = state.collateralAmount * state.ethPrice;
    const maxBorrowValue = totalCollateralValue * MAX_LTV;
    const currentBorrowValue = state.borrowAmount;

    // Health Factor = (Collateral Value * Liquidation Threshold) / Total Borrows
    const healthFactor = useMemo(() => {
        if (currentBorrowValue === 0) return Infinity;
        return (totalCollateralValue * LIQUIDATION_THRESHOLD) / currentBorrowValue;
    }, [totalCollateralValue, currentBorrowValue]);

    // APY Simulation (Simple curve based on utilization)
    const utilization = useMemo(() => {
        // Mock pool size of 1M USDC
        const poolSize = 1000000;
        return Math.min((state.borrowAmount + 500000) / poolSize, 1);
    }, [state.borrowAmount]);

    const borrowApy = 2 + (utilization * 15); // Base 2% + up to 15%
    const supplyApy = borrowApy * 0.9; // Spread

    const handleSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setState(prev => ({
            ...prev,
            collateralAmount: val,
            activeDirection: 'supply'
        }));
    };

    const handleBorrowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        // Prevent borrowing more than allowed in UI logic (though contract would revert)
        const maxUsdc = (state.collateralAmount * state.ethPrice * MAX_LTV);
        const safeVal = Math.min(val, maxUsdc);

        setState(prev => ({
            ...prev,
            borrowAmount: safeVal,
            activeDirection: 'borrow'
        }));
    };

    // Auto-reset active direction for animation triggers
    useEffect(() => {
        if (state.activeDirection) {
            const timer = setTimeout(() => {
                setState(prev => ({ ...prev, activeDirection: null }));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state.activeDirection]);

    const getHealthColor = (hf: number) => {
        if (hf === Infinity) return 'text-emerald-400';
        if (hf > 2) return 'text-emerald-400';
        if (hf > 1.1) return 'text-yellow-400';
        return 'text-red-500 animate-pulse';
    };

    const isLiquidated = healthFactor < 1.0 && state.borrowAmount > 0;

    return (
        <div className="w-full bg-slate-900 rounded-2xl p-6 relative overflow-hidden">

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: User Wallet / Controls */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col gap-6 h-[480px]">
                    <div className="flex items-center gap-2 mb-2">
                        <Wallet className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-semibold text-white">Your Wallet</h2>
                    </div>

                    {/* Supply Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Supply Collateral (ETH)</span>
                            <span className={`font-mono transition-colors ${isLiquidated ? 'text-red-500 font-bold' : 'text-white'}`}>
                                {isLiquidated ? '0.00 ETH (SLASHED)' : `${state.collateralAmount.toFixed(2)} ETH`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={state.collateralAmount}
                            onChange={handleSupplyChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="text-xs text-slate-500 flex justify-between">
                            <span>0 ETH</span>
                            <span>10 ETH</span>
                        </div>
                    </div>

                    {/* Borrow Control */}
                    <div className={`space-y-3 transition-opacity ${state.collateralAmount > 0 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Borrow USDC</span>
                            <span className="text-white font-mono">{state.borrowAmount.toLocaleString()} USDC</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={Math.floor(maxBorrowValue)}
                            step="100"
                            value={state.borrowAmount}
                            onChange={handleBorrowChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="text-xs text-slate-500 flex justify-between">
                            <span>0 USDC</span>
                            <span>Max: ${(maxBorrowValue).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Price Simulator */}
                    <div className="mt-4 pt-4 border-t border-slate-700">
                        <label className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2 block">Market Conditions (Simulate Crash)</label>
                        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-700">
                            <span className="text-sm text-slate-300">ETH Price</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setState(s => ({ ...s, ethPrice: Math.max(100, s.ethPrice - 100) }))}
                                    className="w-6 h-6 flex items-center justify-center bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                                >-</button>
                                <span className={`font-mono font-bold ${state.ethPrice < ETH_PRICE_INITIAL ? 'text-red-400' : 'text-emerald-400'}`}>
                                    ${state.ethPrice}
                                </span>
                                <button
                                    onClick={() => setState(s => ({ ...s, ethPrice: s.ethPrice + 100 }))}
                                    className="w-6 h-6 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                                >+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: The Protocol (Visualizer) */}
                <div className="flex flex-col items-center justify-center relative min-h-[300px]">
                    {/* Flow Animations */}
                    <AnimatePresence>
                        {state.activeDirection === 'supply' && (
                            <motion.div
                                initial={{ x: -100, opacity: 0, scale: 0.5 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-1/3 left-10 z-20 pointer-events-none"
                            >
                                <div className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full shadow-lg shadow-emerald-500/50">
                                    + ETH
                                </div>
                            </motion.div>
                        )}
                        {state.activeDirection === 'borrow' && (
                            <motion.div
                                initial={{ x: 0, opacity: 0, scale: 0.5 }}
                                animate={{ x: -100, opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute bottom-1/3 right-10 z-20 pointer-events-none"
                            >
                                <div className="bg-sky-600 text-white text-xs px-2 py-1 rounded-full shadow-lg shadow-sky-500/50">
                                    + USDC
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* The Pool Graphic */}
                    <div className="relative w-48 h-48 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center shadow-lg">
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin-slow opacity-30"></div>
                        <div className="text-center z-10">
                            <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                            <h3 className="text-white font-bold text-lg">Aave Pool</h3>
                            <p className="text-xs text-slate-500">Liquidity Market</p>
                        </div>

                        {/* Connected Lines */}
                        <div className="absolute top-1/2 -left-20 w-20 h-0.5 bg-gradient-to-r from-transparent to-emerald-500/30"></div>
                        <div className="absolute top-1/2 -right-20 w-20 h-0.5 bg-gradient-to-l from-transparent to-sky-500/30"></div>
                    </div>

                    {/* Stats Overlay */}
                    <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
                        <div className="bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                            <div className="text-xs text-slate-400 mb-1">Supply APY</div>
                            <div className="text-emerald-400 font-mono font-bold">{supplyApy.toFixed(2)}%</div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                            <div className="text-xs text-slate-400 mb-1">Borrow APY</div>
                            <div className="text-yellow-400 font-mono font-bold">{borrowApy.toFixed(2)}%</div>
                        </div>
                    </div>
                </div>

                {/* Right: Dashboard / Metrics */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col justify-between h-[480px]">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                            <h2 className="text-lg font-semibold text-white">Position Stats</h2>
                        </div>

                        {/* Health Factor Gauge */}
                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <Tooltip content="If Health Factor drops below 1.0, your collateral will be liquidated (sold) to repay the debt.">
                                    <span className="flex items-center gap-1 text-sm text-slate-400 cursor-help hover:text-white transition-colors">
                                        Health Factor <Info className="w-3 h-3" />
                                    </span>
                                </Tooltip>
                                <span className={`text-2xl font-bold font-mono transition-colors duration-300 ${getHealthColor(healthFactor)}`}>
                                    {healthFactor === Infinity ? '∞' : healthFactor.toFixed(2)}
                                </span>
                            </div>

                            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden relative">
                                {/* Gradient Bar */}
                                <div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500"
                                    style={{ width: '100%' }}
                                ></div>
                                {/* Indicator */}
                                <motion.div
                                    className="absolute top-0 w-1 h-full bg-white shadow-[0_0_10px_white]"
                                    animate={{
                                        left: healthFactor === Infinity ? '100%' : `${Math.min(Math.max((healthFactor / 3) * 100, 0), 100)}%`
                                    }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                <span>0.0 (Risk)</span>
                                <span>1.0 (Liq)</span>
                                <span>3.0+ (Safe)</span>
                            </div>
                        </div>

                        {/* Liquidation Warning */}
                        <AnimatePresence>
                            {isLiquidated && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex gap-3 items-start"
                                >
                                    <ShieldAlert className="w-6 h-6 text-red-500 shrink-0" />
                                    <div>
                                        <h4 className="text-red-400 font-bold text-sm">Liquidation Risk!</h4>
                                        <p className="text-red-300/80 text-xs mt-1">
                                            Your Health Factor is below 1.0. Liquidators can seize your ETH collateral to repay the USDC debt + a penalty bonus.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-6 space-y-2 text-sm">
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-400">Total Collateral</span>
                                <span className={`${isLiquidated ? 'text-red-500 font-bold' : 'text-white'}`}>
                                    {isLiquidated ? '$0.00' : `$${totalCollateralValue.toLocaleString()}`}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-400">Total Borrowed</span>
                                <span className="text-white">${state.borrowAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                                <span className="text-slate-400">Available to Borrow</span>
                                <span className="text-sky-400">${Math.max(0, maxBorrowValue - state.borrowAmount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-slate-900/50 p-3 rounded text-xs text-slate-400 italic text-center border border-slate-800">
                        * This is a simulation. Real rates vary.
                    </div>
                </div>
            </div>
        </div>
    );
};
