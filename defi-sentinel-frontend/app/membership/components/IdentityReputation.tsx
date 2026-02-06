"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Shield, BookOpen, Fingerprint, Mail, CheckCircle, Loader2 } from "lucide-react";
import { useMembership } from "@/context/MembershipContext";

export default function IdentityReputation({ onEmailVerified }: { onEmailVerified?: (verified: boolean) => void }) {
    const { address, isConnected } = useAccount();
    const { membershipData } = useMembership();
    const [email, setEmail] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    // Backend-powered data
    const quizCompleted = membershipData?.quizCompleted ?? 0;
    const totalQuizzes = 3;
    const riskAssessmentDone = membershipData?.riskAssessmentDone ?? false;

    const handleEmailVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsVerifying(true);
        // Mock verification API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setEmailVerified(true);
        setIsVerifying(false);
        if (onEmailVerified) onEmailVerified(true);
    };

    if (!isConnected) return null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Fingerprint size={20} className="text-emerald-500" />
                Profile
            </h3>

            <div className="space-y-6">
                {/* Wallet Address */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Connected Wallet</span>
                    <code className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                        {address}
                    </code>
                </div>

                {/* Email Verification */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</span>
                    {emailVerified ? (
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-2 rounded-lg border border-emerald-100 dark:border-emerald-900/20">
                            <CheckCircle size={16} className="text-emerald-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{email}</span>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold ml-auto">Verified</span>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailVerification} className="space-y-2">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isVerifying}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isVerifying || !email}
                                    className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[70px]"
                                >
                                    {isVerifying ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500">Required for alerts & notifications</p>
                        </form>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <div className="flex items-start justify-between mb-2">
                            <BookOpen size={20} className="text-blue-500" />
                            {quizCompleted > 0 && (
                                <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                    {Math.round((quizCompleted / totalQuizzes) * 100)}%
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {quizCompleted > 0 ? `${quizCompleted}/${totalQuizzes}` : "--"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Quizzes Completed</div>
                    </div>

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/20">
                        <div className="flex items-start justify-between mb-2">
                            <Shield size={20} className="text-purple-500" />
                            {riskAssessmentDone && (
                                <span className="text-xs font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">Done</span>
                            )}
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {riskAssessmentDone ? "Verified" : "Pending"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Risk Assessment</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

