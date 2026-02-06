import { ReactNode, useState, useEffect } from 'react';
import { useMembership } from '@/context/MembershipContext';
import { useAccount } from 'wagmi';
import { Lock, Wallet } from 'lucide-react';
import SubscriptionModal from './SubscriptionModal';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LuckyWheelGame } from './lucky-wheel/LuckyWheelGame';
import { API_BASE_URL } from '@/lib/constants';
import { Confetti } from './lucky-wheel/Confetti';

interface ProGateProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback
  condition?: boolean; // If false, bypass gating (show content). Default: true
}

export default function ProGate({ children, fallback, condition = true }: ProGateProps) {
  const { isConnected, address } = useAccount();
  const { tier, refreshMembership } = useMembership();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [luckyNumber, setLuckyNumber] = useState<string | null>(null);
  const [isCheckingClaim, setIsCheckingClaim] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Load Lucky Number from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('hex_lucky_number');
    if (stored) {
      setLuckyNumber(stored);
    }
  }, []);

  const handleSpinEnd = (result: string) => {
    setLuckyNumber(result);
    localStorage.setItem('hex_lucky_number', result);
  };

  const checkLuckyMatch = () => {
    if (!address || !luckyNumber) return false;
    const lastChar = address.slice(-1).toUpperCase();
    return lastChar === luckyNumber.toUpperCase();
  };

  const handleUnlockReward = async () => {
    if (!address || !luckyNumber) return;
    setIsCheckingClaim(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/membership/claim-lucky-wheel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, luckyNumber })
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Refresh context
        await refreshMembership();
        // Auto-dismiss to reveal content (fireworks/confetti handled by match found logic or could re-trigger)
        setIsDismissed(true);
      } else {
        console.error(data.error);
        alert("Error claiming reward: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Network error claiming reward.");
    } finally {
      setIsCheckingClaim(false);
    }
  };

  // If gating is disabled (condition is false), show content immediately
  if (!condition) {
    return <>{children}</>;
  }

  // Logic: 
  // 1. If not connected -> Show Gate
  // 2. If connected + Free -> Show Gate
  // 3. If connected + Pro -> 
  //    NORMALLY Show Content.
  //    BUT if they matched the lucky wheel (Promotion!) and HAVEN'T dismissed it yet, Show Gate (Win Screen).

  // If user is connected and has pro membership (monthly or yearly), show content
  if (isConnected && tier !== 'free') {
    return <>{children}</>;
  }

  // If fallback is provided, show it instead of locked overlay
  if (fallback) {
    return <>{fallback}</>;
  }

  // Otherwise show gated view
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 min-h-[600px]">
      {/* Blurred Content Preview */}
      <div className="blur-md opacity-30 pointer-events-none select-none p-6" aria-hidden="true">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-20 text-center bg-gradient-to-b from-white/95 via-white/98 to-white dark:from-gray-900/95 dark:via-gray-900/98 dark:to-gray-900">

        {/* Scenario 1: No Lucky Number yet (Did not spin) */}
        {!luckyNumber && (
          <div className="w-full max-w-lg px-6">
            <div className="mb-6">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
                <Lock size={32} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                Pro Access Required
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Unlock advanced strategies and research.</p>
            </div>

            {/* Lucky Wheel Game - Adjusted scale and padding */}
            <div className="bg-white/50 dark:bg-black/20 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-inner mx-auto backdrop-blur-sm mb-6">
              <LuckyWheelGame onSpinEnd={handleSpinEnd} />
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">Or Unlock Immediately</p>
              {!isConnected ? (
                <div className="flex justify-center">
                  <ConnectButton chainStatus="none" showBalance={false} />
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90 transition-all"
                >
                  View Plans
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scenario 2: Has Lucky Number (Spun already) */}
        {luckyNumber && (
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 px-6">
            <div className="mb-10">
              <div className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">Your Lucky Number</div>
              {/* Changed color from blue/purple to generic dark/light or a specific gold/winner shade */}
              <div className="text-[120px] leading-none font-black text-gray-900 dark:text-white drop-shadow-2xl"
                style={{ textShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}>
                {luckyNumber}
              </div>
            </div>

            {isConnected ? (
              checkLuckyMatch() ? (
                // MATCH FOUND
                <div className="p-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl relative overflow-hidden">
                  <Confetti />
                  <div className="flex justify-center mb-6">
                    <span className="text-5xl">🎉</span>
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                    Jackpot! Wallet Matched!
                  </h4>
                  <p className="text-emerald-600/80 dark:text-emerald-400/80 text-lg mb-8">
                    Your wallet ends in <span className="font-mono font-bold bg-white/50 dark:bg-black/20 px-2 py-1 rounded mx-1">{luckyNumber}</span>.
                    <br />You've won 6 months of free access!
                  </p>
                  <button
                    onClick={tier !== 'free' ? undefined : handleUnlockReward}
                    disabled={isCheckingClaim || tier !== 'free'}
                    className={`w-full py-4 font-bold text-xl rounded-xl shadow-xl transition-all ${tier !== 'free'
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-default shadow-none'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 hover:scale-105 active:scale-95'
                      }`}
                  >
                    {isCheckingClaim ? 'Unlocking...' : (tier !== 'free' ? 'Already a Member' : 'UNLOCK FREE MEMBERSHIP')}
                  </button>

                  {(tier !== 'free' || isDismissed) && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setIsDismissed(true)}
                        className="text-sm text-gray-400 hover:text-white underline decoration-dashed underline-offset-4"
                      >
                        Continue to Dashboard
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // NO MATCH
                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-3xl">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Not a match... yet!
                  </h4>
                  <div className="text-gray-500 mb-8 text-base">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span>Your wallet ends in:</span>
                      <span className="font-mono font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-lg">{address?.slice(-1).toUpperCase()}</span>
                    </div>
                    <div>
                      Connect a wallet ending in <span className="font-mono font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-lg">{luckyNumber}</span> to get 6 month membership for free!
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-center">
                      <ConnectButton chainStatus="none" showBalance={false} />
                    </div>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-gray-50 dark:bg-gray-800 px-2 text-gray-400 font-bold">Or</span></div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90 shadow-lg"
                    >
                      Purchase Pro membership
                    </button>
                  </div>
                </div>
              )
            ) : (
              // NOT CONNECTED
              <div className="p-8 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  One Step Away
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                  Connect a wallet ending in <span className="font-mono font-bold text-2xl mx-1 text-emerald-500">{luckyNumber}</span> to unlock for free!
                </p>
                <div className="flex justify-center scale-110">
                  <ConnectButton chainStatus="none" showBalance={false} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

