import React, { useEffect, useState } from 'react';
import { BridgeStep } from './types';
import { DatabaseIcon, ShieldIcon, CheckCircleIcon, ArrowRightIcon } from './Icons';

interface BridgeAnimationProps {
    step: BridgeStep;
}

export const BridgeAnimation: React.FC<BridgeAnimationProps> = ({ step }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let target = 0;
        switch (step) {
            case BridgeStep.IDLE: target = 0; break;
            case BridgeStep.SWAP_SEND: target = 25; break;
            case BridgeStep.MESSAGING: target = 50; break;
            case BridgeStep.SWAP_RECEIVE: target = 75; break;
            case BridgeStep.COMPLETED: target = 100; break;
        }
        setProgress(target);
    }, [step]);

    const isSwappingSend = step === BridgeStep.SWAP_SEND;
    const isMessaging = step === BridgeStep.MESSAGING;
    const isSwappingReceive = step === BridgeStep.SWAP_RECEIVE;
    const isCompleted = step === BridgeStep.COMPLETED;

    return (
        <div className="relative w-full h-72 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner p-4 flex flex-col justify-center select-none">

            {/* Background Tech Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* Main Container */}
            <div className="relative z-10 flex items-center justify-between px-4 md:px-12">

                {/* SOURCE CHAIN (Left) */}
                <div className="flex flex-col items-center gap-3 w-32">
                    <div className="relative">
                        <div className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center bg-slate-800 transition-all duration-500 ${isSwappingSend ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'border-slate-700'}`}>
                            <DatabaseIcon className="w-8 h-8 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Pool</span>
                            <span className="text-sm font-bold text-white">USDT</span>
                        </div>
                        {/* Incoming Token Animation */}
                        {isSwappingSend && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-green-400 font-bold text-base animate-bounce">
                                + Deposit
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-bold text-slate-300">Source Chain</div>
                        <div className="text-xs text-slate-500">Native Liquidity</div>
                    </div>
                </div>

                {/* MIDDLE (vUSD / Messaging) */}
                <div className="flex-1 relative flex flex-col items-center h-24 justify-center">

                    {/* Connection Lines */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 -translate-y-1/2"></div>

                    {/* The vUSD Virtual Asset Passing Through */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 transition-all duration-[2000ms] ease-linear z-20"
                        style={{
                            left: step === BridgeStep.IDLE ? '10%' :
                                step === BridgeStep.SWAP_SEND ? '25%' :
                                    step === BridgeStep.MESSAGING ? '50%' :
                                        step === BridgeStep.SWAP_RECEIVE ? '75%' : '90%',
                            opacity: step === BridgeStep.IDLE ? 0 : 1
                        }}
                    >
                        <div className="relative">
                            <div className="w-16 h-16 bg-slate-950 border-2 border-dashed border-indigo-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                <span className="text-sm font-bold text-indigo-300">vUSD</span>
                            </div>
                            {/* Label below moving token */}
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-slate-900 border border-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full mt-2">
                                Virtual Asset
                            </div>
                        </div>
                    </div>

                    {/* Guardians Icon in Middle */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isMessaging ? 'opacity-100' : 'opacity-20'}`}>
                        <ShieldIcon className="w-24 h-24 text-slate-700/50" />
                    </div>

                    {/* Messaging Text */}
                    <div className={`absolute -top-6 w-full text-center transition-all duration-300 ${isMessaging ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        <span className="text-sm font-bold text-indigo-400 bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/30">
                            Guardians Verifying Message
                        </span>
                    </div>

                </div>

                {/* DESTINATION CHAIN (Right) */}
                <div className="flex flex-col items-center gap-3 w-32">
                    <div className="relative">
                        <div className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center bg-slate-800 transition-all duration-500 ${isSwappingReceive || isCompleted ? 'border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.3)]' : 'border-slate-700'}`}>
                            {isCompleted ? <CheckCircleIcon className="w-8 h-8 text-teal-400 mb-1" /> : <DatabaseIcon className="w-8 h-8 text-slate-400 mb-1" />}
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Pool</span>
                            <span className="text-sm font-bold text-white">USDC</span>
                        </div>
                        {isCompleted && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-teal-400 font-bold text-base animate-bounce">
                                + Received
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-bold text-slate-300">Destination Chain</div>
                        <div className="text-xs text-slate-500">Native Liquidity</div>
                    </div>
                </div>

            </div>

            {/* Mechanism Labels */}
            <div className="flex justify-between px-4 md:px-12 mt-8 border-t border-slate-800 pt-4">
                <div className="text-center w-32 opacity-70">
                    <div className="text-xs text-slate-500 uppercase">Input</div>
                    <div className="text-sm text-indigo-400 font-mono">USDT (Native)</div>
                </div>
                <div className="text-center opacity-70">
                    <div className="text-xs text-slate-500 uppercase">Internal Accounting</div>
                    <div className="text-sm text-indigo-400 font-mono">1 USDT = 1 vUSD</div>
                </div>
                <div className="text-center w-32 opacity-70">
                    <div className="text-xs text-slate-500 uppercase">Output</div>
                    <div className="text-sm text-teal-400 font-mono">USDC (Native)</div>
                </div>
            </div>

        </div>
    );
};
