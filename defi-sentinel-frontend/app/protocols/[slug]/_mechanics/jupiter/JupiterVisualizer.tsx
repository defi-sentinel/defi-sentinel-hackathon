import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { DexNode } from './types';

interface JupiterVisualizerProps {
    tradeSize: number; // 0-100 scale slider
    isSwapping: boolean;
}

const DEX_NODES: DexNode[] = [
    { id: 'orca', name: 'Orca', type: 'clmm', color: '#F9B738', yOffset: 20 },
    { id: 'raydium', name: 'Raydium', type: 'amm', color: '#8C6AF6', yOffset: 50 },
    { id: 'meteora', name: 'Meteora', type: 'stable', color: '#FF3B3B', yOffset: 80 },
];

export const JupiterVisualizer: React.FC<JupiterVisualizerProps> = ({ tradeSize, isSwapping }) => {
    // Determine active routes based on trade size
    const activeRoutes = useMemo(() => {
        if (tradeSize < 30) {
            // Small trade: Direct route via deepest liquidity (Raydium)
            return [{ id: 'path-1', nodes: ['raydium'], percentage: 100 }];
        } else if (tradeSize < 70) {
            // Medium trade: Split between two
            return [
                { id: 'path-1', nodes: ['raydium'], percentage: 60 },
                { id: 'path-2', nodes: ['orca'], percentage: 40 },
            ];
        } else {
            // Large trade: Split across all three to minimize price impact
            return [
                { id: 'path-1', nodes: ['raydium'], percentage: 40 },
                { id: 'path-2', nodes: ['orca'], percentage: 35 },
                { id: 'path-3', nodes: ['meteora'], percentage: 25 },
            ];
        }
    }, [tradeSize]);

    // SVG Calculation Helpers
    const inputPos = { x: 10, y: 50 };
    const outputPos = { x: 90, y: 50 };

    const getPathD = (node: DexNode) => {
        // Bezier curve from Input -> Node -> Output
        // Node X is fixed at 50%
        const nodeX = 50;
        const nodeY = node.yOffset;

        // Control points for smooth S-curve
        const cp1x = inputPos.x + (nodeX - inputPos.x) / 2;
        const cp1y = inputPos.y;

        const cp2x = nodeX - (nodeX - inputPos.x) / 2;
        const cp2y = nodeY;

        const cp3x = nodeX + (outputPos.x - nodeX) / 2;
        const cp3y = nodeY;

        const cp4x = outputPos.x - (outputPos.x - nodeX) / 2;
        const cp4y = outputPos.y;

        return `M ${inputPos.x} ${inputPos.y} 
            C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nodeX} ${nodeY} 
            C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${outputPos.x} ${outputPos.y}`;
    };

    return (
        <div className="relative w-full h-[400px] bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-inner">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(132, 204, 22, 0.05) 0%, transparent 70%)' }}></div>

            {/* SVG Layer for Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {activeRoutes.map((route) => {
                    const node = DEX_NODES.find(n => n.id === route.nodes[0]);
                    if (!node) return null;

                    return (
                        <g key={route.id}>
                            {/* Static Path Line */}
                            <path
                                d={getPathD(node)}
                                fill="none"
                                stroke={node.color}
                                strokeWidth={route.percentage / 25} // Thickness based on volume
                                strokeOpacity="0.2"
                                strokeLinecap="round"
                            />

                            {/* Animated Particle simulating trade flow */}
                            {isSwapping && (
                                <motion.path
                                    d={getPathD(node)}
                                    fill="none"
                                    stroke={node.color}
                                    strokeWidth={Math.max(1, route.percentage / 20)}
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: [0, 1, 1, 0],
                                        pathOffset: [0, 0, 0, 1]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatDelay: 0.2
                                    }}
                                />
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* DOM Elements Layer */}
            <div className="absolute inset-0 w-full h-full flex justify-between px-8 md:px-16 items-center z-10">

                {/* Input Token */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 z-20 border-4 border-slate-800">
                        <span className="font-bold text-lg text-white">SOL</span>
                    </div>
                    <div className="text-sm font-mono text-slate-400">Input</div>
                </div>

                {/* Render DEX Nodes based on their fixed positions */}
                {DEX_NODES.map((node) => {
                    // Check if this node is active in current route
                    const isActive = activeRoutes.some(r => r.nodes.includes(node.id));
                    const percentage = activeRoutes.find(r => r.nodes.includes(node.id))?.percentage || 0;

                    return (
                        <motion.div
                            key={node.id}
                            className="absolute left-1/2 -translate-x-1/2"
                            style={{ top: `${node.yOffset}%`, marginTop: '-24px' }} // Center vertically based on yOffset
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{
                                scale: isActive ? 1.1 : 0.9,
                                opacity: isActive ? 1 : 0.3,
                                filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)'
                            }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="relative group cursor-help pointer-events-auto">
                                <div
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-slate-800 shadow-xl backdrop-blur-md"
                                    style={{ borderColor: isActive ? node.color : 'transparent' }}
                                >
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }}></div>
                                    <span className="font-bold text-sm hidden md:block text-slate-200">{node.name}</span>
                                    {isActive && <span className="text-xs font-mono text-slate-400 ml-1">{percentage}%</span>}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Output Token */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center shadow-lg shadow-blue-400/20 z-20 border-4 border-slate-800 relative">
                        <Coins size={24} className="text-white drop-shadow-md" />
                        {isSwapping && (
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-lime-400"
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        )}
                    </div>
                    <div className="text-sm font-mono text-slate-400">USDC</div>
                </div>

            </div>
        </div>
    );
};
