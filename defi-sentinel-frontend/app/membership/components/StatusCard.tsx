"use client";

import { Calendar, Clock, AlertTriangle, CheckCircle, Zap, RefreshCw, HelpCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import { useMembership } from "@/context/MembershipContext";

export default function StatusCard({ onUpgrade }: { onUpgrade: () => void }) {
    const { tier, expiryDate, membershipData, isLoading, refreshMembership } = useMembership();
    const { isConnected, address } = useAccount();
    const [isRestoring, setIsRestoring] = useState(false);
    const [restoreMsg, setRestoreMsg] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    const handleRestore = async () => {
        if (!address) return;
        setIsRestoring(true);
        setRestoreMsg(null);
        try {
            // Call backend to verify on-chain status
            const res = await axios.post(`/api/membership/${address}/sync`);

            if (res.data.success) {
                await refreshMembership();
                setRestoreMsg({ type: 'success', text: "Membership restored successfully!" });
            } else {
                setRestoreMsg({ type: 'info', text: "No active membership found on-chain." });
            }
        } catch (error) {
            console.error("Restore failed", error);
            setRestoreMsg({ type: 'error', text: "We couldn't verify payment. Please contact support." });
        } finally {
            setIsRestoring(false);
        }
    };

    const memberSince = membershipData?.memberSince
        ? new Date(membershipData.memberSince).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : "Not Registered";

    const getDaysRemaining = () => {
        if (!expiryDate) return 0;
        const now = Date.now();
        const diff = expiryDate - now;
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    };

    const daysRemaining = getDaysRemaining();
    const maxDays = 30; // Assuming monthly for progress bar visualization
    const progressPercentage = Math.min(100, (daysRemaining / maxDays) * 100);

    // Status Logic
    const isActive = tier !== 'free' && daysRemaining > 0;
    const isExpiringSoon = isActive && daysRemaining < 7;

    if (!isConnected) return null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Membership Overview</h2>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                                {isActive ? (tier === 'yearly' ? 'Pro Yearly' : 'Pro Monthly') : 'Free Plan'}
                            </span>
                            {isExpiringSoon && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                    <AlertTriangle size={12} />
                                    Expiring Soon
                                </span>
                            )}
                        </div>
                    </div>
                    {isActive && (
                        <button
                            onClick={onUpgrade}
                            className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Renew Plan
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Member Since</div>
                            <div className="font-semibold text-gray-900 dark:text-white">{memberSince}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                            <Clock size={20} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Days Remaining</div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                                {isActive ? `${daysRemaining} Days` : '-'}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                            <Zap size={20} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Auto-Renew and credit card payment</div>
                            <div className="font-semibold text-gray-900 dark:text-white">Coming Soon</div>
                        </div>
                    </div>
                </div>

                {isActive && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Plan Progress</span>
                            <span>{daysRemaining} days left</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {!isActive && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Upgrade to Pro to access exclusive strategies and alerts.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                onClick={onUpgrade}
                                className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                            >
                                Upgrade Now
                            </button>
                            <button
                                onClick={handleRestore}
                                disabled={isRestoring}
                                className="text-sm border border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <RefreshCw size={14} className={isRestoring ? "animate-spin" : ""} />
                                {isRestoring ? "Checking..." : "Restore Purchase"}
                            </button>
                        </div>
                        {restoreMsg && (
                            <div className={`mt-3 text-xs px-3 py-1.5 rounded-md inline-flex items-center gap-2 ${restoreMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                restoreMsg.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                    'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                }`}>
                                {restoreMsg.text}
                                {restoreMsg.type === 'error' && <a href="mailto:support@defisentinel.org" className="underline font-bold">support@defisentinel.org</a>}
                            </div>
                        )}
                    </div>
                )}


            </div>
        </div>
    );
}

