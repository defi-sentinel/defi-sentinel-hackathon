import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Coins, ShieldCheck, RefreshCw, PiggyBank, CreditCard, Vote, TrendingUp } from 'lucide-react';
import { FlowStep } from './types';

interface SkyAnimationProps {
    currentStep: FlowStep;
    setStep: (step: FlowStep) => void;
}

export const SkyAnimation: React.FC<SkyAnimationProps> = ({ currentStep, setStep }) => {
    const [ethPosition, setEthPosition] = useState({ x: 10, y: 80, opacity: 1, scale: 1 });
    const [usdsPosition, setUsdsPosition] = useState({ x: 50, y: 50, opacity: 0, scale: 0.5 });
    const [skyPosition, setSkyPosition] = useState({ x: 50, y: 50, opacity: 0, scale: 0.5 });

    // Reset animation state when step changes
    useEffect(() => {
        switch (currentStep) {
            case FlowStep.INTRO:
                setEthPosition({ x: 10, y: 80, opacity: 1, scale: 1 });
                setUsdsPosition({ x: 50, y: 50, opacity: 0, scale: 0.5 });
                setSkyPosition({ x: 50, y: 50, opacity: 0, scale: 0.5 });
                break;
            case FlowStep.DEPOSIT:
                setEthPosition({ x: 50, y: 50, opacity: 0, scale: 0.5 }); // ETH goes into the core
                setUsdsPosition({ x: 50, y: 50, opacity: 0, scale: 0.5 });
                setSkyPosition({ x: 50, y: 50, opacity: 0, scale: 0.5 });
                break;
            case FlowStep.MINT:
                setEthPosition({ x: 50, y: 50, opacity: 0, scale: 0.5 });
                setUsdsPosition({ x: 80, y: 80, opacity: 1, scale: 1.2 }); // USDS comes out
                setSkyPosition({ x: 50, y: 50, opacity: 0, scale: 0.5 });
                break;
            case FlowStep.REWARDS:
                setEthPosition({ x: 50, y: 50, opacity: 0, scale: 0.5 });
                setUsdsPosition({ x: 80, y: 80, opacity: 1, scale: 1 });
                setSkyPosition({ x: 80, y: 20, opacity: 1, scale: 1 }); // SKY tokens generated
                break;
            case FlowStep.COMPLETE:
                // Everything visible
                setEthPosition({ x: 50, y: 50, opacity: 0, scale: 0 });
                setUsdsPosition({ x: 80, y: 80, opacity: 1, scale: 1 });
                setSkyPosition({ x: 80, y: 20, opacity: 1, scale: 1 });
                break;
        }
    }, [currentStep]);

    const handleNext = () => {
        if (currentStep === FlowStep.INTRO) setStep(FlowStep.DEPOSIT);
        else if (currentStep === FlowStep.DEPOSIT) setStep(FlowStep.MINT);
        else if (currentStep === FlowStep.MINT) setStep(FlowStep.REWARDS);
        else if (currentStep === FlowStep.REWARDS) setStep(FlowStep.COMPLETE);
        else if (currentStep === FlowStep.COMPLETE) setStep(FlowStep.INTRO);
    };

    return (
        <div className="w-full bg-slate-900 rounded-2xl border border-indigo-500/30 overflow-hidden shadow-2xl flex flex-col">

            {/* Animation Stage */}
            <div className="relative w-full h-[400px] bg-gradient-to-br from-slate-900 to-indigo-950 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                </div>

                {/* Central Hub (Sky Protocol Core) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center z-10">
                    <div className={`relative w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all duration-700 ${currentStep !== FlowStep.INTRO ? 'scale-110' : 'scale-100'}`}>
                        <ShieldCheck size={48} className="text-white animate-pulse-slow" />
                        <div className="absolute -bottom-8 text-indigo-200 text-sm font-semibold tracking-widest">SKY PROTOCOL</div>

                        {/* Orbital Rings */}
                        <div className="absolute inset-0 border-2 border-dashed border-indigo-400/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute -inset-4 border border-indigo-300/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    </div>
                </div>

                {/* Animated Elements - Main Icons (Higher Z-Index) */}

                {/* 1. User Collateral (ETH) */}
                <div
                    className="absolute z-20 transition-all duration-1000 ease-in-out flex flex-col items-center gap-2"
                    style={{
                        left: `${ethPosition.x}%`,
                        top: `${ethPosition.y}%`,
                        transform: `translate(-50%, -50%) scale(${ethPosition.scale})`,
                        opacity: ethPosition.opacity
                    }}
                >
                    <div className="w-16 h-16 bg-slate-800 border-2 border-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Lock size={24} className="text-slate-300" />
                    </div>
                    <span className="text-slate-300 font-mono text-xs bg-slate-900/80 px-2 py-1 rounded whitespace-nowrap">Collateral (ETH)</span>
                </div>

                {/* 2. USDS (Stablecoin) */}
                <div
                    className="absolute z-20 transition-all duration-1000 ease-in-out flex flex-col items-center gap-2"
                    style={{
                        left: `${usdsPosition.x}%`,
                        top: `${usdsPosition.y}%`,
                        transform: `translate(-50%, -50%) scale(${usdsPosition.scale})`,
                        opacity: usdsPosition.opacity
                    }}
                >
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <span className="text-white font-bold text-xl">$</span>
                    </div>
                    <span className="text-emerald-300 font-mono text-xs bg-slate-900/80 px-2 py-1 rounded whitespace-nowrap">USDS MINTED</span>
                </div>

                {/* 2b. USDS Utility Popups (Lower Z-Index, positioned away from icon) */}
                {(currentStep === FlowStep.MINT || currentStep === FlowStep.REWARDS || currentStep === FlowStep.COMPLETE) && (
                    <>
                        <div className="absolute z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-emerald-500/30 px-3 py-2 rounded-full shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300"
                            style={{ left: '48%', top: '72%' }}>
                            <PiggyBank size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-semibold text-emerald-100 whitespace-nowrap">Earn Savings (SSR)</span>
                        </div>
                        <div className="absolute z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-emerald-500/30 px-3 py-2 rounded-full shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-700 delay-500"
                            style={{ left: '62%', top: '60%' }}>
                            <CreditCard size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-semibold text-emerald-100 whitespace-nowrap">Spend & Trade</span>
                        </div>
                    </>
                )}

                {/* 3. SKY (Governance/Rewards) */}
                <div
                    className="absolute z-20 transition-all duration-1000 ease-in-out flex flex-col items-center gap-2"
                    style={{
                        left: `${skyPosition.x}%`,
                        top: `${skyPosition.y}%`,
                        transform: `translate(-50%, -50%) scale(${skyPosition.scale})`,
                        opacity: skyPosition.opacity
                    }}
                >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-float">
                        <Coins size={24} className="text-white" />
                    </div>
                    <span className="text-purple-300 font-mono text-xs bg-slate-900/80 px-2 py-1 rounded whitespace-nowrap">SKY Rewards</span>
                </div>

                {/* 3b. SKY Utility Popups (Lower Z-Index, positioned away from icon) */}
                {(currentStep === FlowStep.REWARDS || currentStep === FlowStep.COMPLETE) && (
                    <>
                        <div className="absolute z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-purple-500/30 px-3 py-2 rounded-full shadow-xl animate-in fade-in slide-in-from-top-2 duration-700 delay-300"
                            style={{ left: '50%', top: '15%' }}>
                            <Vote size={14} className="text-purple-400" />
                            <span className="text-[10px] font-semibold text-purple-100 whitespace-nowrap">Governance Rights</span>
                        </div>
                        <div className="absolute z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-purple-500/30 px-3 py-2 rounded-full shadow-xl animate-in fade-in slide-in-from-top-2 duration-700 delay-500"
                            style={{ left: '62%', top: '35%' }}>
                            <TrendingUp size={14} className="text-purple-400" />
                            <span className="text-[10px] font-semibold text-purple-100 whitespace-nowrap">Protocol Growth</span>
                        </div>
                    </>
                )}
            </div>

            {/* Controls / Info Panel (Separated Layout) */}
            <div className="bg-slate-950 border-t border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 z-20">
                <div className="flex-1">
                    <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2">
                        {currentStep === FlowStep.INTRO && "Step 0: The Ecosystem"}
                        {currentStep === FlowStep.DEPOSIT && "Step 1: Deposit Collateral"}
                        {currentStep === FlowStep.MINT && "Step 2: Mint USDS"}
                        {currentStep === FlowStep.REWARDS && "Step 3: Earn & Govern"}
                        {currentStep === FlowStep.COMPLETE && "Cycle Complete"}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed min-h-[40px]">
                        {currentStep === FlowStep.INTRO && "Sky is a decentralized protocol. Click 'Start' to see how value flows through the system."}
                        {currentStep === FlowStep.DEPOSIT && "Users deposit crypto assets (like ETH or WBTC) into the Sky Protocol smart contracts to secure their position."}
                        {currentStep === FlowStep.MINT && "Success! You've minted USDS. This stablecoin can be used for everyday payments, trading, or locked to earn the Sky Savings Rate (SSR)."}
                        {currentStep === FlowStep.REWARDS && "Active participants earn SKY tokens. Holding SKY gives you governance power to vote on protocol upgrades and risk parameters."}
                        {currentStep === FlowStep.COMPLETE && "Cycle Complete: You've provided collateral, minted stablecoins for utility, and earned governance rights."}
                    </p>
                </div>
                <button
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full transition-colors flex-shrink-0 flex items-center justify-center shadow-lg group"
                >
                    {currentStep === FlowStep.COMPLETE ? (
                        <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
                    ) : (
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    )}
                </button>
            </div>
        </div>
    );
};
