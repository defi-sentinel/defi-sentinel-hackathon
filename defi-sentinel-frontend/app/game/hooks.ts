import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { QuizLevel, QuizType } from "./data";
import { fetchGameProgress, updateGameProgress, type GameProgressResponse } from "@/lib/api";
import { useMembership } from "@/context/MembershipContext";

export type GameProgress = GameProgressResponse;

const DEFAULT_PROGRESS: GameProgress = {
  easy: { completed: false, score: 0, bestScore: 0, minted: false },
  medium: { completed: false, score: 0, bestScore: 0, minted: false },
  hard: { completed: false, score: 0, bestScore: 0, minted: false },
  risk: { completed: false, score: 0, minted: false },
};

export function useGameProgress() {
  const { address, isConnected } = useAccount();
  const { refreshMembership, membershipData } = useMembership();
  const [progress, setProgress] = useState<GameProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadProgress = useCallback(async () => {
    if (!isConnected || !address) {
      setProgress(DEFAULT_PROGRESS);
      setIsLoaded(true);
      return;
    }

    try {
      const data = await fetchGameProgress(address);
      setProgress(data);
    } catch (e) {
      console.error("Failed to load game progress from API", e);
      setProgress(DEFAULT_PROGRESS);
    } finally {
      setIsLoaded(true);
    }
  }, [address, isConnected]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Sync with membership updates (e.g. if minting happened in another component)
  useEffect(() => {
    if (membershipData && isLoaded) { // Only sync if we have loaded initial progress
      // Merge membership data (authoritative for badges) into progress
      setProgress(prev => {
        const newProgress = { ...prev };
        let changed = false;

        const badgeMap: Record<number, keyof GameProgress> = {
          2001: 'easy',
          2002: 'medium',
          2003: 'hard',
          2004: 'risk'
        };

        membershipData.badges.forEach(b => {
          const key = badgeMap[b.badgeId];
          if (key && b.nftMinted && !newProgress[key].minted) {
            newProgress[key] = { ...newProgress[key], minted: true };
            changed = true;
          }
        });

        return changed ? newProgress : prev;
      });
    }
  }, [membershipData, isLoaded]);

  const saveProgressToBackend = async (newProgress: GameProgress) => {
    if (!isConnected || !address) return;
    try {
      await updateGameProgress(address, newProgress);
      setProgress(newProgress);
      // Ensure membership dashboard (quizCompleted, riskAssessment, badges) stays in sync
      await refreshMembership();
    } catch (e) {
      console.error("Failed to save progress to backend", e);
    }
  };

  const markCompleted = async (id: QuizType, score: number, profile?: string) => {
    if (!isConnected || !address) return;

    const currentEntry = progress[id as keyof GameProgress];
    const currentBest = 'bestScore' in currentEntry ? (currentEntry.bestScore || 0) : 0;
    const newBest = Math.max(currentBest, score);

    const newProgress = {
      ...progress,
      [id]: {
        ...progress[id as keyof GameProgress],
        completed: true,
        score,
        bestScore: newBest,
        profile
      },
    };
    await saveProgressToBackend(newProgress);
  };

  const markMinted = async (id: QuizType) => {
    if (!isConnected || !address) return;

    const newProgress = {
      ...progress,
      [id]: { ...progress[id as keyof GameProgress], minted: true },
    };
    await saveProgressToBackend(newProgress);
  };

  // Derived stats
  const totalBadges = [progress.easy.completed, progress.medium.completed, progress.hard.completed, progress.risk.completed].filter(Boolean).length;

  let knowledgeLevel = "Novice";
  if (progress.hard.completed) knowledgeLevel = "Master";
  else if (progress.medium.completed) knowledgeLevel = "Explorer";
  else if (progress.easy.completed) knowledgeLevel = "Beginner";

  return {
    progress,
    isLoaded,
    markCompleted,
    markMinted,
    refreshProgress: loadProgress,
    stats: { totalBadges, knowledgeLevel }
  };
}
