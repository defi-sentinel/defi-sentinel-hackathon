import React from 'react';
import EthenaAnimation from './EthenaAnimation';
import EthenaInfoCard from './EthenaInfoCard';
import { Zap, AlertTriangle } from 'lucide-react';

const EthenaMechanics: React.FC = () => {
    // Static Data (Replaces API Call)
    const apySources = [
        "Staked ETH Rewards (~3-4%): Consensus and Execution layer rewards from holding stETH.",
        "Funding Rates (Variable): Payments from short perpetual positions when the market is bullish."
    ];

    const risks = [
        "Funding Risk: Negative funding rates (bear market) could reduce yield or cause decay.",
        "Liquidation Risk: Spread deviation between spot stETH and perp ETH could theoretically trigger liquidation.",
        "Custodial Risk: Reliance on OES (Off-Exchange Settlement) providers."
    ];

    return (
        <div className="w-full h-full space-y-8">
            <div className="grid lg:grid-cols-12 gap-8 h-full">

                {/* Left Column: Visualization (Mechanics) */}
                <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                    <EthenaAnimation />
                </div>

                {/* Right Column: Info & Risks */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                    {/* Educational Card */}
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-md">
                        <strong className="text-white block mb-2 text-sm">Why Delta Neutral?</strong>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            By holding $1 of ETH (Spot Long) and Shorting $1 of ETH (Perp Short), the net value of the portfolio stays at $1 regardless of market movements. This allows USDe to act as a stablecoin without needing fiat backing.
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <EthenaInfoCard
                            title="Yield Sources"
                            items={apySources}
                            type="success"
                            icon={<Zap className="w-5 h-5 text-emerald-400" />}
                        />
                        <EthenaInfoCard
                            title="Key Risks"
                            items={risks}
                            type="warning"
                            icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EthenaMechanics;
