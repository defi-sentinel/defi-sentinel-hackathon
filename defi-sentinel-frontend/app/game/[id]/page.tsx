"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ChevronLeft,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  Brain,
  Wallet,
  Award,
  Target,
  Lock,
  Star,
  ArrowRight
} from "lucide-react";
import {
  EASY_QUIZ,
  MEDIUM_QUIZ,
  HARD_QUIZ,
  RISK_ASSESSMENT,
  QuizConfig,
  RiskConfig,
  QuizLevel,
  QuizType
} from "../data";
import { useGameProgress } from "../hooks";
import { fetchGameProgress, fetchMembership, type GameProgressResponse } from "@/lib/api";
import { useMembership } from "@/context/MembershipContext";

import { useAccount, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACTS } from "@/lib/constants";
import { BadgeNFT } from "@/lib/abis";
import BadgePopup from "@/app/membership/components/BadgePopup";
import { BADGE_IDS } from "@/lib/constants";

const getBadgeId = (quizId: string): number => {
  switch (quizId) {
    case "easy": return BADGE_IDS.DEFI_NOVICE;
    case "medium": return BADGE_IDS.DEFI_INTERMEDIATE;
    case "hard": return BADGE_IDS.DEFI_HARD;
    case "risk": return BADGE_IDS.RISK_GUARDIAN;
    default: return 0;
  }
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { progress, isLoaded, markCompleted, markMinted } = useGameProgress();
  const { writeContractAsync } = useWriteContract();

  const id = params?.id as string;

  // Find config
  const quizConfig = [EASY_QUIZ, MEDIUM_QUIZ, HARD_QUIZ].find(q => q.id === id);
  const riskConfig = id === "risk" ? RISK_ASSESSMENT : null;
  const config = quizConfig || riskConfig;

  // --- State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // Option ID or Risk Score
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0); // For quiz
  const [riskScores, setRiskScores] = useState<number[]>([]); // For risk
  const [isFinished, setIsFinished] = useState(false);
  const [mintStatus, setMintStatus] = useState<"idle" | "connecting" | "signing" | "minted">("idle");
  const hasAutoShownResults = useRef(false);
  const completedJustNowRef = useRef(false);
  const [popupState, setPopupState] = useState<{ ids: number[], title?: string, message?: string } | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Redirect if invalid or locked ---
  useEffect(() => {
    if (!isLoaded) return;

    if (!config) {
      router.push("/game");
      return;
    }

    // Check locks
    if (config.id === "medium" && !progress.easy.completed) {
      router.push("/game");
    }
    if (config.id === "hard" && !progress.medium.completed) {
      router.push("/game");
    }

    // Auto-show results if already completed
    const currentProgress = progress[config.id as QuizType];
    if (currentProgress?.completed && !hasAutoShownResults.current) {
      hasAutoShownResults.current = true;
      setIsFinished(true);
      if (config.type === "quiz") {
        setScore((currentProgress as any).bestScore || 0);
      } else {
        setRiskScores([currentProgress.score]);
      }
    }
  }, [config, isLoaded, progress, router]);

  // Confetti Effect
  useEffect(() => {
    if (isFinished && config && completedJustNowRef.current) {
      const passed = config.type === "assessment" || score >= (config as QuizConfig).passThreshold;
      if (passed) {
        // Only show once per fresh completion
        completedJustNowRef.current = false;
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
        return () => clearInterval(interval);
      }
    }
  }, [isFinished, score, config]);

  if (!isLoaded || !config) return null;

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-8">
          <Wallet className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-3xl font-black mb-4">Connection Required</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md">
          Please connect your wallet to start this challenge and save your progress on-chain.
        </p>
        <ConnectButton />
        <Link href="/game" className="mt-8 text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Prevent flash of quiz content when auto-redirecting to results
  // If completed and not yet showing results (and hasn't auto-shown this session), show nothing/loader
  const currentProgressVal = progress[config.id as QuizType];
  if (currentProgressVal?.completed && !isFinished && !hasAutoShownResults.current) {
    return <div className="min-h-screen bg-white dark:bg-gray-900" />;
  }

  // --- Logic ---

  const currentQuestion = config.questions[currentQuestionIndex];
  const isRisk = config.type === "assessment";

  const handleAnswer = (optionId: string, optionScore?: number) => {
    if (isRisk) {
      const newScores = [...riskScores, optionScore || 0];
      setRiskScores(newScores);

      if (currentQuestionIndex < config.questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(i => i + 1);
        }, 200);
      } else {
        setIsFinished(true);
        const totalScore = newScores.reduce((a, b) => a + b, 0);
        const profile = (config as RiskConfig).profiles.find(p => totalScore >= p.min && totalScore <= p.max) || (config as RiskConfig).profiles[1];
        completedJustNowRef.current = true;
        markCompleted("risk", totalScore, profile.label);
        // Badge popup will show after minting, not here
      }
    } else {
      // Quiz Logic
      if (showExplanation) return;
      setSelectedAnswer(optionId);
      setShowExplanation(true);
      if (optionId === (currentQuestion as any).correctAnswer) {
        setScore(s => s + 1);
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentQuestionIndex < config.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setIsFinished(true);
      if (score >= (config as QuizConfig).passThreshold) {
        completedJustNowRef.current = true;
        markCompleted(config.id as QuizType, score);
        // Badge popup will show after minting, not here
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setRiskScores([]);
    setIsFinished(false);
    setMintStatus("idle");
  };

  // Wagmi hooks manually moved to top to follow Rules of Hooks
  // const { writeContractAsync } = useWriteContract(); 


  const { refreshMembership } = useMembership(); // Add this line

  const handleMint = async () => {
    if (!config || !address) return;

    setMintStatus("connecting");
    try {
      // Map quiz type to Badge ID
      let badgeId = 0;
      let price = 0n; // default free

      // See lib/constants.ts for IDs
      badgeId = getBadgeId(config.id);

      switch (config.id) {
        case "easy":
          price = 1000000000000000n; // 0.001 ETH
          break;
        case "medium":
          price = 1000000000000000n;
          break;
        case "hard":
          price = 1000000000000000n;
          break;
        case "risk":
          price = 1000000000000000n;
          break;
      }

      if (badgeId === 0) {
        console.error("Invalid badge configuration");
        setMintStatus("idle");
        return;
      }

      setMintStatus("signing");

      const txHash = await writeContractAsync({
        address: CONTRACTS.BadgeNFT as `0x${string}`,
        abi: BadgeNFT.abi,
        functionName: 'mintBadge',
        args: [BigInt(badgeId)],
        value: price,
      });

      // Polling Logic
      setMintStatus("signing");
      const pollInterval = 3000;
      const maxAttempts = 20; // 60s
      let attempts = 0;
      let isMintedConfirmed = false;

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, pollInterval));
        attempts++;

        try {
          // Check Membership
          const memData = await fetchMembership(address!);
          const badgeEntry = memData.badges.find(b => b.badgeId === badgeId);
          if (badgeEntry && badgeEntry.nftMinted) {
            isMintedConfirmed = true;
            break;
          }

          // Check Game Progress
          const currentData = await fetchGameProgress(address!);
          const currentEntry = currentData[config.id as keyof GameProgressResponse];
          if (currentEntry && currentEntry.minted) {
            isMintedConfirmed = true;
            break;
          }
        } catch (e) {
          // Silently continue polling
        }
      }

      if (isMintedConfirmed) {
        await refreshMembership();
        await markMinted(config.id as QuizType);

        setMintStatus("minted");
        const bId = getBadgeId(config.id);
        if (bId) setPopupState({ ids: [bId], title: "NFT Minted!", message: "Your badge is now permanently on-chain." });
      } else {
        // Timeout
        setMintStatus("idle");
        await refreshMembership();
        await markMinted(config.id as QuizType);
      }

    } catch (error) {
      console.error("Minting failed:", error);
      setMintStatus("idle");
    }
  };

  // --- Render Results ---
  if (isFinished) {
    if (isRisk) {
      const totalScore = riskScores.reduce((a, b) => a + b, 0);
      const profile = (config as RiskConfig).profiles.find(p => totalScore >= p.min && totalScore <= p.max) || (config as RiskConfig).profiles[1];
      const isMinted = progress.risk.minted || mintStatus === "minted";

      return (
        <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
          <div className="w-32 h-32 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-amber-500/20">
            <Target className="w-16 h-16 text-amber-500" />
          </div>
          <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4">Personality Revealed</h2>
          <p className="text-gray-500 mb-10 text-xl">We&apos;ve analyzed your DeFi style</p>

          <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl mb-10 border border-gray-200 dark:border-gray-700 max-w-lg w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-4 font-bold">Your Risk Archetype</p>
            <h3 className={`text-5xl font-black mb-6 ${profile.color}`}>{profile.label}</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xl">
              {profile.description}
            </p>
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-between text-base text-gray-500">
              <span>Compatibility Score</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white text-lg">{Math.round((totalScore / 18) * 100)}%</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            {isMinted ? (
              <button disabled className="w-full py-5 bg-emerald-500/10 text-emerald-600 rounded-xl font-bold flex items-center justify-center gap-2 border border-emerald-500/20 cursor-not-allowed text-lg">
                <CheckCircle2 className="w-6 h-6" /> Identity Minted
              </button>
            ) : (
              <button
                onClick={handleMint}
                disabled={mintStatus !== "idle"}
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-500/25 text-lg"
              >
                {mintStatus === "idle" && <><Wallet className="w-6 h-6" /> Mint Your Identity NFT</>}
                {mintStatus === "connecting" && "Connecting Wallet..."}
                {mintStatus === "signing" && "Signing..."}
              </button>
            )}

            <Link
              href="/game"
              className="w-full py-4 text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Journey
            </Link>
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
      );
    } else {
      // Quiz Result
      const quizConf = config as QuizConfig;
      const hasPassed = score >= quizConf.passThreshold;
      const isMinted = progress[config.id as QuizType].minted || mintStatus === "minted";

      const nextLevelMap: Record<string, string> = {
        "easy": "medium",
        "medium": "hard",
        "hard": ""
      };
      const nextLevelId = nextLevelMap[config.id];

      return (
        <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
          {hasPassed ? (
            <>
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-yellow-500/20 relative">
                <Trophy className="w-16 h-16 text-yellow-500" />
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-3 rounded-full shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>

              <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">Challenge Cleared!</h2>
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-10">
                You proved your skills in <span className="font-bold text-gray-900 dark:text-white">{config.title}</span>
              </p>

              <div className="grid grid-cols-2 gap-6 w-full max-w-lg mb-10">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 uppercase font-bold mb-2">Score</p>
                  <p className="text-4xl font-black text-gray-900 dark:text-white">{score} <span className="text-lg text-gray-400 font-normal">/ {quizConf.questionCount}</span></p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 uppercase font-bold mb-2">Rating</p>
                  <div className="flex justify-center text-emerald-500 pt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-6 h-6 ${i < Math.round((score / quizConf.questionCount) * 5) ? "fill-current" : "text-gray-300 dark:text-gray-600"}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl mb-10 border border-emerald-100 dark:border-emerald-800/50 max-w-lg w-full">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-3 rounded-xl ${quizConf.badgeColor}`}>
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Rewards Unlocked</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{quizConf.badge} + Progress</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-sm">
                <button
                  onClick={handleRetry}
                  className="w-full py-5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md text-gray-500 dark:text-gray-400 text-lg"
                >
                  <RefreshCcw className="w-5 h-5" /> Retake Challenge
                </button>

                {isMinted ? (
                  <button disabled className="w-full py-5 bg-emerald-500/10 text-emerald-600 rounded-xl font-bold flex items-center justify-center gap-2 border border-emerald-500/20 cursor-not-allowed text-lg">
                    <CheckCircle2 className="w-6 h-6" /> NFT Minted
                  </button>
                ) : (
                  <button
                    onClick={handleMint}
                    disabled={mintStatus !== "idle"}
                    className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] text-lg"
                  >
                    {mintStatus === "idle" && <><Wallet className="w-6 h-6" /> Mint Completion NFT</>}
                    {mintStatus === "connecting" && "Connecting..."}
                    {mintStatus === "signing" && "Signing..."}
                  </button>
                )}

                <Link
                  href="/game"
                  className="w-full py-4 text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Mission Failed</h2>
              <p className="text-2xl text-gray-600 dark:text-gray-300 mb-10">
                Score: <span className="font-bold text-red-500">{score}</span> / {quizConf.questionCount}
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-3xl mb-10 max-w-lg w-full border border-red-100 dark:border-red-900/30">
                <p className="text-red-600 dark:text-red-400 text-lg font-medium">
                  Review the incorrect answers and try again to unlock the next level.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full max-w-sm">
                <button
                  onClick={handleRetry}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/25 text-lg"
                >
                  <RefreshCcw className="w-6 h-6" /> Retry Challenge
                </button>
                <Link
                  href="/game"
                  className="w-full py-4 text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                </Link>
              </div>
            </>
          )}
          {popupState && (
            <BadgePopup
              badgeIds={popupState.ids}
              title={popupState.title}
              message={popupState.message}
              onClose={() => setPopupState(null)}
            />
          )}
        </div>
      );
    }
  }

  // --- Render Question ---

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen max-w-3xl">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px) rotate(-2deg); }
          30% { transform: translateX(5px) rotate(2deg); }
          45% { transform: translateX(-4px) rotate(-1deg); }
          60% { transform: translateX(3px) rotate(1deg); }
          75% { transform: translateX(-2px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out both;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/game" className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
          <ChevronLeft className="w-5 h-5" /> Exit
        </Link>
        <div className="text-sm font-bold text-gray-400">
          {config.type === "quiz" ? "QUIZ CHALLENGE" : "PERSONALITY TEST"}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / config.questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-6 md:p-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {config.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                  {currentQuestionIndex + 1} / {config.questions.length}
                </span>
                <span>Select the best answer</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${config.badgeColor}`}>
              {config.id.toUpperCase()}
            </div>
          </div>

          <div key={currentQuestionIndex} className="animate-in slide-in-from-right-8 fade-in duration-500">
            <h3 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 mb-8 leading-relaxed">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => {
                // Logic difference for Quiz vs Risk
                if (isRisk) {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id, (option as any).score)}
                      className="w-full text-left p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all active:scale-[0.98] duration-200 flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 group-hover:bg-amber-500 group-hover:text-white transition-colors font-bold shrink-0">
                        {option.id}
                      </div>
                      <span className="text-lg text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium">{option.text}</span>
                    </button>
                  );
                } else {
                  // Quiz Options
                  const isSelected = selectedAnswer === option.id;
                  const isCorrect = option.id === (currentQuestion as any).correctAnswer;
                  const showResult = showExplanation;

                  let buttonStyle = "border-gray-100 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10";
                  let iconColor = "text-emerald-600";

                  if (showResult) {
                    if (isSelected && isCorrect) {
                      buttonStyle = "border-emerald-600 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]";
                      iconColor = "text-white";
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = "border-red-600 bg-red-500 text-white shadow-lg shadow-red-500/30 animate-shake";
                      iconColor = "text-white";
                    } else if (!isSelected && isCorrect) {
                      buttonStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300";
                    } else {
                      buttonStyle = "opacity-50 border-gray-100 dark:border-gray-700";
                    }
                  } else if (isSelected) {
                    buttonStyle = "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={showExplanation}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all active:scale-[0.98] duration-200 flex justify-between items-center ${buttonStyle}`}
                    >
                      <span className="text-lg font-medium">{option.text}</span>
                      {showResult && isSelected && (
                        isCorrect ? <CheckCircle2 className={`w-6 h-6 animate-in zoom-in duration-300 ${iconColor}`} /> : <XCircle className={`w-6 h-6 animate-in zoom-in duration-300 ${iconColor}`} />
                      )}
                    </button>
                  );
                }
              })}
            </div>
          </div>

          {!isRisk && showExplanation && (
            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl animate-in slide-in-from-top-2">
              <div className="flex gap-3 text-blue-800 dark:text-blue-300">
                <Brain className="w-6 h-6 shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Explanation</p>
                  <p className="text-sm leading-relaxed">{(currentQuestion as any).explanation}</p>
                </div>
              </div>
            </div>
          )}

          {!isRisk && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all ${selectedAnswer
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {currentQuestionIndex < config.questions.length - 1 ? "Next Question" : "Finish Challenge"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
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
  );
}
