import React, { useEffect, useState } from 'react';
import { SparkState } from './types';

interface Props {
    sparkState: SparkState;
}

const SparkAnimation: React.FC<Props> = ({ sparkState }) => {
    const [animTime, setAnimTime] = useState(0);

    // Animation loop
    useEffect(() => {
        let frameId: number;
        const loop = (time: number) => {
            setAnimTime(time);
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const isLiquidated = sparkState.healthFactor < 1.0;

    // Calculate flow intensity based on values
    const supplyFlowSpeed = Math.max(0.2, Math.min(2, sparkState.supplyDaiAmount / 5000));
    const borrowFlowSpeed = Math.max(0.2, Math.min(2, sparkState.borrowAmount / 10000));
    const collateralFlowSpeed = Math.max(0.2, Math.min(2, sparkState.collateralAmount / 10));

    // Determine health color
    let healthColor = "#10b981"; // green
    if (isLiquidated) healthColor = "#ef4444"; // red (liquidated)
    else if (sparkState.healthFactor < 1.1) healthColor = "#ef4444"; // red (risk)
    else if (sparkState.healthFactor < 1.5) healthColor = "#f59e0b"; // amber

    return (
        <div className={`w-full h-[400px] bg-slate-950 rounded-xl relative overflow-hidden select-none transition-colors duration-500 ${isLiquidated ? 'shadow-[inset_0_0_100px_rgba(239,68,68,0.2)] border-2 border-red-500/50' : ''}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_70%)]"></div>

            <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#475569" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#475569" stopOpacity="0.2" />
                    </linearGradient>

                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                    </marker>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* --- CONNECTIONS --- */}

                {/* User to Spark (Collateral) */}
                <path
                    d="M 150 200 C 250 200, 250 100, 400 100"
                    fill="none"
                    stroke={sparkState.collateralAmount > 0 ? "#3b82f6" : "#1e293b"}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />

                {/* User to Spark (Supply DAI) */}
                <path
                    d="M 150 200 C 250 200, 250 300, 400 300"
                    fill="none"
                    stroke={sparkState.supplyDaiAmount > 0 ? "#10b981" : "#1e293b"}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />

                {/* Spark to Market (Yield) */}
                <path
                    d="M 500 300 L 650 300"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="opacity-30"
                />

                {/* Spark to User (Borrow) */}
                <path
                    d="M 400 130 C 300 130, 300 200, 150 200"
                    fill="none"
                    stroke={sparkState.borrowAmount > 0 ? "#f59e0b" : "#1e293b"}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />

                {/* LIQUIDATION PATH (Slash) */}
                {isLiquidated && (
                    <path
                        d="M 450 130 Q 550 130, 650 300"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                    />
                )}

                {/* --- PARTICLES (Animated) --- */}

                {/* Collateral Particles (Blue) */}
                {sparkState.collateralAmount > 0 && !isLiquidated && Array.from({ length: 3 }).map((_, i) => (
                    <circle key={`col-${i}`} r="4" fill="#60a5fa" filter="url(#glow)">
                        <animateMotion
                            dur={`${3 / collateralFlowSpeed}s`}
                            repeatCount="indefinite"
                            begin={`-${i}s`}
                            path="M 150 200 C 250 200, 250 100, 400 100"
                            rotate="auto"
                        />
                    </circle>
                ))}

                {/* Supply DAI Particles (Green) */}
                {sparkState.supplyDaiAmount > 0 && Array.from({ length: 3 }).map((_, i) => (
                    <circle key={`sup-${i}`} r="4" fill="#34d399" filter="url(#glow)">
                        <animateMotion
                            dur={`${3 / supplyFlowSpeed}s`}
                            repeatCount="indefinite"
                            begin={`-${i * 0.7}s`}
                            path="M 150 200 C 250 200, 250 300, 400 300"
                            rotate="auto"
                        />
                    </circle>
                ))}

                {/* Yield Particles (Small Green flowing back) */}
                {sparkState.supplyDaiAmount > 0 && Array.from({ length: 3 }).map((_, i) => (
                    <circle key={`yld-${i}`} r="2" fill="#a7f3d0">
                        <animateMotion
                            dur="4s"
                            repeatCount="indefinite"
                            begin={`-${i * 1.3}s`}
                            path="M 650 300 L 500 300"
                        />
                    </circle>
                ))}

                {/* Borrow Particles (Amber) */}
                {sparkState.borrowAmount > 0 && Array.from({ length: 3 }).map((_, i) => (
                    <circle key={`bor-${i}`} r="4" fill="#fbbf24" filter="url(#glow)">
                        <animateMotion
                            dur={`${3 / borrowFlowSpeed}s`}
                            repeatCount="indefinite"
                            begin={`-${i * 0.9}s`}
                            path="M 400 130 C 300 130, 300 200, 150 200"
                            rotate="auto"
                        />
                    </circle>
                ))}

                {/* LIQUIDATION PARTICLES (Slashing - Red moving from Collateral to Market) */}
                {isLiquidated && Array.from({ length: 8 }).map((_, i) => (
                    <circle key={`slash-${i}`} r="5" fill="#ef4444" filter="url(#glow)">
                        <animateMotion
                            dur="1.5s"
                            repeatCount="indefinite"
                            begin={`-${i * 0.2}s`}
                            path="M 450 130 Q 550 130, 650 300"
                            rotate="auto"
                        />
                    </circle>
                ))}


                {/* --- NODES --- */}

                {/* User Node */}
                <g transform="translate(150, 200)">
                    <circle r="40" fill="#1e293b" stroke={isLiquidated ? "#ef4444" : "#94a3b8"} strokeWidth="2" />
                    <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">USER</text>
                    <text x="0" y="55" textAnchor="middle" fill={isLiquidated ? "#fca5a5" : "#94a3b8"} fontSize="10">
                        {isLiquidated ? "Assets Seized" : "Wallet"}
                    </text>
                </g>

                {/* Spark Protocol Group */}
                <rect x="380" y="50" width="140" height="300" rx="20" fill="#0f172a" stroke="#6366f1" strokeWidth="2" fillOpacity="0.8" />
                <text x="450" y="80" textAnchor="middle" fill="#818cf8" fontSize="14" fontWeight="bold" letterSpacing="1">SPARK</text>

                {/* Collateral Vault Node */}
                <g transform="translate(450, 130)">
                    <circle r="35" fill={isLiquidated ? "#450a0a" : "#1e3a8a"} stroke={isLiquidated ? "#ef4444" : "#3b82f6"} strokeWidth={isLiquidated ? 3 : 2} />
                    <text x="0" y="0" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">COLLATERAL</text>
                    <text x="0" y="15" textAnchor="middle" fill={isLiquidated ? "#fca5a5" : "#93c5fd"} fontSize="9">
                        {isLiquidated ? "LIQUIDATING" : `${(sparkState.collateralAmount).toFixed(1)} ETH`}
                    </text>
                </g>

                {/* Liquidity/DSR Node */}
                <g transform="translate(450, 270)">
                    <circle r="35" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                    <text x="0" y="0" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">sDAI / DSR</text>
                    <text x="0" y="15" textAnchor="middle" fill="#6ee7b7" fontSize="9">{(sparkState.supplyDaiAmount / 1000).toFixed(1)}k DAI</text>
                </g>

                {/* External Market Node */}
                <g transform="translate(650, 300)">
                    <circle r="30" fill="#1e293b" stroke={isLiquidated ? "#ef4444" : "#475569"} strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill={isLiquidated ? "#ef4444" : "#94a3b8"} fontSize="10" fontWeight="bold">MAKER</text>
                    <text x="0" y="16" textAnchor="middle" fill="#64748b" fontSize="8">{isLiquidated ? "Auction" : "Yield Source"}</text>
                </g>

                {/* Liquidation Indicator (Risk) */}
                {!isLiquidated && sparkState.healthFactor < 1.1 && (
                    <g transform="translate(450, 130)">
                        <circle r="45" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.6">
                            <animate attributeName="r" values="35;50" dur="1s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0" dur="1s" repeatCount="indefinite" />
                        </circle>
                        <text x="0" y="-45" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">LIQUIDATION RISK</text>
                    </g>
                )}

                {/* SLASH/LIQUIDATED BIG INDICATOR */}
                {isLiquidated && (
                    <g transform="translate(400, 200)">
                        <text x="0" y="0" textAnchor="middle" fill="#ef4444" fontSize="48" fontWeight="bold" opacity="0.2" transform="rotate(-15)">LIQUIDATED</text>
                        <rect x="-150" y="-30" width="300" height="60" fill="black" opacity="0.5" />
                        <text x="0" y="10" textAnchor="middle" fill="#ef4444" fontSize="24" fontWeight="bold">LIQUIDATION EVENT</text>
                        <text x="0" y="30" textAnchor="middle" fill="#fca5a5" fontSize="12">Collateral Seized & Auctioned</text>
                    </g>
                )}

            </svg>

            {/* Floating Labels / HUD */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
                ETH Price: <span className="text-white font-mono">${sparkState.ethPrice}</span>
            </div>

            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700 flex flex-col items-end">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Health Factor</span>
                <span className="text-xl font-bold font-mono" style={{ color: healthColor }}>
                    {sparkState.healthFactor > 100 ? '∞' : sparkState.healthFactor.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default SparkAnimation;
