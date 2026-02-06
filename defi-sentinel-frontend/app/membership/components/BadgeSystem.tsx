"use client";

import { useMembership } from "@/context/MembershipContext";
import { fetchMembership } from "@/lib/api";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image"; // Import Image
import { BADGE_DETAILS } from "@/lib/constants";
import BadgePopup from "./BadgePopup";
import { useWriteContract } from "wagmi";
import { BadgeNFT } from "@/lib/abis";
import { CONTRACTS } from "@/lib/constants";
import { parseEther } from "viem";

export default function BadgeSystem() {
    const { membershipData, isLoading, refreshMembership } = useMembership();
    const [localMinting, setLocalMinting] = useState<number | null>(null);
    const [newBadgeIds, setNewBadgeIds] = useState<number[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupIds, setPopupIds] = useState<number[]>([]);
    const prevBadgesRef = useRef<Set<number>>(new Set());
    const isFirstLoad = useRef(true);

    // Effect to detect new badges
    useEffect(() => {
        if (!membershipData?.badges) return;

        const currentBadgeIds = new Set(membershipData.badges.filter(b => b.earned).map(b => b.badgeId));

        if (isFirstLoad.current) {
            prevBadgesRef.current = currentBadgeIds;
            isFirstLoad.current = false;
            return;
        }

        // Find diff
        const newIds: number[] = [];
        for (const id of currentBadgeIds) {
            // Filter out auto-minted membership badges to avoid conflict with SubscriptionModal success
            if (!prevBadgesRef.current.has(id) && ![1001, 3001, 3002].includes(id)) {
                newIds.push(id);
            }
        }

        if (newIds.length > 0) {
            setNewBadgeIds(prev => [...prev, ...newIds]);
        }

        prevBadgesRef.current = currentBadgeIds;
    }, [membershipData]);


    const { writeContractAsync } = useWriteContract();

    const handleMint = async (id: number) => {
        setLocalMinting(id);
        try {
            // Determine price: Mock 0.001 ETH for paid badges (IDs > 1001 usually)
            const isPaid = id >= 2000;
            const price = isPaid ? parseEther("0.001") : BigInt(0);

            const txHash = await writeContractAsync({
                address: CONTRACTS.BadgeNFT as `0x${string}`,
                abi: BadgeNFT.abi,
                functionName: 'mintBadge',
                args: [BigInt(id)],
                value: price,
            });

            // Polling Logic: Wait for backend to see the event
            const pollInterval = 3000;
            const maxAttempts = 20; // 60s
            let attempts = 0;
            let isConfirmed = false;

            // Need wallet address for polling
            const wallet = membershipData?.walletAddress;
            if (!wallet) throw new Error("No wallet address");

            while (attempts < maxAttempts) {
                await new Promise(r => setTimeout(r, pollInterval));

                // Direct API fetch to check status
                const freshData = await fetchMembership(wallet); // Need to import this
                const freshBadge = freshData.badges.find(b => b.badgeId === id);

                if (freshBadge && freshBadge.nftMinted) {
                    isConfirmed = true;
                    break;
                }

                attempts++;
            }

            if (isConfirmed) {
                await refreshMembership(); // Final sync for UI
                setPopupIds([id]);
                setPopupOpen(true);
            } else {
                console.warn("Minting timeout: Backend did not update in time.");
                await refreshMembership();
            }

        } catch (error) {
            console.error("Minting failed:", error);
        } finally {
            setLocalMinting(null);
        }
    };

    // Prepare badge list: Use keys from BADGE_DETAILS to ensure all are shown
    const allBadgeIds = Object.keys(BADGE_DETAILS).map(Number);

    // Map backend data to UI
    const badges = allBadgeIds.map(id => {
        const earnedBadge = membershipData?.badges.find(b => b.badgeId === id);
        const details = BADGE_DETAILS[id];

        // Default state if not in backend response (not earned)
        const isEarned = earnedBadge?.earned || false;
        const isMinted = earnedBadge?.nftMinted || false;

        // Auto-mint logic (simplified for UI): Membership badges and Early Adopter are usually auto-minted
        // But for this UI, we just check if it's mintable manually (paid ones usually)
        // Adjust logic as per original: Mintable if earned AND NOT mintable (wait, logic was inverted? check original)
        // Original: mintable: ![3001, 3002, 1001].includes(b.badgeId)
        const isManualMint = ![3001, 3002, 1001].includes(id);

        return {
            id,
            name: details.name,
            description: details.description,
            image: isEarned ? details.image : details.grey,
            earned: isEarned,
            minted: isMinted,
            canMint: isEarned && !isMinted && isManualMint
        };
    });

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <span className="text-xl">🏆</span>
                Badges
            </h3>

            <div className="relative">
                {isLoading && !membershipData && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                )}

                <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 transition-opacity duration-300 ${(isLoading && membershipData) ? 'opacity-40' : 'opacity-100'}`}>
                    {(badges.length > 0 ? badges : Array(5).fill(null)).map((badge, idx) => {
                        if (!badge) return (
                            <div key={`skeleton-${idx}`} className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        );

                        return (
                            <div
                                key={badge.id}
                                className={`group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${badge.earned
                                    ? badge.minted
                                        ? 'border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-900/10 hover:shadow-lg hover:border-emerald-500/40' // Minted
                                        : 'border-amber-400 bg-amber-50 dark:bg-amber-900/10 shadow-lg shadow-amber-500/10 scale-[1.02]' // Earned but not minted (Highlighted)
                                    : 'border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 opacity-70 hover:opacity-100' // Locked
                                    }`}
                            >
                                <div className={`relative w-24 h-24 mb-4 transition-all duration-500 ${!badge.earned ? 'opacity-70 grayscale contrast-75' : ''}`}>
                                    <Image
                                        src={badge.image}
                                        alt={badge.name}
                                        fill
                                        className="object-contain drop-shadow-md"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>

                                <div className="text-center mb-3 w-full">
                                    <div className="font-bold text-sm text-gray-900 dark:text-white mb-1 truncate px-1">{badge.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5em]">{badge.description}</div>
                                </div>

                                {/* Minting Actions */}
                                {badge.earned && (
                                    <div className="mt-auto pt-2">
                                        {badge.minted ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full uppercase tracking-wide">
                                                <CheckCircle size={10} /> Minted
                                            </span>
                                        ) : badge.canMint ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMint(badge.id);
                                                }}
                                                disabled={localMinting === badge.id || isLoading}
                                                className="text-[10px] font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-4 py-1.5 rounded-full transition-all shadow-blue-500/20 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {localMinting === badge.id ? 'Minting...' : 'Mint NFT'}
                                            </button>
                                        ) : (
                                            [1001, 3001, 3002].includes(badge.id) ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full uppercase tracking-wide">
                                                    <Loader2 size={10} className="animate-spin" /> Minting...
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-full uppercase tracking-wide">
                                                    Unlocked
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}

                                {/* Lock Overlay for unearned */}
                                {!badge.earned && (
                                    <div className="absolute top-2 right-2 text-gray-300 dark:text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isLoading && membershipData && (
                    <div className="absolute top-2 right-2 flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-[10px] font-bold animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        UPDATING...
                    </div>
                )}
            </div>

            <BadgePopup
                badgeIds={newBadgeIds.length > 0 ? newBadgeIds : (popupOpen ? popupIds : [])}
                onClose={() => {
                    setNewBadgeIds([]);
                    setPopupOpen(false);
                    setPopupIds([]);
                }}
                title={popupOpen ? "NFT Minted Successfully!" : undefined}
                message={popupOpen ? "Your achievement is now permanently verified on-chain." : undefined}
            />
        </div>
    );
}
