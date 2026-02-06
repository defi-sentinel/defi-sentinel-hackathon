
import React, { useEffect, useState } from 'react';
import { ProtocolStep } from './babylonConstants';
import { Bitcoin, Server, Lock, Zap } from 'lucide-react';

interface BabylonAnimationProps {
    step: ProtocolStep;
}

const BabylonAnimation: React.FC<BabylonAnimationProps> = ({ step }) => {
    // Toggle for subtle animations
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(prev => !prev);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const isStepActive = (targetStep: number) => step >= targetStep;

    // Node Positions (Percentages)
    // This layout creates a cycle: Top-Left -> Top-Right -> Bottom-Right -> (Return)
    const pos = {
        wallet: { left: '20%', top: '25%' },
        script: { left: '80%', top: '25%' },
        validator: { left: '80%', top: '75%' },
        // Virtual point for the yield return path to corner
        yieldCorner: { left: '20%', top: '75%' }
    };

    return (
        <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #475569 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}>
            </div>

            {/* --- LAYER 1: CONNECTORS (SVG) --- */}
            {/* We use percentage coordinates in SVG to match the CSS positions of the nodes perfectly */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                <defs>
                    <linearGradient id="yieldGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#eab308" stopOpacity="0.1" />
                    </linearGradient>
                    <marker id="arrowhead-orange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
                    </marker>
                    <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                </defs>

                {/* Path 1: Wallet -> Script (Horizontal) */}
                <line
                    x1="20%" y1="25%" x2="80%" y2="25%"
                    stroke={isStepActive(ProtocolStep.LOCKING) ? "#f97316" : "#334155"}
                    strokeWidth="4"
                    strokeDasharray={isStepActive(ProtocolStep.LOCKING) ? "8,4" : "0"}
                    className="transition-colors duration-700"
                    markerEnd={isStepActive(ProtocolStep.LOCKING) ? "url(#arrowhead-orange)" : ""}
                />

                {/* Path 2: Script -> Validator (Vertical) */}
                <line
                    x1="80%" y1="25%" x2="80%" y2="75%"
                    stroke={isStepActive(ProtocolStep.VALIDATION) ? "#3b82f6" : "#334155"}
                    strokeWidth="4"
                    strokeDasharray={isStepActive(ProtocolStep.VALIDATION) ? "8,4" : "0"}
                    className="transition-colors duration-700 delay-300"
                    markerEnd={isStepActive(ProtocolStep.VALIDATION) ? "url(#arrowhead-blue)" : ""}
                />

                {/* Path 3a: Yield Return (Validator -> Corner) */}
                <line
                    x1="80%" y1="75%" x2="20%" y2="75%"
                    stroke={step === ProtocolStep.YIELD ? "#eab308" : "transparent"}
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    strokeLinecap="round"
                    className={`transition-all duration-300 ${step === ProtocolStep.YIELD ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Path 3b: Yield Return (Corner -> Wallet) */}
                <line
                    x1="20%" y1="75%" x2="20%" y2="25%"
                    stroke={step === ProtocolStep.YIELD ? "#eab308" : "transparent"}
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    strokeLinecap="round"
                    className={`transition-all duration-300 ${step === ProtocolStep.YIELD ? 'opacity-100' : 'opacity-0'}`}
                />
            </svg>

            {/* --- LAYER 2: NODES --- */}

            {/* Node 1: User Wallet */}
            <div
                className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{ left: pos.wallet.left, top: pos.wallet.top }}
            >
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 flex items-center justify-center bg-slate-800 transition-all duration-500 ${isStepActive(ProtocolStep.IDLE) ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'border-slate-600'}`}>
                    <div className="relative">
                        <Bitcoin className={`w-8 h-8 md:w-10 md:h-10 text-orange-500 ${step === ProtocolStep.UNBONDING ? 'animate-bounce' : ''}`} />
                        {/* Available BTC Indicator */}
                        <div className={`absolute -top-2 -right-2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500 border-2 border-slate-800 transition-opacity duration-300 ${step === ProtocolStep.IDLE || step === ProtocolStep.UNBONDING ? 'opacity-100' : 'opacity-0'}`}></div>
                    </div>
                </div>
                <span className="mt-2 text-xs md:text-sm font-bold text-slate-300 bg-slate-900/80 px-2 rounded">User Wallet</span>
            </div>

            {/* Node 2: Time-Lock Script */}
            <div
                className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{ left: pos.script.left, top: pos.script.top }}
            >
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 flex items-center justify-center bg-slate-800 transition-all duration-700 ${isStepActive(ProtocolStep.LOCKING) && step !== ProtocolStep.UNBONDING ? 'border-orange-400 bg-slate-800 scale-110 shadow-[0_0_30px_rgba(249,115,22,0.2)]' : 'border-slate-700 scale-100'}`}>
                    {isStepActive(ProtocolStep.LOCKING) && step !== ProtocolStep.UNBONDING ? (
                        <Lock className="w-8 h-8 text-orange-400 animate-pulse" />
                    ) : (
                        <div className="w-8 h-8 rounded-sm border border-slate-600 bg-slate-700"></div>
                    )}
                </div>
                <span className="mt-2 text-xs md:text-sm font-bold text-slate-300 bg-slate-900/80 px-2 rounded">Time-Lock</span>
            </div>

            {/* Node 3: PoS Validator */}
            <div
                className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{ left: pos.validator.left, top: pos.validator.top }}
            >
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 flex items-center justify-center bg-slate-800 transition-colors duration-500 ${isStepActive(ProtocolStep.VALIDATION) ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-slate-600'}`}>
                    <Server className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-300 ${isStepActive(ProtocolStep.VALIDATION) ? 'text-blue-500' : 'text-slate-600'}`} />
                    {isStepActive(ProtocolStep.VALIDATION) && (
                        <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                            SECURED
                        </div>
                    )}
                </div>
                <span className="mt-2 text-xs md:text-sm font-bold text-slate-300 bg-slate-900/80 px-2 rounded">PoS Validator</span>
            </div>

            {/* --- LAYER 3: MOVING PARTICLES --- */}

            {/* Particle 1: BTC (Wallet -> Script) */}
            <div
                className="absolute z-20 transition-all duration-1000 ease-in-out -translate-x-1/2 -translate-y-1/2"
                style={{
                    left: step >= ProtocolStep.LOCKING ? '80%' : '20%',
                    top: '25%',
                    opacity: step === ProtocolStep.LOCKING ? 1 : 0
                }}
            >
                <div className="bg-orange-500 p-2 rounded-full shadow-lg shadow-orange-500/50">
                    <Bitcoin className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Particle 2: Signing Power (Script -> Validator) */}
            <div
                className="absolute z-20 transition-all duration-1000 ease-in-out -translate-x-1/2 -translate-y-1/2 delay-300"
                style={{
                    left: '80%',
                    top: step >= ProtocolStep.VALIDATION ? '75%' : '25%',
                    opacity: step === ProtocolStep.VALIDATION ? 1 : 0
                }}
            >
                <div className="bg-blue-500 p-2 rounded-full shadow-lg shadow-blue-500/50 animate-spin-slow">
                    <Zap className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* Particle 3: Yield (Validator -> Wallet) */}
            {/* Only show during YIELD step, removed in UNBONDING step */}
            {step === ProtocolStep.YIELD && (
                <div className="absolute w-full h-full inset-0 pointer-events-none z-20">
                    {/* Yield Particle 1 */}
                    <div className="absolute animate-[yieldLoop_3s_infinite_linear] opacity-0">
                        <div className="bg-yellow-400 text-black font-bold text-[10px] w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-yellow-200">
                            $
                        </div>
                    </div>
                    {/* Yield Particle 2 (Delayed) */}
                    <div className="absolute animate-[yieldLoop_3s_infinite_linear_1.5s] opacity-0">
                        <div className="bg-yellow-400 text-black font-bold text-[10px] w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-yellow-200">
                            $
                        </div>
                    </div>
                </div>
            )}

            {/* Status Labels */}
            {step === ProtocolStep.LOCKING && (
                <div className="absolute top-[12%] left-1/2 -translate-x-1/2 bg-slate-800 border border-orange-500/50 text-orange-200 px-3 py-1 rounded text-xs whitespace-nowrap animate-in fade-in zoom-in">
                    Locking BTC...
                </div>
            )}

            {step === ProtocolStep.VALIDATION && (
                <div className="absolute top-[50%] right-[5%] -translate-y-1/2 bg-slate-800 border border-blue-500/50 text-blue-200 px-3 py-1 rounded text-xs whitespace-nowrap animate-in fade-in slide-in-from-right-4">
                    Delegating Security
                </div>
            )}

            <style>{`
        @keyframes yieldLoop {
            0% {
                left: 80%;
                top: 75%;
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
            10% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            40% {
                left: 20%;
                top: 75%;
            }
            80% {
                left: 20%;
                top: 25%;
                opacity: 1;
            }
            100% {
                left: 20%;
                top: 25%;
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.5);
            }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
        </div>
    );
};

export default BabylonAnimation;
