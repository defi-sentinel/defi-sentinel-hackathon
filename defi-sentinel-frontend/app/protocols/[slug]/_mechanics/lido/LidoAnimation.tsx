'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Coins, TrendingUp, Wallet, ShieldCheck, RefreshCw, PlayCircle, ArrowLeftRight, ArrowUpRight, Server, Cpu } from 'lucide-react';

enum Step {
    IDLE = 'IDLE',
    DEPOSIT = 'DEPOSIT',       // 1. ETH moves User -> Protocol
    STAKING = 'STAKING',       // 1b. stETH moves Protocol -> User (Wait here)
    REWARDS = 'REWARDS',       // 2. Slow growth (Rate increases) (Wait here)
    DEFI = 'DEFI',             // 3. Fast growth (Balance increases) (Wait here)
    REDEEM = 'REDEEM',         // 4. stETH moves User -> Protocol
    CLAIM = 'CLAIM',           // 4b. ETH moves Protocol -> User
    COMPLETE = 'COMPLETE'      // Final state
}

interface BoostEffect {
    id: number;
    value: string;
}

export const LidoAnimation: React.FC = () => {
    const [step, setStep] = useState<Step>(Step.IDLE);
    const [ethBalance, setEthBalance] = useState(10);
    const [stEthBalance, setStEthBalance] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(1.0);
    const [redeemAmount, setRedeemAmount] = useState(0);
    const [boostEffects, setBoostEffects] = useState<BoostEffect[]>([]);

    // 1. Deposit Sequence -> Auto to Staking
    useEffect(() => {
        if (step === Step.DEPOSIT) {
            const t = setTimeout(() => {
                setEthBalance(0);
                setStEthBalance(10);
                setStep(Step.STAKING);
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [step]);

    // 3. Rewards & DeFi -> Keep Increasing Rate
    useEffect(() => {
        if (step === Step.REWARDS || step === Step.DEFI) {
            const interval = setInterval(() => {
                setExchangeRate(prev => prev + 0.0005);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [step]);

    // 4. DeFi Balance Boost -> Run loop
    useEffect(() => {
        if (step === Step.DEFI) {
            const interval = setInterval(() => {
                setStEthBalance(prev => prev + 0.01);
                const id = Date.now() + Math.random();
                setBoostEffects(prev => [...prev, { id, value: '+0.01 stETH' }]);
                setTimeout(() => {
                    setBoostEffects(prev => prev.filter(e => e.id !== id));
                }, 800);
            }, 400); // More frequent 0.01 increments
            return () => clearInterval(interval);
        }
    }, [step]);

    // 5. Redeem -> Auto to Claim
    useEffect(() => {
        if (step === Step.REDEEM) {
            const finalValue = stEthBalance * exchangeRate;
            setRedeemAmount(finalValue);
            const t = setTimeout(() => {
                setStEthBalance(0);
                setStep(Step.CLAIM);
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [step, stEthBalance, exchangeRate]);

    // 6. Claim -> Auto to Complete
    useEffect(() => {
        if (step === Step.CLAIM) {
            const t = setTimeout(() => {
                setEthBalance(redeemAmount);
                setStep(Step.COMPLETE);
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [step, redeemAmount]);


    const startAnimation = () => {
        setEthBalance(10);
        setStEthBalance(0);
        setExchangeRate(1.0);
        setRedeemAmount(0);
        setStep(Step.DEPOSIT);
    };

    const handleNextStep = () => {
        switch (step) {
            case Step.IDLE:
            case Step.COMPLETE:
                startAnimation();
                break;
            case Step.STAKING:
                setStep(Step.REWARDS);
                break;
            case Step.REWARDS:
                setStep(Step.DEFI);
                break;
            case Step.DEFI:
                setStep(Step.REDEEM);
                break;
            default:
                break;
        }
    };

    const getButtonConfig = () => {
        switch (step) {
            case Step.IDLE:
                return { text: "Start Simulation", icon: PlayCircle, disabled: false, action: startAnimation };
            case Step.DEPOSIT:
                return { text: "Staking ETH...", icon: RefreshCw, disabled: true, action: () => { } };
            case Step.STAKING:
                return { text: "Next: Start Holding", icon: ArrowRight, disabled: false, action: handleNextStep };
            case Step.REWARDS:
                return { text: "Next: Apply DeFi Boost", icon: ArrowRight, disabled: false, action: handleNextStep };
            case Step.DEFI:
                return { text: "Next: Redeem & Unstake", icon: ArrowRight, disabled: false, action: handleNextStep };
            case Step.REDEEM:
                return { text: "Redeeming...", icon: RefreshCw, disabled: true, action: () => { } };
            case Step.CLAIM:
                return { text: "Claiming...", icon: RefreshCw, disabled: true, action: () => { } };
            case Step.COMPLETE:
                return { text: "Replay Simulation", icon: RefreshCw, disabled: false, action: startAnimation };
            default:
                return { text: "Loading...", icon: RefreshCw, disabled: true, action: () => { } };
        }
    };

    const btnConfig = getButtonConfig();
    const Icon = btnConfig.icon;

    return (
        <div className="w-full bg-slate-900 flex flex-col md:flex-row h-[620px] rounded-2xl overflow-hidden shadow-2xl">

            {/* Visual Stage */}
            <div className="flex-[2] bg-slate-950 p-8 relative flex flex-col items-center justify-center overflow-hidden">

                {/* Enhanced Background Grid */}
                <div className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(16, 185, 129, 0.2) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(16, 185, 129, 0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: '24px 24px'
                    }}>
                </div>

                {/* User Wallet Zone */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-800 flex flex-col gap-4 w-80 transition-all duration-300">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <Wallet className="w-4 h-4" /> Portfolio
                        </div>
                        {(step !== Step.IDLE && step !== Step.DEPOSIT && step !== Step.COMPLETE) && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-1.5 bg-sky-500/10 px-2 py-1 rounded-md border border-sky-500/20"
                            >
                                <ArrowUpRight className="w-3 h-3 text-sky-400" />
                                <span className="text-[10px] font-mono font-bold text-sky-400">
                                    1 stETH = {exchangeRate.toFixed(4)} ETH
                                </span>
                            </motion.div>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-400">ETH Balance</span>
                        <span className={`text-2xl font-bold text-white ${step === Step.COMPLETE ? "text-emerald-500 scale-110" : ""} transition-all duration-500`}>
                            {ethBalance.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-sky-400">stETH Balance</span>
                        <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold text-sky-500 transition-colors duration-300`}>
                                {stEthBalance.toFixed(2)}
                            </span>

                            <div className="relative w-12 h-6">
                                <AnimatePresence>
                                    {boostEffects.map(effect => (
                                        <motion.div
                                            key={effect.id}
                                            initial={{ opacity: 0, y: 10, x: 0 }}
                                            animate={{ opacity: 1, y: -20, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6 }}
                                            className="absolute inset-0 text-emerald-400 font-bold text-sm whitespace-nowrap pointer-events-none"
                                        >
                                            {effect.value}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {(step === Step.REWARDS || step === Step.DEFI) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-1 pt-3 border-t border-dashed border-slate-800 flex justify-between items-center"
                        >
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Est. Value (ETH)</span>
                            <span className="text-sm font-bold text-emerald-400">
                                ≈ {(stEthBalance * exchangeRate).toFixed(3)}
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Nodes & Architecture */}
                <div className="relative w-full max-w-5xl h-80 flex items-center justify-between px-16 mt-40">

                    {/* User Node */}
                    <div className="relative flex flex-col items-center justify-center z-20">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-700 shadow-xl relative group transition-all hover:border-emerald-500/50">
                            <div className="text-3xl">👤</div>
                            {step === Step.DEFI && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute -right-2 -bottom-2 bg-emerald-500 p-1.5 rounded-full border-2 border-slate-900 shadow-lg"><Cpu className="w-4 h-4 text-white" /></motion.div>}
                        </div>
                        <div className="absolute top-full mt-4 text-center w-32">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">User</div>
                            <div className="text-[9px] text-slate-600 font-bold bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/30 mt-1 inline-block">WALLET</div>
                        </div>
                    </div>

                    {/* Path 1 (User -> Protocol) */}
                    <div className="flex-1 h-px bg-slate-800 relative mx-4">
                        <AnimatePresence>
                            {step === Step.DEPOSIT && <motion.div initial={{ left: 0 }} animate={{ left: "100%" }} transition={{ duration: 1 }} className="absolute -top-1 h-2 w-8 bg-white rounded-full shadow-[0_0_15px_white]" />}
                            {step === Step.STAKING && <motion.div initial={{ right: 0 }} animate={{ right: "100%" }} transition={{ duration: 1 }} className="absolute -top-1 h-2 w-8 bg-sky-400 rounded-full shadow-[0_0_15px_#38bdf8]" />}
                        </AnimatePresence>
                    </div>

                    {/* Protocol Node */}
                    <div className="relative flex flex-col items-center justify-center z-20">
                        <motion.div
                            animate={{
                                scale: (step === Step.DEPOSIT || step === Step.REDEEM) ? [1, 1.05, 1] : 1,
                                borderColor: (step !== Step.IDLE && step !== Step.COMPLETE) ? '#10b981' : '#334155'
                            }}
                            className="w-28 h-28 bg-slate-900 rounded-[2rem] flex items-center justify-center border-2 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative"
                        >
                            <ShieldCheck className={`w-12 h-12 ${step === Step.IDLE ? 'text-slate-700' : 'text-emerald-400'}`} />
                            {step !== Step.IDLE && step !== Step.COMPLETE && <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-[2rem] border border-emerald-500/30" />}
                        </motion.div>
                        <div className="absolute top-full mt-4 text-center w-40">
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-tight">LIDO CORE</div>
                            <div className="text-[9px] text-emerald-500/70 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 mt-1 inline-block">SMART CONTRACT</div>
                        </div>
                    </div>

                    {/* Path 2 (Protocol -> Validators) */}
                    <div className="flex-1 h-32 relative mx-4 flex items-center justify-center">
                        <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <motion.path
                                d="M 0,55 Q 50,-10 100,55"
                                fill="none"
                                stroke="#10b98130"
                                strokeWidth="3"
                                strokeDasharray="4 4"
                                vectorEffect="non-scaling-stroke"
                            />
                            {(step === Step.REWARDS || step === Step.DEFI) && (
                                <motion.circle r="3" fill="#10b981">
                                    <animateMotion path="M 100,55 Q 50,-10 0,55" dur="1.5s" repeatCount="indefinite" />
                                </motion.circle>
                            )}
                        </svg>
                    </div>

                    {/* Validators Node */}
                    <div className="relative flex flex-col items-center justify-center z-20">
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(id => (
                                <div key={id} className={`w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-lg ${step !== Step.IDLE ? 'border-emerald-500/30' : ''}`}>
                                    <Server className={`w-6 h-6 ${step !== Step.IDLE ? 'text-emerald-500/40' : 'text-slate-700'}`} />
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-full mt-4 text-center w-32">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Validators</div>
                            <div className="text-[9px] text-slate-600 font-bold mt-1">DECENTRALIZED SET</div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Badges */}
                <div className="h-16 flex items-center justify-center mt-8">
                    <AnimatePresence mode="wait">
                        {step === Step.REWARDS && (
                            <motion.div
                                key="rewards"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full flex items-center gap-3"
                            >
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-400">Exchange Rate Increasing vs ETH...</span>
                            </motion.div>
                        )}

                        {step === Step.DEFI && (
                            <motion.div
                                key="defi"
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                className="bg-sky-500/10 border border-sky-500/20 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(14,165,233,0.1)]"
                            >
                                <Coins className="w-5 h-5 text-sky-400 animate-bounce" />
                                <span className="text-sm font-bold text-sky-400 uppercase tracking-tight">DeFi Yield Boosting Balance!</span>
                            </motion.div>
                        )}

                        {step === Step.COMPLETE && (
                            <motion.div
                                key="complete"
                                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full flex items-center gap-3 shadow-md"
                            >
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-400">Strategy Success: +{(ethBalance - 10).toFixed(2)} ETH Profit</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Control Panel */}
            <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 p-8 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Strategy Lifecycle</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">Step through the liquid staking lifecycle to see how rewards accrue.</p>

                <div className="flex-1 space-y-6 relative">
                    {/* Adjusted line position to 28px (left-7) to match circle centers (p-3 = 12px + w-8/2 = 16px => 28px) */}
                    <div className="absolute left-7 top-8 bottom-8 w-px bg-slate-800 z-0"></div>

                    {/* Steps */}
                    {[
                        { id: 1, title: "Stake", desc: "Deposit ETH, receive stETH 1:1", active: step === Step.DEPOSIT || step === Step.STAKING, color: "sky" },
                        { id: 2, title: "Accumulate", desc: "Auto-compounding rewards grow value", active: step === Step.REWARDS, color: "emerald" },
                        { id: 3, title: "DeFi Boost", desc: "Balance increases via external yield", active: step === Step.DEFI, color: "emerald" },
                        { id: 4, title: "Redeem", desc: "Convert back to ETH with profits", active: step === Step.REDEEM || step === Step.CLAIM || step === Step.COMPLETE, color: "sky" }
                    ].map((item) => (
                        <div key={item.id} className={`relative z-10 flex gap-4 p-3 rounded-xl transition-all duration-500 ${item.active ? 'bg-slate-800/80 shadow-lg border border-slate-700' : 'opacity-40 grayscale'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${item.active ? (item.color === 'sky' ? 'bg-sky-500 text-white' : 'bg-emerald-500 text-white') : 'bg-slate-800 text-slate-600'}`}>
                                {item.id}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white tracking-tight">{item.title}</div>
                                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-1">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <button
                        onClick={btnConfig.action}
                        disabled={btnConfig.disabled}
                        className={`w-full flex items-center justify-center gap-3 text-sm font-bold py-4 px-6 rounded-xl shadow-xl transition-all duration-300 ${btnConfig.disabled ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-white hover:bg-slate-100 text-slate-900 hover:scale-[1.02] active:scale-[0.98]'}`}
                    >
                        <Icon className={`w-5 h-5 ${btnConfig.disabled ? 'animate-spin' : ''}`} />
                        {btnConfig.text}
                    </button>
                </div>
            </div>
        </div>
    );
};
