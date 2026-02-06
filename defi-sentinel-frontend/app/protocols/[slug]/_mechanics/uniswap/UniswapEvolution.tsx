'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniswapVersion } from './types';
import { Layers, Network, BarChart3, Settings2, Zap, Check, ArrowLeftRight, TrendingUp, Droplets, Activity } from 'lucide-react';

const UniswapEvolution: React.FC = () => {
    const [version, setVersion] = useState<UniswapVersion>(UniswapVersion.V3);

    // --- V1 State ---
    const [v1Animating, setV1Animating] = useState(false);
    const [v1SwapTokens, setV1SwapTokens] = useState<{ from: string; to: string } | null>(null);

    // --- V2 State ---
    const [v2Animating, setV2Animating] = useState(false);
    const [v2SwapPair, setV2SwapPair] = useState<{ from: string; to: string } | null>(null);

    // --- V3 State ---
    const [rangeSpread, setRangeSpread] = useState(50);
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    // --- V4 State ---
    const [volatility, setVolatility] = useState(50); // 0-100
    const [liquidityStrategy, setLiquidityStrategy] = useState<'fixed' | 'volume' | 'volatility'>('fixed');
    const [tradingPair, setTradingPair] = useState<'ETH/USDC' | 'ETH/DAI' | 'WBTC/ETH'>('ETH/USDC');
    const [tradeVolume, setTradeVolume] = useState(50); // 0-100

    // V1 tokens - real names
    const v1Tokens = ['USDC', 'USDT', 'WBTC'];

    // --- V3 Data Generation ---
    const histogramBars = 40;
    const histogramData = useMemo(() => {
        const data = [];
        const center = histogramBars / 2;
        const sigma = histogramBars / 6;
        for (let i = 0; i < histogramBars; i++) {
            const x = i - center;
            const height = Math.exp(-(x * x) / (2 * sigma * sigma));
            data.push(height);
        }
        return data;
    }, []);

    // Derived V3 Metrics
    const efficiency = Math.max(1, Math.round(100 * Math.pow((100 - rangeSpread) / 100, 2)));
    const estimatedApr = Math.min(100, Math.round(1 + (99 * Math.pow((100 - rangeSpread) / 100, 2))));

    const centerIdx = histogramBars / 2;
    const spreadWidth = Math.max(1, (rangeSpread / 100) * (histogramBars / 2));
    const rangeLower = centerIdx - spreadWidth;
    const rangeUpper = centerIdx + spreadWidth;

    // --- V4 Calculations ---
    const getDynamicFee = () => {
        if (volatility < 33) return { rate: 0.03, label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500' };
        if (volatility < 66) return { rate: 0.1, label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500' };
        return { rate: 0.3, label: 'High', color: 'text-red-400', bg: 'bg-red-500' };
    };

    const getLiquidityMultiplier = () => {
        switch (liquidityStrategy) {
            case 'fixed': return 1;
            case 'volume': return 0.5 + (tradeVolume / 100);
            case 'volatility': return volatility > 50 ? 1.5 : 0.8;
        }
    };

    const getPairConfig = () => {
        switch (tradingPair) {
            case 'ETH/USDC': return { baseFee: 0.05, volatilityMod: 1.0, color: 'from-blue-500 to-emerald-500' };
            case 'ETH/DAI': return { baseFee: 0.03, volatilityMod: 0.8, color: 'from-blue-500 to-yellow-500' };
            case 'WBTC/ETH': return { baseFee: 0.1, volatilityMod: 1.2, color: 'from-orange-500 to-blue-500' };
        }
    };

    const feeInfo = getDynamicFee();
    const liquidityMultiplier = getLiquidityMultiplier();
    const pairConfig = getPairConfig();
    const effectiveFee = (feeInfo.rate * pairConfig.volatilityMod).toFixed(3);
    const baseLiquidity = 1000000;
    const currentLiquidity = baseLiquidity * liquidityMultiplier;

    // V1 Animation
    const runV1Animation = () => {
        if (v1Animating) return;
        const fromIdx = Math.floor(Math.random() * 3);
        let toIdx = Math.floor(Math.random() * 3);
        while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * 3);

        setV1SwapTokens({ from: v1Tokens[fromIdx], to: v1Tokens[toIdx] });
        setV1Animating(true);
        setTimeout(() => {
            setV1Animating(false);
            setV1SwapTokens(null);
        }, 2500);
    };

    // V2 Animation
    const runV2Animation = (token: string) => {
        if (v2Animating) return;
        const tokens = ['DAI', 'USDC', 'WBTC', 'MKR'];
        const otherTokens = tokens.filter(t => t !== token);
        const toToken = otherTokens[Math.floor(Math.random() * otherTokens.length)];

        setV2SwapPair({ from: token, to: toToken });
        setV2Animating(true);
        setTimeout(() => {
            setV2Animating(false);
            setV2SwapPair(null);
        }, 2000);
    };

    const versionData = {
        [UniswapVersion.V1]: {
            icon: <Network className="text-pink-500" />,
            title: "Hub-and-Spoke",
            desc: "The first iteration. All tokens paired with ETH. Simple but capital inefficient.",
            pros: ["Simple Model", "Permissionless"],
            cons: ["ETH Bridge Required", "High Slippage"],
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            border: "border-pink-500/20"
        },
        [UniswapVersion.V2]: {
            icon: <Layers className="text-green-500" />,
            title: "ERC20 Pairs",
            desc: "Direct token-to-token pairs. Defined the standard x*y=k constant product model. Easy to use and easy to understand, but it is being slowly replaced by Uniswap V3.",
            pros: ["Direct Pairs", "Flash Swaps", "Price Oracles"],
            cons: ["Capital Inefficient (0-infinity)"],
            color: "text-green-500",
            bg: "bg-green-500/10",
            border: "border-green-500/20"
        },
        [UniswapVersion.V3]: {
            icon: <BarChart3 className="text-blue-500" />,
            title: "Concentrated Liquidity",
            desc: "LPs provide liquidity in custom price ranges, drastically increasing efficiency. Liquidity providers have the ability to increase capital efficiency, but at the cost of frequently adjusting the liquidity range if the price is volatile. Uniswap V3 also increases Impermanent Loss compared to V2.",
            pros: ["High Capital Efficiency", "Flexible Fees"],
            cons: ["Active Management Required"],
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        [UniswapVersion.V4]: {
            icon: <Settings2 className="text-purple-500" />,
            title: "Hooks & Singleton",
            desc: "A singleton contract for all pools with 'Hooks' for custom pool logic. For regular users, Uniswap V4 doesn't change the user experience that much. For liquidity providers, Uniswap V4 provides more options to use programming language to control the liquidity you provide.",
            pros: ["Dynamic Fees", "Custom Liquidity"],
            cons: ["Higher Complexity"],
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        }
    };

    const contentVariants = {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 }
    };

    const renderVisualization = () => {
        switch (version) {
            case UniswapVersion.V1:
                return (
                    <motion.div
                        key="v1"
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full flex flex-col items-center justify-center relative select-none"
                    >
                        <div className="absolute top-4 left-4 text-base text-slate-400">Click center to swap</div>
                        <div className="relative w-72 h-72 flex items-center justify-center cursor-pointer group" onClick={runV1Animation}>
                            <motion.div
                                className="absolute w-24 h-24 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-xl z-20 shadow-lg"
                                animate={v1Animating ? {
                                    scale: [1, 1.3, 1],
                                    boxShadow: ['0 0 0 0 rgba(236,72,153,0)', '0 0 30px 10px rgba(236,72,153,0.5)', '0 0 0 0 rgba(236,72,153,0)']
                                } : { scale: 1 }}
                                transition={{ duration: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                ETH
                            </motion.div>

                            {v1Animating && (
                                <>
                                    <motion.div
                                        className="absolute w-28 h-28 rounded-full border-4 border-pink-400 z-10"
                                        initial={{ scale: 0.8, opacity: 1 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 1, repeat: 2 }}
                                    />
                                    <motion.div
                                        className="absolute w-28 h-28 rounded-full border-4 border-pink-400 z-10"
                                        initial={{ scale: 0.8, opacity: 1 }}
                                        animate={{ scale: 2.5, opacity: 0 }}
                                        transition={{ duration: 1, repeat: 2, delay: 0.3 }}
                                    />
                                </>
                            )}

                            {[0, 120, 240].map((deg, i) => {
                                const tokenName = v1Tokens[i];
                                const isFromToken = v1SwapTokens?.from === tokenName;
                                const isToToken = v1SwapTokens?.to === tokenName;

                                return (
                                    <div key={deg} className="absolute w-full h-full flex items-center justify-center" style={{ transform: `rotate(${deg}deg)` }}>
                                        <motion.div
                                            className="w-1.5 h-24 rounded-full mb-36"
                                            animate={v1Animating && (isFromToken || isToToken) ? {
                                                backgroundColor: ['rgba(236,72,153,0.2)', 'rgba(236,72,153,1)', 'rgba(236,72,153,0.2)'],
                                                boxShadow: ['0 0 0px rgba(236,72,153,0)', '0 0 15px rgba(236,72,153,0.8)', '0 0 0px rgba(236,72,153,0)']
                                            } : { backgroundColor: 'rgba(236,72,153,0.2)' }}
                                            transition={{ duration: 0.5, repeat: v1Animating && (isFromToken || isToToken) ? 3 : 0 }}
                                        />

                                        <div className="absolute top-4" style={{ transform: `rotate(-${deg}deg)` }}>
                                            <motion.div
                                                className="w-16 h-16 bg-slate-900 border-2 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                                                animate={isFromToken ? {
                                                    scale: [1, 1.3, 1],
                                                    borderColor: ['rgb(236,72,153)', 'rgb(34,197,94)', 'rgb(236,72,153)']
                                                } : isToToken ? {
                                                    scale: [1, 1.3, 1],
                                                    borderColor: ['rgb(236,72,153)', 'rgb(59,130,246)', 'rgb(236,72,153)']
                                                } : { borderColor: 'rgb(236,72,153)' }}
                                                transition={{ duration: 0.8 }}
                                            >
                                                <span className={`${isFromToken ? 'text-green-400' : isToToken ? 'text-blue-400' : 'text-pink-300'}`}>
                                                    {tokenName}
                                                </span>
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <AnimatePresence>
                            {v1SwapTokens && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute bottom-8 bg-pink-900/50 border border-pink-500/50 px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <span className="text-green-400 font-bold">{v1SwapTokens.from}</span>
                                    <ArrowLeftRight className="text-pink-400" size={18} />
                                    <span className="text-white font-bold">ETH</span>
                                    <ArrowLeftRight className="text-pink-400" size={18} />
                                    <span className="text-blue-400 font-bold">{v1SwapTokens.to}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );

            case UniswapVersion.V2:
                return (
                    <motion.div
                        key="v2"
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full flex flex-col items-center justify-center relative p-8"
                    >
                        <div className="absolute top-4 left-4 text-base text-slate-400">Click a token to swap</div>

                        <div className="relative" style={{ width: '240px', height: '240px' }}>
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 240">
                                {/* Horizontal lines */}
                                <motion.line x1="48" y1="48" x2="192" y2="48" stroke="rgba(34,197,94,0.3)" strokeWidth="2"
                                    animate={v2SwapPair && ((v2SwapPair.from === 'DAI' && v2SwapPair.to === 'USDC') || (v2SwapPair.from === 'USDC' && v2SwapPair.to === 'DAI')) ? {
                                        stroke: ['rgba(34,197,94,0.3)', 'rgba(34,197,94,1)', 'rgba(34,197,94,0.3)']
                                    } : {}}
                                    transition={{ duration: 0.5, repeat: 3 }}
                                />
                                <motion.line x1="48" y1="192" x2="192" y2="192" stroke="rgba(34,197,94,0.3)" strokeWidth="2"
                                    animate={v2SwapPair && ((v2SwapPair.from === 'WBTC' && v2SwapPair.to === 'MKR') || (v2SwapPair.from === 'MKR' && v2SwapPair.to === 'WBTC')) ? {
                                        stroke: ['rgba(34,197,94,0.3)', 'rgba(34,197,94,1)', 'rgba(34,197,94,0.3)']
                                    } : {}}
                                    transition={{ duration: 0.5, repeat: 3 }}
                                />
                                {/* Vertical lines */}
                                <motion.line x1="48" y1="48" x2="48" y2="192" stroke="rgba(34,197,94,0.3)" strokeWidth="2"
                                    animate={v2SwapPair && ((v2SwapPair.from === 'DAI' && v2SwapPair.to === 'WBTC') || (v2SwapPair.from === 'WBTC' && v2SwapPair.to === 'DAI')) ? {
                                        stroke: ['rgba(34,197,94,0.3)', 'rgba(34,197,94,1)', 'rgba(34,197,94,0.3)']
                                    } : {}}
                                    transition={{ duration: 0.5, repeat: 3 }}
                                />
                                <motion.line x1="192" y1="48" x2="192" y2="192" stroke="rgba(34,197,94,0.3)" strokeWidth="2"
                                    animate={v2SwapPair && ((v2SwapPair.from === 'USDC' && v2SwapPair.to === 'MKR') || (v2SwapPair.from === 'MKR' && v2SwapPair.to === 'USDC')) ? {
                                        stroke: ['rgba(34,197,94,0.3)', 'rgba(34,197,94,1)', 'rgba(34,197,94,0.3)']
                                    } : {}}
                                    transition={{ duration: 0.5, repeat: 3 }}
                                />
                                {/* Diagonal lines */}
                                <motion.line x1="48" y1="48" x2="192" y2="192" stroke="rgba(34,197,94,0.2)" strokeWidth="1"
                                    animate={v2SwapPair && ((v2SwapPair.from === 'DAI' && v2SwapPair.to === 'MKR') || (v2SwapPair.from === 'MKR' && v2SwapPair.to === 'DAI')) ? {
                                        stroke: ['rgba(34,197,94,0.2)', 'rgba(34,197,94,1)', 'rgba(34,197,94,0.2)']
                                    } : {}}
                                    transition={{ duration: 0.5, repeat: 3 }}
                                />
                                <motion.line x1="192" y1="48" x2="48" y2="192" stroke="rgba(34,197,94,0.2)" strokeWidth="1"
                                    animate={v2SwapPair && ((v2SwapPair.from === 'USDC' && v2SwapPair.to === 'WBTC') || (v2SwapPair.from === 'WBTC' && v2SwapPair.to === 'USDC')) ? {
                                        stroke: ['rgba(34,197,94,0.2)', 'rgba(34,197,94,1)', 'rgba(34,197,94,0.2)']
                                    } : {}}
                                    transition={{ duration: 0.5, repeat: 3 }}
                                />
                            </svg>

                            {/* Token positions - absolute positioned to match SVG coordinates */}
                            {[
                                { token: 'DAI', x: 48, y: 48 },
                                { token: 'USDC', x: 192, y: 48 },
                                { token: 'WBTC', x: 48, y: 192 },
                                { token: 'MKR', x: 192, y: 192 }
                            ].map(({ token, x, y }) => {
                                const isFrom = v2SwapPair?.from === token;
                                const isTo = v2SwapPair?.to === token;

                                return (
                                    <motion.div
                                        key={token}
                                        className="absolute w-16 h-16 bg-slate-800 border-2 rounded-lg flex items-center justify-center text-base font-bold shadow-lg cursor-pointer"
                                        style={{ left: x - 32, top: y - 32 }}
                                        onClick={() => runV2Animation(token)}
                                        whileHover={{ scale: 1.1 }}
                                        animate={isFrom ? {
                                            scale: [1, 1.2, 1],
                                            borderColor: 'rgb(34,197,94)',
                                            boxShadow: ['0 0 0 0 rgba(34,197,94,0)', '0 0 20px 5px rgba(34,197,94,0.5)', '0 0 0 0 rgba(34,197,94,0)']
                                        } : isTo ? {
                                            scale: [1, 1.2, 1],
                                            borderColor: 'rgb(59,130,246)',
                                            boxShadow: ['0 0 0 0 rgba(59,130,246,0)', '0 0 20px 5px rgba(59,130,246,0.5)', '0 0 0 0 rgba(59,130,246,0)']
                                        } : {
                                            borderColor: 'rgba(34,197,94,0.3)'
                                        }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <span className={`${isFrom ? 'text-green-400' : isTo ? 'text-blue-400' : 'text-green-300'}`}>
                                            {token}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <AnimatePresence>
                            {v2SwapPair && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute bottom-8 bg-green-900/50 border border-green-500/50 px-4 py-2 rounded-lg flex items-center gap-3"
                                >
                                    <span className="text-green-400 font-bold">{v2SwapPair.from}</span>
                                    <ArrowLeftRight className="text-green-400" size={18} />
                                    <span className="text-blue-400 font-bold">{v2SwapPair.to}</span>
                                    <span className="text-slate-400 text-sm">(Direct Pair)</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );

            case UniswapVersion.V3:
                // Calculate range bounds immediately from rangeSpread
                const currentRangeLower = (rangeLower / histogramBars) * 100;
                const currentRangeUpper = ((histogramBars - rangeUpper - 1) / histogramBars) * 100;

                return (
                    <motion.div
                        key="v3"
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full flex flex-col relative px-8 py-6"
                    >
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <div className="text-sm text-slate-400 font-bold uppercase mb-1">Efficiency</div>
                                <div className="text-4xl font-black text-white flex items-center gap-2">
                                    <Zap className="text-yellow-400 fill-yellow-400" size={28} />
                                    {efficiency}x
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-400 font-bold uppercase mb-1">Est. LP APR</div>
                                <div className="text-3xl font-bold text-green-400">{estimatedApr}%</div>
                            </div>
                        </div>
                        <div className="flex-1 relative flex items-end justify-between gap-0.5 border-b border-slate-700 pb-px">
                            {histogramData.map((h, i) => (
                                <motion.div
                                    key={i}
                                    onMouseEnter={() => setHoveredBar(i)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                    className={`flex-1 rounded-t ${i >= rangeLower && i <= rangeUpper ? 'bg-blue-500 shadow-sm' : 'bg-slate-800'}`}
                                    style={{ height: `${h * 80}%`, opacity: hoveredBar === i ? 1 : 0.8 }}
                                />
                            ))}
                            {/* Range overlay - no animation delay */}
                            <div className="absolute inset-0 pointer-events-none flex">
                                <div
                                    className="h-full bg-slate-950/60 border-r-2 border-blue-400"
                                    style={{ width: `${currentRangeLower}%` }}
                                />
                                <div className="flex-1"></div>
                                <div
                                    className="h-full bg-slate-950/60 border-l-2 border-blue-400"
                                    style={{ width: `${currentRangeUpper}%` }}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-base text-slate-400 mb-2">
                                <span>Tight Range (High Risk/Reward)</span>
                                <span>Wide Range (Low Risk/Reward)</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="99"
                                value={rangeSpread}
                                onChange={(e) => setRangeSpread(Number(e.target.value))}
                                className="w-full h-3 bg-slate-800 rounded-lg appearance-none accent-blue-500 cursor-pointer"
                            />
                        </div>
                    </motion.div>
                );

            case UniswapVersion.V4:
                return (
                    <motion.div
                        key="v4"
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full flex flex-col relative p-6 overflow-y-auto"
                    >
                        {/* Trading Pair Selector */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400">Trading Pair:</span>
                                <div className="flex gap-2">
                                    {(['ETH/USDC', 'ETH/DAI', 'WBTC/ETH'] as const).map(pair => (
                                        <button
                                            key={pair}
                                            onClick={() => setTradingPair(pair)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${tradingPair === pair
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                        >
                                            {pair}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-2 gap-6 flex-1">
                            {/* Left Panel: Dynamic Fees */}
                            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="text-purple-400" size={20} />
                                    <h4 className="text-base font-bold text-white">Dynamic Fees (Hook)</h4>
                                </div>

                                {/* Volatility Slider */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                                        <span>Market Volatility</span>
                                        <span className={feeInfo.color}>{feeInfo.label}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={volatility}
                                        onChange={(e) => setVolatility(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        <span>Low</span>
                                        <span>Medium</span>
                                        <span>High</span>
                                    </div>
                                </div>

                                {/* Fee Display */}
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-slate-400">Current Fee Rate</span>
                                        <motion.span
                                            className={`text-2xl font-bold ${feeInfo.color}`}
                                            key={feeInfo.rate}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                        >
                                            {effectiveFee}%
                                        </motion.span>
                                    </div>

                                    {/* Fee Bar */}
                                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full ${feeInfo.bg} rounded-full`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(feeInfo.rate / 0.3) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>

                                    <div className="mt-3 text-xs text-slate-500">
                                        <div className="flex justify-between">
                                            <span>Base Fee: {pairConfig.baseFee}%</span>
                                            <span>Volatility Modifier: {pairConfig.volatilityMod}x</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Fee Presets */}
                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {[
                                        { label: '0.03%', vol: 15, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                                        { label: '0.1%', vol: 50, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                                        { label: '0.3%', vol: 85, color: 'bg-red-500/20 text-red-400 border-red-500/30' }
                                    ].map(preset => (
                                        <button
                                            key={preset.label}
                                            onClick={() => setVolatility(preset.vol)}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all hover:scale-105 ${preset.color}`}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Panel: Dynamic Liquidity */}
                            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Droplets className="text-emerald-400" size={20} />
                                    <h4 className="text-base font-bold text-white">Dynamic Liquidity (Hook)</h4>
                                </div>

                                {/* Strategy Selector */}
                                <div className="mb-4">
                                    <span className="text-sm text-slate-400 block mb-2">Liquidity Strategy</span>
                                    <div className="flex gap-2">
                                        {[
                                            { id: 'fixed', label: 'Fixed', icon: '=' },
                                            { id: 'volume', label: 'Volume', icon: <TrendingUp size={14} /> },
                                            { id: 'volatility', label: 'Volatility', icon: <Activity size={14} /> }
                                        ].map(strategy => (
                                            <button
                                                key={strategy.id}
                                                onClick={() => setLiquidityStrategy(strategy.id as typeof liquidityStrategy)}
                                                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${liquidityStrategy === strategy.id
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                {strategy.icon} {strategy.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Volume/Volatility Control */}
                                {liquidityStrategy !== 'fixed' && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-slate-400 mb-2">
                                            <span>{liquidityStrategy === 'volume' ? 'Trade Volume' : 'Price Volatility'}</span>
                                            <span>{liquidityStrategy === 'volume' ? tradeVolume : volatility}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={liquidityStrategy === 'volume' ? tradeVolume : volatility}
                                            onChange={(e) => liquidityStrategy === 'volume' ? setTradeVolume(Number(e.target.value)) : setVolatility(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                    </div>
                                )}

                                {/* Liquidity Pool Visualization */}
                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-slate-400">Pool Liquidity</span>
                                        <motion.span
                                            className="text-xl font-bold text-emerald-400"
                                            key={currentLiquidity}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                        >
                                            ${(currentLiquidity / 1000000).toFixed(2)}M
                                        </motion.span>
                                    </div>

                                    {/* Liquidity Pool Circle */}
                                    <div className="flex justify-center my-4">
                                        <motion.div
                                            className="rounded-full bg-gradient-to-br from-emerald-500/30 to-green-500/30 border-2 border-emerald-500/50 flex items-center justify-center"
                                            animate={{
                                                width: 80 + liquidityMultiplier * 40,
                                                height: 80 + liquidityMultiplier * 40
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Droplets className="text-emerald-400" size={32} />
                                        </motion.div>
                                    </div>

                                    {/* Multiplier Display */}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Liquidity Multiplier</span>
                                        <motion.span
                                            className={`font-bold ${liquidityMultiplier >= 1 ? 'text-green-400' : 'text-yellow-400'}`}
                                            key={liquidityMultiplier}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                        >
                                            {liquidityMultiplier.toFixed(2)}x
                                        </motion.span>
                                    </div>
                                </div>

                                {/* Strategy Info */}
                                <div className="mt-4 p-3 bg-slate-900/30 rounded-lg border border-slate-700/50">
                                    <p className="text-xs text-slate-400">
                                        {liquidityStrategy === 'fixed' && 'Liquidity remains constant regardless of market conditions.'}
                                        {liquidityStrategy === 'volume' && 'Liquidity increases with higher trade volume to capture more fees.'}
                                        {liquidityStrategy === 'volatility' && 'Liquidity increases during high volatility to provide stability.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Summary */}
                        <motion.div
                            className="mt-4 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between"
                            key={`${tradingPair}-${feeInfo.rate}-${liquidityMultiplier}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-4">
                                <Settings2 className="text-purple-400" size={24} />
                                <div>
                                    <div className="text-sm font-bold text-white">Hook Effects Summary</div>
                                    <div className="text-xs text-slate-400">Real-time adjustments based on market conditions</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className={`text-lg font-bold ${feeInfo.color}`}>{effectiveFee}%</div>
                                    <div className="text-xs text-slate-500">Fee</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-emerald-400">{liquidityMultiplier.toFixed(2)}x</div>
                                    <div className="text-xs text-slate-500">Liquidity</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                );
        }
    };

    const currentInfo = versionData[version];

    return (
        <div className="bg-slate-900 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">Uniswap Evolution</h3>
                <div className="flex gap-1 bg-slate-800 p-1 rounded-full">
                    {Object.values(UniswapVersion).map((v) => (
                        <button
                            key={v}
                            onClick={() => setVersion(v)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${version === v ? 'bg-slate-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-[1.5] min-h-[450px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative shadow-inner">
                    <AnimatePresence mode="wait">
                        {renderVisualization()}
                    </AnimatePresence>
                </div>
                <motion.div
                    className="flex-1 flex flex-col justify-center"
                    key={version}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold w-fit mb-4 ${currentInfo.bg} ${currentInfo.color} border ${currentInfo.border}`}>
                        {currentInfo.icon} {currentInfo.title}
                    </div>
                    <p className="text-lg text-slate-400 mb-6 leading-relaxed">{currentInfo.desc}</p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pros</div>
                            <ul className="space-y-3">
                                {currentInfo.pros.map((pro, i) => <li key={i} className="flex items-center gap-2 text-base text-slate-300"><Check size={16} className="text-emerald-500" /> {pro}</li>)}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Cons</div>
                            <ul className="space-y-3">
                                {currentInfo.cons.map((con, i) => <li key={i} className="flex items-center gap-2 text-base text-slate-500">x {con}</li>)}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UniswapEvolution;
