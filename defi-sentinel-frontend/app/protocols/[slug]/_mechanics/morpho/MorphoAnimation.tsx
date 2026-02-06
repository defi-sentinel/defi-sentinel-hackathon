import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Zap } from 'lucide-react';

interface MorphoAnimationProps {
    matchingRatio: number; // 0 to 1
}

const MorphoAnimation: React.FC<MorphoAnimationProps> = ({ matchingRatio }) => {
    // We use a fixed coordinate system of 800x400 (2:1 aspect ratio) for perfect alignment
    // The container will scale this keeping aspect ratio
    const width = 800;
    const height = 400;

    const totalNodes = 6;
    const p2pNodesCount = Math.round(totalNodes * matchingRatio);

    // Layout Constants
    const colLeftX = 50;
    const colRightX = 750;
    // Center Column Hubs
    // P2P Hub: y=150, height=60 -> Center connection points roughly at y=150
    // Pool Hub: y=250, height=60
    const p2pHubY = 150;
    const poolHubY = 250;

    // Calculate Y positions for 6 nodes distributed vertically
    // Spanning from y=60 to y=340 (280px range) -> 56px steps
    const nodeYPositions = Array.from({ length: totalNodes }).map((_, i) => 60 + i * 56);

    // Connection point offsets for the hubs (width 160px -> 80px half width)
    const centerX = 400;
    const hubLeftX = centerX - 85;
    const hubRightX = centerX + 85;

    return (
        <div className="w-full flex justify-center bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative w-full max-w-5xl aspect-[2/1] z-10 mx-auto">

                {/* SVG Layer for Lines */}
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                >
                    <defs>
                        <linearGradient id="grad-p2p" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                    </defs>

                    {nodeYPositions.map((y, i) => {
                        const isP2P = i < p2pNodesCount;
                        const targetY = isP2P ? p2pHubY : poolHubY;

                        // Supply Path (Left -> Hub)
                        const supplyPath = `M ${colLeftX} ${y} C ${colLeftX + 50} ${y}, ${hubLeftX - 50} ${targetY}, ${hubLeftX} ${targetY}`;

                        // Borrow Path (Hub -> Right)
                        const borrowPath = `M ${hubRightX} ${targetY} C ${hubRightX + 50} ${targetY}, ${colRightX - 50} ${y}, ${colRightX} ${y}`;

                        const strokeColor = isP2P ? '#10b981' : '#334155'; // Emerald-500 : Slate-700
                        const activeStrokeWidth = isP2P ? 2 : 1;
                        const opacity = isP2P ? 1 : 0.4;

                        return (
                            <g key={i}>
                                {/* Supply Line */}
                                <path
                                    d={supplyPath}
                                    fill="none"
                                    stroke={strokeColor}
                                    strokeWidth={activeStrokeWidth}
                                    strokeOpacity={opacity}
                                />
                                {/* Borrow Line */}
                                <path
                                    d={borrowPath}
                                    fill="none"
                                    stroke={isP2P ? '#fb7185' : '#334155'} // Rose-400 : Slate-700
                                    strokeWidth={activeStrokeWidth}
                                    strokeOpacity={opacity}
                                />

                                {/* Animated Flow Particles */}
                                {isP2P && (
                                    <>
                                        <circle r="3" fill="#10b981" className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                                            <animateMotion dur={`${2 + i * 0.2}s`} repeatCount="indefinite" path={supplyPath} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                                        </circle>
                                        <circle r="3" fill="#f43f5e" className="filter drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                                            <animateMotion dur={`${2 + i * 0.2}s`} begin="0.5s" repeatCount="indefinite" path={borrowPath} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                                        </circle>
                                    </>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* HTML Layer for Nodes */}
                {/* Lenders Column */}
                {nodeYPositions.map((y, i) => (
                    <div
                        key={`lender-${i}`}
                        className="absolute w-8 h-8 -ml-4 -mt-4 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center shadow-lg hover:border-emerald-500/50 z-10 transition-colors duration-300"
                        style={{ left: `${(colLeftX / width) * 100}%`, top: `${(y / height) * 100}%` }}
                    >
                        <User size={16} className="text-emerald-500" />
                    </div>
                ))}

                {/* Borrowers Column */}
                {nodeYPositions.map((y, i) => (
                    <div
                        key={`borrower-${i}`}
                        className="absolute w-8 h-8 -ml-4 -mt-4 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center shadow-lg hover:border-rose-500/50 z-10 transition-colors duration-300"
                        style={{ left: `${(colRightX / width) * 100}%`, top: `${(y / height) * 100}%` }}
                    >
                        <User size={16} className="text-rose-500" />
                    </div>
                ))}

                {/* Labels */}
                <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-500 tracking-wider">LENDERS</div>
                <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-500 tracking-wider">BORROWERS</div>

                {/* Central Mechanisms */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-40 flex flex-col justify-center gap-8 pointer-events-none">
                    {/* Position helper to match SVG coordinates */}
                    <div className="absolute w-full h-full top-0 left-0">
                        {/* P2P Box */}
                        <motion.div
                            className="absolute left-0 right-0 h-16 -mt-8 bg-slate-900/90 backdrop-blur-sm border-2 rounded-xl flex items-center justify-center shadow-lg z-20"
                            style={{ top: `${(p2pHubY / height) * 100}%` }}
                            animate={{
                                borderColor: p2pNodesCount > 0 ? '#6366f1' : '#1e293b', // Indigo-500 : Slate-800
                                scale: p2pNodesCount > 0 ? 1.05 : 1,
                                boxShadow: p2pNodesCount > 0 ? '0 0 20px rgba(99, 102, 241, 0.2)' : 'none'
                            }}
                        >
                            <span className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                                <Zap size={16} fill="currentColor" /> Morpho P2P
                            </span>
                        </motion.div>

                        {/* Pool Box */}
                        <motion.div
                            className="absolute left-0 right-0 h-16 -mt-8 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center z-10"
                            style={{ top: `${(poolHubY / height) * 100}%` }}
                            animate={{ opacity: p2pNodesCount === totalNodes ? 0.3 : 1 }}
                        >
                            <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                <Building2 size={16} /> Underlying Pool
                            </span>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MorphoAnimation;
