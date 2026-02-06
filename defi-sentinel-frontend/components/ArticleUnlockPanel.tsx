"use client";

import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Lock, Unlock, Loader2, Wallet, Crown, ArrowRight } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SubscriptionModal from "@/app/components/SubscriptionModal";

import { API_BASE_URL } from "@/lib/constants";

interface ArticleUnlockPanelProps {
    slug: string;
    previewText?: string;
}

const BACKEND_URL = API_BASE_URL;

export default function ArticleUnlockPanel({ slug, previewText }: ArticleUnlockPanelProps) {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [status, setStatus] = useState<"idle" | "checking" | "signing" | "verifying" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [content, setContent] = useState<string | null>(null);
    const [membershipStatus, setMembershipStatus] = useState<"unknown" | "free" | "paid">("unknown");
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    // 1. Initial Load & Auto-Unlock Check
    useEffect(() => {
        if (isConnected && address) {
            checkMembershipAndUnlock();
        }
    }, [isConnected, address]);

    const checkMembershipAndUnlock = async () => {
        if (!address) return;
        setStatus("checking");

        try {
            // A. Check Membership Tier
            const memRes = await fetch(`${BACKEND_URL}/api/membership/${address}`);
            if (memRes.ok) {
                const memData = await memRes.json();
                if (memData.tier === 'free') {
                    setMembershipStatus('free');
                    setStatus("idle");
                    return; // Stop here, show upgrade UI
                } else {
                    setMembershipStatus('paid');
                }
            } else {
                // If fail, assume free or error out? Let's assume free to be safe or retry.
                console.error("Failed to check membership");
            }

            // B. Try Auto-Unlock with Token
            const storedToken = localStorage.getItem(`auth_token_${address}`);
            if (storedToken) {
                // Verify if token is still valid by trying to fetch content
                const contentRes = await fetch(`/api/research/unlock/${slug}`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });

                if (contentRes.ok) {
                    const data = await contentRes.json();
                    setContent(data.content);
                    setStatus("success");
                    return;
                } else if (contentRes.status === 403 || contentRes.status === 401) {
                    // Token expired
                    localStorage.removeItem(`auth_token_${address}`);
                }
            }

            setStatus("idle");
        } catch (e) {
            console.error("Auto-check failed", e);
            setStatus("idle");
        }
    };

    const handleUnlock = async () => {
        if (!address) return;

        try {
            setStatus("signing");
            setErrorMessage("");

            console.log("Fetching nonce from:", `${BACKEND_URL}/auth/nonce/${address}`);

            // 1. Get Nonce from Backend
            const nonceRes = await fetch(`${BACKEND_URL}/auth/nonce/${address}`);
            if (!nonceRes.ok) throw new Error("Failed to get nonce (Backend might be down)");
            const { nonce } = await nonceRes.json();

            // 2. Sign Message
            const signature = await signMessageAsync({ message: nonce });

            setStatus("verifying");

            // 3. Verify & Get Token
            const verifyRes = await fetch(`${BACKEND_URL}/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, signature }),
            });

            if (!verifyRes.ok) throw new Error("Verification failed");
            const { token } = await verifyRes.json();

            // Store token
            localStorage.setItem(`auth_token_${address}`, token);

            // 4. Access Protected Content
            const contentRes = await fetch(`/api/research/unlock/${slug}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!contentRes.ok) {
                if (contentRes.status === 402) {
                    setMembershipStatus('free');
                    throw new Error("Membership Required");
                }
                throw new Error("Failed to unlock content");
            }

            const data = await contentRes.json();
            setContent(data.content);
            setStatus("success");

        } catch (err: any) {
            console.error(err);
            setStatus("error");
            setErrorMessage(err.message || "Something went wrong");
        }
    };

    const handlePostPurchase = () => {
        setShowSubscriptionModal(false);
        // Re-run unlock flow or just check membership
        checkMembershipAndUnlock();
    };

    if (status === "success" && content) {
        return (
            <div className="animate-fade-in">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-8 flex items-center gap-3">
                    <Unlock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                        Article unlocked successfully
                    </span>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-img:rounded-xl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        );
    }

    // Show loading skeleton while checking membership or initializing
    const isChecking = status === "checking" || (isConnected && status === "idle" && membershipStatus === "unknown");

    if (isChecking) {
        return (
            <div className="animate-pulse space-y-4 py-8">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
            </div>
        );
    }

    return (
        <>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

                <div className="relative p-8 md:p-12 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        {membershipStatus === 'free' ? (
                            <Crown className="w-8 h-8 text-yellow-400" />
                        ) : (
                            <Lock className="w-8 h-8 text-emerald-400" />
                        )}
                    </div>

                    <h3 className="text-2xl font-bold mb-4">
                        {membershipStatus === 'free' ? "Upgrade to Membership" : "Premium Member Content"}
                    </h3>
                    <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                        {previewText || "This in-depth analysis is available exclusively to our members. Verify your membership to unlock the full insights."}
                    </p>

                    {/* Action Area */}
                    <div className="flex flex-col items-center gap-4">
                        {!isConnected ? (
                            <div className="scale-110">
                                <ConnectButton />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 w-full">

                                {membershipStatus === 'free' ? (
                                    /* UPGRADE FLOW */
                                    <button
                                        onClick={() => setShowSubscriptionModal(true)}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white text-lg font-bold rounded-xl shadow-lg shadow-yellow-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] w-full max-w-sm"
                                    >
                                        <div className="flex items-center justify-center gap-3">
                                            <Crown className="w-5 h-5 fill-current" />
                                            <span>Unlock Full Access</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                ) : (
                                    /* MEMBER UNLOCK FLOW */
                                    <button
                                        onClick={handleUnlock}
                                        disabled={status === "signing" || status === "verifying"}
                                        className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-lg font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed w-full max-w-sm"
                                    >
                                        <div className="flex items-center justify-center gap-3">
                                            {status === "signing" || status === "verifying" ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>{status === "signing" ? "Check Wallet..." : "Verifying..."}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                    <span>Unlock Article</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                )}

                                <div className="text-sm text-gray-400 flex items-center gap-2">
                                    <Wallet className="w-4 h-4" />
                                    <span>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm max-w-md animate-shake">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => handlePostPurchase()}
            />
        </>
    );
}
