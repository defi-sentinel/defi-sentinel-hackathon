"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Trophy, Lock, CheckCircle2, ArrowRight, Star, Clock, Gift, Award, Map, Wallet, Loader2 } from "lucide-react";
import { EASY_QUIZ, MEDIUM_QUIZ, HARD_QUIZ, RISK_ASSESSMENT } from "./data";
import { fetchGameProgress, fetchMembership, type GameProgressResponse } from "@/lib/api";
import { useMembership } from "@/context/MembershipContext";
import { useGameProgress } from "./hooks";
import BadgePopup from "@/app/membership/components/BadgePopup";

import { useAccount, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BadgeNFT } from "@/lib/abis";
import { CONTRACTS } from "@/lib/constants";
import { parseEther } from "viem";

import { BADGE_IDS } from "@/lib/constants";

export default function GameDashboard() {
  const { address, isConnected } = useAccount();
  const { progress, isLoaded, stats, markMinted, refreshProgress } = useGameProgress();
  const { refreshMembership } = useMembership(); // Add this
  const { writeContractAsync } = useWriteContract();
  const [mintingState, setMintingState] = useState<Record<string, string>>({});
  const [popupState, setPopupState] = useState<{ ids: number[], title?: string, message?: string } | null>(null);

  const handleMint = async (id: string) => {
    setMintingState(prev => ({ ...prev, [id]: "connecting" }));

    try {
      // Map string IDs to Badge IDs
      let badgeId = 0;
      if (id === 'easy') badgeId = BADGE_IDS.DEFI_NOVICE;
      if (id === 'medium') badgeId = BADGE_IDS.DEFI_INTERMEDIATE;
      if (id === 'hard') badgeId = BADGE_IDS.DEFI_HARD;
      if (id === 'risk') badgeId = BADGE_IDS.RISK_GUARDIAN;

      if (badgeId === 0) throw new Error("Invalid badge ID");

      // Assuming these are paid badges (0.001 ETH)
      const price = parseEther("0.001");

      const txHash = await writeContractAsync({
        address: CONTRACTS.BadgeNFT as `0x${string}`,
        abi: BadgeNFT.abi,
        functionName: 'mintBadge',
        args: [BigInt(badgeId)],
        value: price,
      });

      setMintingState(prev => ({ ...prev, [id]: "signing" }));

      // Polling Logic: Wait for backend to see the event and update gameProgress
      const pollInterval = 3000;
      const maxAttempts = 20; // 60s
      let attempts = 0;
      let isMintedConfirmed = false;

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, pollInterval));
        attempts++;

        try {
          // Check Membership data as it is the source of truth for Badges
          const memData = await fetchMembership(address!);
          const badgeEntry = memData.badges.find(b => b.badgeId === badgeId);

          if (badgeEntry && badgeEntry.nftMinted) {
            isMintedConfirmed = true;
            break;
          }

          // Fallback: Check game progress directly
          const currentData = await fetchGameProgress(address!);
          const currentEntry = currentData[id as keyof GameProgressResponse];

          if (currentEntry && currentEntry.minted) {
            isMintedConfirmed = true;
            break;
          }
        } catch (err) {
          // Silently continue polling
        }
      }

      if (isMintedConfirmed) {
        // Final sync: Refresh both contexts
        await refreshMembership();
        await refreshProgress();

        setMintingState(prev => ({ ...prev, [id]: "idle" }));
        setPopupState({
          ids: [badgeId],
          title: "NFT Minted Successfully!",
          message: "Your achievement is now permanently verified on-chain."
        });
      } else {
        // Timeout - still verify one last time
        setMintingState(prev => ({ ...prev, [id]: "idle" }));
        await refreshMembership();
        await refreshProgress();
      }

    } catch (error) {
      console.error("Mint failed:", error);
      setMintingState(prev => ({ ...prev, [id]: "idle" }));
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const items = [EASY_QUIZ, MEDIUM_QUIZ, HARD_QUIZ, RISK_ASSESSMENT];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
              Your DeFi Journey
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Level up your knowledge, unlock badges, and prove your on-chain intelligence.
          </p>

          {!isConnected && (
            <div className="mt-8 p-8 bg-amber-50 dark:bg-amber-900/10 border-2 border-dashed border-amber-200 dark:border-amber-800 rounded-3xl max-w-lg mx-auto">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wallet Required</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your wallet to track your progress, earn badges, and mint exclusive NFTs.
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          )}

          {/* Progress Summary */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <BrainIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase font-bold">Level</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.knowledgeLevel}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase font-bold">Badges</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalBadges} / 4</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 mb-16 relative">
            {/* Journey Line (Desktop) */}
            <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gray-200 dark:bg-gray-800 hidden md:block -z-10"></div>

            {items.map((item, index) => {
              const isRisk = item.id === "risk";
              const currentProgress = progress[item.id];
              const isCompleted = currentProgress.completed;
              const isLocked = !isRisk && (
                (item.id === "medium" && !progress.easy.completed) ||
                (item.id === "hard" && !progress.medium.completed)
              );

              const prevQuizTitle = item.id === "medium" ? EASY_QUIZ.title : (item.id === "hard" ? MEDIUM_QUIZ.title : "");

              return (
                <div
                  key={item.id}
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
                  className={`animate-in fade-in slide-in-from-bottom-12 duration-700 relative group rounded-3xl border transition-all flex flex-col md:flex-row overflow-hidden ${isLocked
                    ? "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-80"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-2 z-10"
                    }`}
                >
                  {/* Reward Preview Badge (Corner Hook) */}
                  {!isLocked && !isCompleted && !isRisk && (
                    <div className="absolute top-0 right-0 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 flex items-center gap-1">
                      <Gift className="w-3 h-3" /> Reward Inside
                    </div>
                  )}

                  {/* Cover Image */}
                  <div className="relative w-full md:w-72 h-48 md:h-auto bg-gray-100 dark:bg-gray-900 overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isLocked ? "grayscale" : ""}`}
                    />
                    {/* Status Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                    <div className="absolute bottom-4 left-4 z-10 md:hidden text-white">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-full">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white hidden md:block">
                            {isLocked ? "🔒 Boss Level" : item.title}
                          </h3>
                          {/* Tags */}
                          {isCompleted ? (
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> CLEARED
                            </span>
                          ) : isLocked ? (
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-bold rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3" /> LOCKED
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full flex items-center gap-1">
                              AVAILABLE
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed line-clamp-2">
                          {isLocked ? `Prove your skills in ${prevQuizTitle} to unlock this challenge.` : item.description}
                        </p>

                        {/* Stats / Info */}
                        <div className="min-h-[3.5rem] mb-2 flex items-center">
                          {!isLocked ? (
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl w-full">
                              {/* Time */}
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{item.estimatedTime}</span>
                              </div>
                              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

                              {/* Questions */}
                              <div className="flex items-center gap-2">
                                <Map className="w-4 h-4 text-gray-400" />
                                <span>{item.type === "quiz" ? `${item.questionCount} Questions` : "6 Questions"}</span>
                              </div>
                              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

                              {/* Rewards */}
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-500" />
                                <span className="text-gray-900 dark:text-white font-medium line-clamp-1">
                                  {isCompleted ? "Badge Earned" : item.rewards[0]}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 text-sm text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl w-full border border-dashed border-gray-200 dark:border-gray-700">
                              <Lock className="w-4 h-4" />
                              <span>Details hidden until unlocked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-auto">
                      {/* Left Side: Score or Status */}
                      <div>
                        {isCompleted && item.type === "quiz" && (
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(((currentProgress as any).bestScore / item.questionCount) * 5) ? "fill-current" : "text-gray-300 dark:text-gray-600"}`} />
                              ))}
                            </div>
                            <span className="text-sm">Best Score: {(currentProgress as any).bestScore}/{item.questionCount}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Side: Action Button */}
                      <div className="flex flex-col items-end w-full md:w-auto">
                        {isLocked ? (
                          <div className="w-full md:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed text-sm">
                            <Lock className="w-4 h-4" /> Locked Level
                          </div>
                        ) : isCompleted ? (
                          <div className="flex flex-col gap-3 w-full md:w-auto">
                            {!currentProgress.minted ? (
                              <button
                                onClick={() => handleMint(item.id)}
                                disabled={!!mintingState[item.id]}
                                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                {mintingState[item.id] === "connecting" ? (
                                  <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                                ) : mintingState[item.id] === "signing" ? (
                                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing...</>
                                ) : (
                                  <><Wallet className="w-4 h-4" /> Mint NFT</>
                                )}
                              </button>
                            ) : (
                              <div className="w-full md:w-auto px-8 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 className="w-4 h-4" /> NFT Minted
                              </div>
                            )}

                            <Link
                              href={`/game/${item.id}`}
                              className="w-full md:w-auto px-8 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold flex items-center justify-center gap-1 transition-colors"
                            >
                              {item.type === "assessment" ? "View Profile" : "View Results"} <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        ) : (
                          <Link
                            href={`/game/${item.id}`}
                            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-0.5"
                          >
                            {item.type === "assessment" ? "Discover Personality" : "🚀 Start Challenge"} <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {popupState && (
          <BadgePopup
            badgeIds={popupState.ids}
            title={popupState.title}
            message={popupState.message}
            onClose={() => setPopupState(null)}
          />
        )}
      </div>
    </div>
  );
}

function BrainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  )
}
