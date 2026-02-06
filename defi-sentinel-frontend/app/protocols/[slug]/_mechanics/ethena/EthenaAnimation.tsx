import React, { useState } from 'react';
import { RefreshCcw, TrendingUp, TrendingDown, ShieldCheck, DollarSign } from 'lucide-react';

const INITIAL_ETH_PRICE = 3000;
const COLLATERAL_ETH = 1;

const EthenaAnimation: React.FC = () => {
    const [ethPrice, setEthPrice] = useState<number>(INITIAL_ETH_PRICE);

    // Core Ethena Math
    // 1. Long Position: Holds 1 stETH. Value changes with price.
    const longValue = ethPrice * COLLATERAL_ETH;

    // 2. Short Position: Short 1 ETH Perp. 
    // Entry was at INITIAL_ETH_PRICE.
    // PnL = Entry Price - Current Price
    const shortPnL = INITIAL_ETH_PRICE - ethPrice;

    // The 'value' of the short side in the visualization includes the initial stablecoin mint value + PnL
    // Ideally, Ethena locks $3000 worth of short exposure. 
    // If ETH goes to $4000, Short loses $1000. 
    // If ETH goes to $2000, Short gains $1000.

    // Net Value (Backing USDe)
    const netValue = longValue + shortPnL;

    // Calculate PnL percentage for visuals
    const priceChangePct = ((ethPrice - INITIAL_ETH_PRICE) / INITIAL_ETH_PRICE) * 100;

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEthPrice(Number(e.target.value));
    };

    const resetSimulation = () => {
        setEthPrice(INITIAL_ETH_PRICE);
    };

    return (
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-2xl h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <RefreshCcw className="w-5 h-5 text-indigo-400" />
                        Delta-Neutral Mechanism
                    </h2>
                    <p className="text-sm text-slate-400">Drag the slider to simulate ETH price volatility.</p>
                </div>
                <button
                    onClick={resetSimulation}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-md transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Control Panel */}
            <div className="mb-8">
                <div className="flex justify-between text-sm mb-2 font-mono">
                    <span className="text-slate-400">ETH Price Scenario</span>
                    <span className="text-white font-bold">${ethPrice.toLocaleString()}</span>
                </div>
                <input
                    type="range"
                    min="1500"
                    max="4500"
                    step="10"
                    value={ethPrice}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>$1,500 (-50%)</span>
                    <span>Entry: ${INITIAL_ETH_PRICE}</span>
                    <span>$4,500 (+50%)</span>
                </div>
            </div>

            {/* Visualization Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                {/* LEFT: Spot Position (Long) */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-semibold text-emerald-400">Collateral (stETH)</span>
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                            ${longValue.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">
                            1.00 ETH Asset
                        </div>
                        <div className={`text-xs mt-2 font-mono ${priceChangePct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {priceChangePct >= 0 ? '+' : ''}{priceChangePct.toFixed(2)}% Value
                        </div>
                    </div>
                    {/* Visual Bar */}
                    <div className="mt-4 h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                            style={{ width: `${(longValue / 6000) * 100}%` }} // Scale roughly
                        ></div>
                    </div>
                </div>

                {/* MIDDLE: The Result (USDe) */}
                <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30 flex flex-col justify-center items-center relative">
                    <div className="absolute top-2 right-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="text-sm text-indigo-300 font-semibold mb-1">Portfolio Value (USDe)</div>
                    <div className="text-3xl font-black text-white tracking-tight">
                        ${netValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-indigo-200/60 mt-1">
                        Peg Stability: Perfect
                    </div>
                    <div className="mt-4 px-3 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-300 border border-indigo-500/30">
                        Delta = 0
                    </div>
                </div>

                {/* RIGHT: Short Position (Hedge) */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-semibold text-red-400">Short Perp (Hedge)</span>
                            <TrendingDown className="w-4 h-4 text-red-500" />
                        </div>

                        {/* 
              In reality, the short position value + margin balance changes. 
              Here we visualize the PnL impact on the total portfolio.
            */}
                        <div className={`text-2xl font-bold mb-1 ${shortPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {shortPnL >= 0 ? '+' : ''}${shortPnL.toLocaleString()}
                        </div>

                        <div className="text-xs text-slate-400">
                            1.00 ETH Short Contract
                        </div>
                        <div className="text-xs mt-2 text-slate-500">
                            {priceChangePct > 0 ? 'Losing value offsets asset gains' : 'Gaining value offsets asset loss'}
                        </div>
                    </div>
                    {/* Visual Bar representing inverse movement */}
                    <div className="mt-4 h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        {/* If price goes UP (longValue high), Short Liability grows (or PnL shrinks) */}
                        <div
                            className={`h-full transition-all duration-300 ease-out ${shortPnL >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(Math.abs(shortPnL) / 3000 * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Yield Generator Visualization */}
            <div className="border-t border-slate-800 pt-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-yellow-500" />
                    Where does the Yield come from?
                </h3>

                <div className="flex gap-4">
                    <div className="flex-1 bg-slate-800 p-3 rounded border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">Source 1</span>
                            <span className="text-xs font-bold text-emerald-400">~3-4%</span>
                        </div>
                        <div className="text-sm font-medium text-white">LST Staking Rewards</div>
                        <div className="text-xs text-slate-500 mt-1">Native ETH network validation rewards.</div>
                    </div>

                    <div className="flex-1 bg-slate-800 p-3 rounded border border-slate-700 relative overflow-hidden">
                        {/* Simple particle animation for funding */}
                        <div className="absolute top-0 right-0 p-1 opacity-20">
                            <div className="w-16 h-16 rounded-full bg-yellow-500 blur-xl animate-pulse"></div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">Source 2</span>
                            <span className="text-xs font-bold text-yellow-400">Variable</span>
                        </div>
                        <div className="text-sm font-medium text-white">Funding Rates</div>
                        <div className="text-xs text-slate-500 mt-1">
                            Shorts get paid when market is bullish (Longs pay Shorts).
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EthenaAnimation;
