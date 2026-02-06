import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowStep } from './types';
import { Coins, Server, Building2, Wallet, RefreshCw, BadgeDollarSign, TrendingUp, ShieldCheck } from 'lucide-react';

const ActivityIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

export const ProtocolFlow: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<FlowStep>(FlowStep.Idle);
    const [isPlaying, setIsPlaying] = useState(false);

    // Animation Loop Logic
    useEffect(() => {
        if (!isPlaying) return;

        let timeout: any;

        const sequence = async () => {
            // Step 1: User sends USDC
            setCurrentStep(FlowStep.Deposit);
            await new Promise(r => setTimeout(r, 1500));

            // Step 2: Protocol sends sUSDAI back
            setCurrentStep(FlowStep.Mint);
            await new Promise(r => setTimeout(r, 1500));

            // Step 3: Protocol invests funds
            setCurrentStep(FlowStep.Allocation);
            await new Promise(r => setTimeout(r, 2000));

            // Step 4: Yield generated
            setCurrentStep(FlowStep.Yield);
            await new Promise(r => setTimeout(r, 2000));

            // Step 5: Yield distributed to sUSDAI
            setCurrentStep(FlowStep.Distribute);
            await new Promise(r => setTimeout(r, 2500));

            setCurrentStep(FlowStep.Idle);
            setIsPlaying(false);
        };

        sequence();

        return () => clearTimeout(timeout);
    }, [isPlaying]);

    return (
        <div className="w-full bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 md:p-12 shadow-xl relative overflow-hidden min-h-[720px]">

            {/* Controls */}
            <div className="absolute top-6 right-6 z-10">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={isPlaying}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isPlaying
                        ? 'bg-slate-700 text-slate-400 cursor-default opacity-50'
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:scale-105'
                        }`}
                >
                    {isPlaying ? (
                        <>
                            <ActivityIcon className="animate-pulse" /> Simulating...
                        </>
                    ) : (
                        <>
                            <RefreshCw size={16} /> Start Animation
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative min-h-[450px]">

                {/* Connecting Lines (Background) */}
                <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
                    <svg className="w-full h-full opacity-20">
                        {/* Path from User to Protocol */}
                        <path d="M 150 250 C 250 250, 300 250, 400 250" stroke="#94A3B8" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                        {/* Fork paths */}
                        <path d="M 600 250 C 650 250, 700 150, 800 150" stroke="#94A3B8" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                        <path d="M 600 250 C 650 250, 700 350, 800 350" stroke="#94A3B8" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                    </svg>
                </div>

                {/* --- NODE 1: USER --- */}
                <div className="flex flex-col items-center justify-center relative z-10">
                    <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-700 w-64 text-center transition-all duration-500">
                        <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Wallet size={32} />
                        </div>
                        <h3 className="text-xl font-serif font-semibold text-slate-200 mb-2">Depositor</h3>

                        <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700 min-h-[80px] flex flex-col justify-center items-center">
                            <span className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Current Holding</span>

                            <AnimatePresence mode="wait">
                                {currentStep === FlowStep.Idle || currentStep === FlowStep.Deposit ? (
                                    <motion.div
                                        key="usdc-hold"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-2 text-blue-400 font-bold"
                                    >
                                        <Coins size={18} /> USDC
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="susdai-hold"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="flex items-center gap-2 text-indigo-400 font-bold">
                                            <TrendingUp size={18} /> sUSDAI
                                        </div>
                                        {currentStep === FlowStep.Distribute && (
                                            <motion.span
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-xs text-green-400 font-bold mt-1"
                                            >
                                                + Yield Received
                                            </motion.span>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* --- NODE 2: PROTOCOL CORE --- */}
                <div className="flex flex-col items-center justify-center relative z-10">
                    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-2xl border-2 border-slate-600 w-80 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                        <h3 className="text-2xl font-serif font-semibold mb-6 mt-2">USD.AI Protocol</h3>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {/* Internal Bucket: USDAI */}
                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                                <div className="flex items-center justify-center text-slate-400 mb-1">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="text-xs font-bold text-slate-300">USDAI</div>
                                <div className="text-[10px] text-slate-500">Stable Coin</div>
                            </div>

                            {/* Internal Bucket: sUSDAI */}
                            <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 relative">
                                <div className="flex items-center justify-center text-indigo-400 mb-1">
                                    <TrendingUp size={20} />
                                </div>
                                <div className="text-xs font-bold text-indigo-400">sUSDAI</div>
                                <div className="text-[10px] text-slate-500">Yield Token</div>

                                {currentStep === FlowStep.Yield && (
                                    <motion.div
                                        layoutId="yield-sparkle"
                                        className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-50"
                                        animate={{ scale: [1, 1.1, 1], opacity: [0, 0.5, 0] }}
                                        transition={{ repeat: 2, duration: 1 }}
                                    />
                                )}
                            </div>
                        </div>

                        <p className="text-slate-400 text-xs px-2">
                            Collateral is managed here. sUSDAI rebases to reflect yield.
                        </p>
                    </div>

                    {/* Particle: USDC Deposit */}
                    {currentStep === FlowStep.Deposit && (
                        <motion.div
                            layoutId="deposit-particle"
                            className="absolute left-[-160px] top-1/2 transform -translate-y-1/2 z-20"
                            initial={{ x: 0, opacity: 0 }}
                            animate={{ x: 160, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        >
                            <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg text-sm border border-blue-400">
                                <Coins size={14} /> USDC
                            </div>
                        </motion.div>
                    )}

                    {/* Particle: sUSDAI Minting (Returning to User) */}
                    {currentStep === FlowStep.Mint && (
                        <motion.div
                            layoutId="mint-particle"
                            className="absolute left-[0px] top-1/2 transform -translate-y-1/2 z-20"
                            initial={{ x: 0, opacity: 1 }}
                            animate={{ x: -160, opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        >
                            <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-full shadow-lg text-sm border border-indigo-400">
                                <TrendingUp size={14} /> sUSDAI
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* --- NODE 3: YIELD SOURCES --- */}
                <div className="flex flex-col justify-center gap-10 relative z-10">

                    {/* Source A: GPU Lending */}
                    <motion.div
                        animate={{
                            scale: currentStep === FlowStep.Allocation ? 1.05 : 1,
                            borderColor: currentStep === FlowStep.Allocation ? '#EAB308' : '#334155', // Yellow-500 : Slate-700
                            boxShadow: currentStep === FlowStep.Allocation ? '0 10px 30px -5px rgba(234, 179, 8, 0.3)' : 'none'
                        }}
                        className="bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-700 transition-all duration-500 relative"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-yellow-900/20 p-3 rounded-lg text-yellow-400">
                                <Server size={24} />
                            </div>
                            <div>
                                <h4 className="font-serif font-semibold text-lg text-slate-200">GPU Cluster</h4>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="bg-yellow-900/30 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full">High Yield</span>
                                    <span className="text-xs text-slate-500">Real World Asset</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Source B: T-Bills */}
                    <motion.div
                        animate={{
                            scale: currentStep === FlowStep.Allocation ? 1.05 : 1,
                            borderColor: currentStep === FlowStep.Allocation ? '#10B981' : '#334155' // Emerald-500 : Slate-700
                        }}
                        className="bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-700 transition-all duration-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-900/20 p-3 rounded-lg text-emerald-400">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h4 className="font-serif font-semibold text-lg text-slate-200">US Treasury</h4>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="bg-emerald-900/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Stable</span>
                                    <span className="text-xs text-slate-500">Gov Backed</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Particles: Allocation (Money going out) */}
                    {currentStep === FlowStep.Allocation && (
                        <>
                            <motion.div
                                className="absolute left-[-100px] top-1/3 z-20"
                                initial={{ x: 0, y: 40, opacity: 0 }}
                                animate={{ x: 100, y: -40, opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                <div className="bg-slate-700 text-white p-1.5 rounded-full shadow-md border border-slate-500">
                                    <BadgeDollarSign size={16} />
                                </div>
                            </motion.div>
                            <motion.div
                                className="absolute left-[-100px] top-1/2 z-20"
                                initial={{ x: 0, y: 0, opacity: 0 }}
                                animate={{ x: 100, y: 60, opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                <div className="bg-slate-700 text-white p-1.5 rounded-full shadow-md border border-slate-500">
                                    <BadgeDollarSign size={16} />
                                </div>
                            </motion.div>
                        </>
                    )}

                    {/* Particles: Yield Return (Money coming back) */}
                    {currentStep === FlowStep.Yield && (
                        <>
                            <motion.div
                                className="absolute right-[100%] top-[15%] z-20 flex items-center gap-1"
                                initial={{ x: 0, opacity: 0 }}
                                animate={{ x: -220, y: 100, opacity: 1 }}
                                transition={{ duration: 1.5 }}
                            >
                                <span className="text-emerald-400 font-bold text-xl drop-shadow-sm">+$</span>
                            </motion.div>
                            <motion.div
                                className="absolute right-[100%] bottom-[15%] z-20 flex items-center gap-1"
                                initial={{ x: 0, opacity: 0 }}
                                animate={{ x: -220, y: -100, opacity: 1 }}
                                transition={{ duration: 1.5 }}
                            >
                                <span className="text-emerald-400 font-bold text-xl drop-shadow-sm">+$</span>
                            </motion.div>
                        </>
                    )}

                </div>

            </div>

            {/* Narrative Text Bar */}
            <div className="mt-12 bg-slate-900 rounded-xl p-6 border border-slate-700 min-h-[120px] flex items-center justify-center transition-all duration-500">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center max-w-3xl"
                    >
                        {currentStep === FlowStep.Idle && (
                            <p className="text-lg text-slate-400">Click <span className="font-bold text-white">"Start Animation"</span> to see the full lifecycle of USDAI.</p>
                        )}
                        {currentStep === FlowStep.Deposit && (
                            <p className="text-lg text-slate-400">User deposits <span className="font-bold text-blue-400">USDC</span> into the Protocol smart contract.</p>
                        )}
                        {currentStep === FlowStep.Mint && (
                            <p className="text-lg text-slate-400">Protocol mints 1:1 <span className="font-bold text-white">USDAI</span> (stablecoin) and issues you <span className="font-bold text-indigo-400">sUSDAI</span>. You now hold the yield-bearing token.</p>
                        )}
                        {currentStep === FlowStep.Allocation && (
                            <p className="text-lg text-slate-400">The backing funds are deployed. High allocations go to purchase <span className="font-bold text-yellow-400">GPUs</span> for rental income, remaining funds buy liquid <span className="font-bold text-emerald-400">T-Bills</span>.</p>
                        )}
                        {currentStep === FlowStep.Yield && (
                            <p className="text-lg text-slate-400">Compute clients pay for GPU time and Treasuries mature. This generates <span className="font-bold text-emerald-400">Real Yield</span> flowing back to the protocol.</p>
                        )}
                        {currentStep === FlowStep.Distribute && (
                            <p className="text-lg text-slate-400">The protocol directs this new value into the <span className="font-bold text-indigo-400">sUSDAI</span> pool. Your sUSDAI balance automatically increases without you doing anything.</p>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
