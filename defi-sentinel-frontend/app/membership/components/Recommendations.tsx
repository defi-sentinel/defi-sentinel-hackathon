"use client";

import { useMembership } from "@/context/MembershipContext";
import { ArrowRight, Lock } from "lucide-react";

export default function Recommendations({ onUpgrade }: { onUpgrade?: () => void }) {
  const { tier } = useMembership();
  const isMember = tier !== 'free';

  const recommendations = [
    {
        id: 1,
        title: "Aave V3 Loop Strategy",
        apy: "12.5%",
        risk: "Medium",
        category: "Lending"
    },
    {
        id: 2,
        title: "Curve Stablecoin Farm",
        apy: "8.2%",
        risk: "Low",
        category: "Liquidity"
    },
    {
        id: 3,
        title: "Uniswap V3 ETH-USDC",
        apy: "24.1%",
        risk: "High",
        category: "LP"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recommended for You</h3>
            {isMember && <span className="text-xs text-gray-500">Based on your risk profile</span>}
        </div>
        
        <div className="relative p-6">
            {!isMember && (
                <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 max-w-xs">
                        <Lock className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Unlock Recommendations</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get personalized strategy suggestions based on your risk profile.</p>
                        <button 
                            onClick={onUpgrade}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Upgrade Membership
                        </button>
                    </div>
                </div>
            )}

            <div className={`space-y-4 ${!isMember ? 'opacity-40 pointer-events-none' : ''}`}>
                {recommendations.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                    {rec.category}
                                </span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                    rec.risk === 'Low' ? 'bg-green-100 text-green-700' : 
                                    rec.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {rec.risk} Risk
                                </span>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{rec.title}</h4>
                        </div>
                        <div className="text-right">
                            <div className="text-emerald-500 font-bold text-lg">{rec.apy}</div>
                            <div className="text-xs text-gray-500">APY</div>
                        </div>
                    </div>
                ))}
                
                 <button className="w-full py-3 text-sm text-center text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center justify-center gap-1">
                    View All Strategies <ArrowRight size={16} />
                 </button>
            </div>
        </div>
    </div>
  );
}

