"use client";

import { X, Check, Star, AlertTriangle } from 'lucide-react';
import { useMembership } from '@/context/MembershipContext';
import { useState } from 'react';
import confetti from 'canvas-confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { subscribe, isLoading, subscriptionStep, resetSubscriptionState } = useMembership();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'custom' | null>(null);
  const [customMonths, setCustomMonths] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const getStepProgress = () => {
    switch (subscriptionStep) {
      case 'approving': return { step: 1, label: 'Approving USDC spend...', color: 'text-blue-500', percent: 20 };
      case 'waiting-approval': return { step: 1, label: 'Waiting for blockchain confirmation...', color: 'text-blue-600', percent: 40 };
      case 'paying': return { step: 2, label: 'Sending payment transaction...', color: 'text-emerald-500', percent: 60 };
      case 'waiting-payment': return { step: 2, label: 'Waiting for payment confirmation...', color: 'text-emerald-600', percent: 80 };
      case 'updating-backend': return { step: 3, label: 'Finalizing your membership...', color: 'text-purple-500', percent: 100, glow: true };
      case 'completed': return { step: 3, label: 'Success!', color: 'text-emerald-500', percent: 100 };
      default: return { step: 0, label: 'Processing...', color: 'text-gray-500', percent: 10 };
    }
  };

  const currentStep = getStepProgress();

  const calculateCustomPrice = (months: number) => {
    if (months === 12) return 99.9;
    if (months === 24) return 199.8;

    if (months < 12) {
      return months * 9.9;
    } else {
      const extraMonths = months - 12;
      return 99.9 + (extraMonths * 9.9);
    }
  };

  const customPrice = calculateCustomPrice(customMonths);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    setErrorMessage(null);
    try {
      if (selectedPlan === 'custom') {
        await subscribe('custom', customMonths);
      } else {
        await subscribe(selectedPlan);
      }

      setShowSuccess(true);

      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      setTimeout(() => {
        resetSubscriptionState();
        setShowSuccess(false);
        onClose();
      }, 3000);

    } catch (e: any) {
      console.error(e);
      let msg = e.message || "Subscription failed or cancelled.";
      if (msg.includes("rejected")) msg = "Transaction rejected by user.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm min-h-screen">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-gray-200 dark:border-gray-800 relative">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upgrade Membership (Mock version, no real tx)</h2>
          <button onClick={() => {
            resetSubscriptionState();
            setErrorMessage(null);
            setShowSuccess(false);
            onClose();
          }} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="relative min-h-[300px] flex flex-col">
          {showSuccess ? (
            <div className="flex-grow flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
              <div className="mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-4">
                <Check size={48} className="text-emerald-500 animate-bounce" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">Congratulations!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center text-lg">Your membership has been upgraded successfully.</p>
            </div>
          ) : errorMessage ? (
            <div className="flex-grow flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom duration-300">
              <div className="mb-6 rounded-full bg-red-100 dark:bg-red-900/30 p-4">
                <AlertTriangle size={48} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Transaction Error</h3>
              <p className="text-red-600 dark:text-red-400 text-center mb-8 max-w-md">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex-grow flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="w-full max-w-md space-y-8 text-center">
                <div className="relative h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${(currentStep as any).glow ? 'bg-purple-500 shadow-[0_0_20px_#a855f7] animate-pulse' : currentStep.color.replace('text', 'bg')}`}
                    style={{ width: `${currentStep.percent}%` }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-xl font-bold ${currentStep.color}`}>{currentStep.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Step {currentStep.step} of 3 (Please check your wallet)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-medium uppercase tracking-wider">
                  <div className={`p-3 rounded-lg border ${currentStep.step >= 1 ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20' : 'border-gray-200 text-gray-400'}`}>
                    1. Approve USDC
                  </div>
                  <div className={`p-3 rounded-lg border ${currentStep.step >= 2 ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20' : 'border-gray-200 text-gray-400'}`}>
                    2. Pay Membership
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 grid md:grid-cols-3 gap-4 flex-grow">
                {/* Monthly Plan */}
                <div
                  onClick={() => setSelectedPlan('monthly')}
                  className={`relative z-10 border rounded-xl p-3 cursor-pointer transition-colors duration-200 flex flex-col h-full ${selectedPlan === 'monthly'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-2 ring-emerald-500 ring-opacity-50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">1 Month</h3>
                    {selectedPlan === 'monthly' && <Check size={18} className="text-emerald-500" />}
                  </div>
                  <div className="flex items-baseline mb-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">$9.9</span>
                  </div>
                  <ul className="space-y-1 mb-4 text-[11px] text-gray-600 dark:text-gray-300 flex-grow">
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Recommended</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> All Research</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> All Strategies</li>
                  </ul>
                </div>

                {/* Yearly Plan */}
                <div
                  onClick={() => setSelectedPlan('yearly')}
                  className={`relative z-10 border rounded-xl p-3 cursor-pointer transition-colors duration-200 flex flex-col h-full ${selectedPlan === 'yearly'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-2 ring-emerald-500 ring-opacity-50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                    }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1 z-10">
                    <Star size={8} fill="currentColor" />
                    <span>BEST VALUE • SAVE 17%</span>
                  </div>

                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">1 Year</h3>
                    {selectedPlan === 'yearly' && <Check size={18} className="text-emerald-500" />}
                  </div>
                  <div className="flex items-baseline mb-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">$99.9</span>
                  </div>
                  <ul className="space-y-1 mb-4 text-[11px] text-gray-600 dark:text-gray-300 flex-grow">
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Special Badge</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> 2 Months Free</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Priority Support</li>
                  </ul>
                </div>

                {/* Custom Plan */}
                <div
                  onClick={() => setSelectedPlan('custom')}
                  className={`relative z-10 border rounded-xl p-3 cursor-pointer transition-colors duration-200 flex flex-col h-full ${selectedPlan === 'custom'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-2 ring-emerald-500 ring-opacity-50'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Custom</h3>
                    {selectedPlan === 'custom' && <Check size={18} className="text-emerald-500" />}
                  </div>
                  <div className="flex items-baseline mb-1">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">${customPrice.toFixed(1)}</span>
                  </div>
                  <div className="mb-2 text-[10px] text-gray-500 font-medium">{customMonths} Month{customMonths > 1 ? 's' : ''}</div>
                  <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="range"
                      min="1"
                      max="24"
                      value={customMonths}
                      onChange={(e) => setCustomMonths(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading || !selectedPlan}
                  className={`w-full py-3 px-4 font-bold rounded-lg transition-colors shadow-lg ${isLoading || !selectedPlan
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                    }`}
                >
                  {isLoading ? 'Processing...' : selectedPlan ? 'Confirm Subscription' : 'Select a Plan'}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center text-[10px] text-gray-500 border-t border-gray-200 dark:border-gray-800">
          Two transactions required: 1) Authorize USDC, 2) Complete payment.
        </div>
      </div>
    </div>
  );
}
