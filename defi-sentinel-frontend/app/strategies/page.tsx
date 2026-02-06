"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchStrategies, Strategy } from "@/lib/api";
import { Menu } from "lucide-react";
import StrategySidebar from "./components/StrategySidebar";
import StrategyDetail from "./components/StrategyDetail";
import { StrategiesLoadingSkeleton } from "./StrategiesLoadingSkeleton";

function StrategiesPageInner() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStrategyId, _setSelectedStrategyId] = useState<string | null>(null);

  const setSelectedStrategyId = (id: string | null) => {
    console.log("StrategiesPage: Setting selectedStrategyId to:", id);
    _setSelectedStrategyId(id);
  };

  // Auto-scroll to top when strategy changes
  useEffect(() => {
    if (selectedStrategyId) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedStrategyId]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const searchParams = useSearchParams();
  const strategyParam = searchParams.get("strategy");

  // Fetch strategies on mount
  useEffect(() => {
    async function loadStrategies() {
      try {
        setLoading(true);
        const data = await fetchStrategies();
        setStrategies(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load strategies:", err);
        setError("Failed to load strategies. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadStrategies();
  }, []);

  // Handle URL param and default selection
  useEffect(() => {
    if (loading || strategies.length === 0) return;

    if (strategyParam) {
      const exists = strategies.find((s) => s.id === strategyParam);
      if (exists) {
        setSelectedStrategyId(strategyParam);
        return;
      }
    }

    if (!selectedStrategyId) {
      // Logic: Highest yield in Low Risk section which is free
      const freeLowRisk = strategies
        .filter(s => !s.isPro && s.riskLevel === 'Low')
        .sort((a, b) => b.apy - a.apy);

      if (freeLowRisk.length > 0) {
        setSelectedStrategyId(freeLowRisk[0].id);
      } else {
        // Fallback: Highest yield free strategies (any risk)
        const freeStrategies = strategies
          .filter(s => !s.isPro)
          .sort((a, b) => b.apy - a.apy);

        if (freeStrategies.length > 0) {
          setSelectedStrategyId(freeStrategies[0].id);
        } else {
          // Fallback to first available
          setSelectedStrategyId(strategies[0].id);
        }
      }
    }
  }, [strategyParam, selectedStrategyId, strategies, loading]);

  const selectedStrategy = strategies.find((s) => s.id === selectedStrategyId) || null;

  if (loading) {
    return <StrategiesLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-center px-4">
        <div className="text-red-500 mb-2 font-bold">Error loading content</div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex-shrink-0 flex items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-[64px] z-30">
        <button
          className="p-2 -ml-2 text-gray-600 dark:text-gray-400"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <span className="ml-2 font-bold text-gray-900 dark:text-white">Strategies</span>
      </div>

      {/* Main Content Area (Two Column Layout) */}
      <div className="flex flex-1 relative container mx-auto max-w-full">
        {/* Left Sidebar */}
        <StrategySidebar
          strategies={strategies}
          selectedStrategyId={selectedStrategyId}
          onSelectStrategy={setSelectedStrategyId}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Right Detail Panel */}
        <main className="flex-1 min-w-0 bg-white dark:bg-gray-900 relative">
          <StrategyDetail
            strategy={selectedStrategy}
            onStrategyChange={setSelectedStrategyId}
            allStrategies={strategies}
          />
        </main>
      </div>
    </div>
  );
}

export default function StrategiesPage() {
  return (
    <Suspense fallback={<StrategiesLoadingSkeleton />}>
      <StrategiesPageInner />
    </Suspense>
  );
}