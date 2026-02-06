import React, { useState } from 'react';
import { BridgeAnimation } from './BridgeAnimation';
import { BridgeStep } from './types';
import { ArrowRightIcon } from './Icons';

export const AllbridgeModule: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<BridgeStep>(BridgeStep.IDLE);

    const handleStartDemo = () => {
        if (currentStep !== BridgeStep.IDLE && currentStep !== BridgeStep.COMPLETED) return;

        setCurrentStep(BridgeStep.SWAP_SEND);

        // Simulate the blockchain process timeline
        setTimeout(() => setCurrentStep(BridgeStep.MESSAGING), 2500);
        setTimeout(() => setCurrentStep(BridgeStep.SWAP_RECEIVE), 5000);
        setTimeout(() => setCurrentStep(BridgeStep.COMPLETED), 7500);
    };

    const resetDemo = () => {
        setCurrentStep(BridgeStep.IDLE);
    };

    return (
        <div className="w-full min-h-[720px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col">
            {/* Content Area */}
            <div className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            Mechanism: <strong>Native Liquidity Pools</strong>
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            Asset Type: <strong>No Wrapped Tokens</strong>
                        </span>
                    </div>

                    <BridgeAnimation step={currentStep} />

                    {/* Explainer Text based on Step */}
                    <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 min-h-[160px] transition-all">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 min-w-[28px]">
                                <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-sm font-bold border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                                    {currentStep === BridgeStep.IDLE ? '0' :
                                        currentStep === BridgeStep.SWAP_SEND ? '1' :
                                            currentStep === BridgeStep.MESSAGING ? '2' :
                                                currentStep === BridgeStep.SWAP_RECEIVE ? '3' : '4'}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-indigo-400 font-semibold mb-2 text-xl">
                                    {currentStep === BridgeStep.IDLE && "Ready to Swap"}
                                    {currentStep === BridgeStep.SWAP_SEND && "Swap to vUSD (Virtual Asset)"}
                                    {currentStep === BridgeStep.MESSAGING && "Messaging & Rebalancing"}
                                    {currentStep === BridgeStep.SWAP_RECEIVE && "Swap vUSD to Native Asset"}
                                    {currentStep === BridgeStep.COMPLETED && "Transfer Complete"}
                                </h3>
                                <div className="text-slate-300 text-base leading-relaxed space-y-2">
                                    {currentStep === BridgeStep.IDLE && (
                                        <p>
                                            Allbridge Core connects blockchains via <strong>Native Liquidity Pools</strong>.
                                            Unlike bridges that mint "wrapped" assets (IOUs), Core swaps stablecoins into an internal virtual asset called <strong>vUSD</strong>.
                                        </p>
                                    )}
                                    {currentStep === BridgeStep.SWAP_SEND && (
                                        <p>
                                            The user deposits native <strong>USDT</strong> into the Source Pool.
                                            The pool instantly swaps this for the internal <strong>vUSD</strong> accounting unit.
                                            Pricing follows a stable-swap curve to minimize slippage.
                                        </p>
                                    )}
                                    {currentStep === BridgeStep.MESSAGING && (
                                        <p>
                                            Guardians verify the transaction. <strong>No physical tokens move.</strong>
                                            The vUSD value is just data being relayed. If a pool is low on liquidity, fees adjust to incentivize arbitrageurs to refill it.
                                        </p>
                                    )}
                                    {currentStep === BridgeStep.SWAP_RECEIVE && (
                                        <p>
                                            The Destination Pool receives the message. It takes the virtual <strong>vUSD</strong> value and swaps it into native <strong>USDC</strong> from its local reserves.
                                        </p>
                                    )}
                                    {currentStep === BridgeStep.COMPLETED && (
                                        <p>
                                            The user receives native <strong>USDC</strong>.
                                            <br />
                                            <span className="text-teal-400 font-medium">✓ No wrapped assets created.</span>
                                            <br />
                                            <span className="text-teal-400 font-medium">✓ Pools remain balanced via flexible fees.</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-end pt-2">
                        {currentStep === BridgeStep.IDLE || currentStep === BridgeStep.COMPLETED ? (
                            <button
                                onClick={currentStep === BridgeStep.COMPLETED ? resetDemo : handleStartDemo}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-900/20"
                            >
                                {currentStep === BridgeStep.COMPLETED ? 'Reset Simulation' : 'Start Core Simulation'}
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        ) : (
                            <button disabled className="bg-slate-800 text-slate-500 px-8 py-3 rounded-xl font-bold cursor-not-allowed flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
                                Processing Swap...
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
