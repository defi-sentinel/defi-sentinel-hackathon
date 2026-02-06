"use client";

import { useMembership } from "@/context/MembershipContext";
import { useState } from "react";
import { Check, X } from "lucide-react";

interface RenewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RenewModal({ isOpen, onClose }: RenewModalProps) {
  const { subscribe, isLoading } = useMembership();
  const [selectedOption, setSelectedOption] = useState<'month' | 'year' | 'custom'>('month');
  const [customMonths, setCustomMonths] = useState(1);

  if (!isOpen) return null;

  const handleRenew = async () => {
    // For demo, we just map custom to monthly multiple times or just monthly for simplicity 
    // as the context only supports 'monthly' | 'yearly' string types for now.
    // In a real app, we'd pass the number of months.
    // For now, if custom is selected, we just trigger monthly but maybe console log the duration.
    try {
      if (selectedOption === 'custom') {
        // Custom duration - treat as monthly extension for now
        await subscribe('monthly');
      } else {
        await subscribe(selectedOption === 'year' ? 'yearly' : 'monthly');
      }
      onClose();
    } catch (e) {
      alert("Renewal failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm min-h-screen">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-800 relative">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Renew Membership</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Option 1: One Month */}
          <div
            onClick={() => setSelectedOption('month')}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedOption === 'month'
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-500'
              : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
              }`}
          >
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">1 Month</div>
              <div className="text-sm text-gray-500">$9.99</div>
            </div>
            {selectedOption === 'month' && <Check size={20} className="text-emerald-500" />}
          </div>

          {/* Option 2: One Year */}
          <div
            onClick={() => setSelectedOption('year')}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedOption === 'year'
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-500'
              : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
              }`}
          >
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">1 Year</div>
              <div className="text-sm text-gray-500">$99.90 <span className="text-emerald-500 text-xs font-bold ml-2">SAVE 17%</span></div>
            </div>
            {selectedOption === 'year' && <Check size={20} className="text-emerald-500" />}
          </div>

          {/* Option 3: Custom */}
          <div
            onClick={() => setSelectedOption('custom')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedOption === 'custom'
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-500'
              : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500'
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Custom Duration</div>
                <div className="text-sm text-gray-500">{(customMonths * 9.99).toFixed(2)} USD</div>
              </div>
              {selectedOption === 'custom' && <Check size={20} className="text-emerald-500" />}
            </div>

            {selectedOption === 'custom' && (
              <div className="mt-2">
                <input
                  type="range"
                  min="1"
                  max="36"
                  value={customMonths}
                  onChange={(e) => setCustomMonths(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1m</span>
                  <span className="font-bold text-emerald-600">{customMonths} months</span>
                  <span>36m</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleRenew}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Confirm Renewal (Demo)'}
          </button>
        </div>
      </div>
    </div>
  );
}

