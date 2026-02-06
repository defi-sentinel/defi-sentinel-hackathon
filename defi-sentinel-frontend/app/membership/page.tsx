"use client";

import { useMembership } from "@/context/MembershipContext";
import { useAccount } from "wagmi";
import { useState, useEffect, useRef } from "react";
import SubscriptionModal from "@/app/components/SubscriptionModal";
import StatusCard from "./components/StatusCard";
import BillingHistory from "./components/BillingHistory";
import IdentityReputation from "./components/IdentityReputation";
import BadgeSystem from "./components/BadgeSystem";
import Recommendations from "./components/Recommendations";
import PerksChecklist from "./components/PerksChecklist";
import SettingsPreferences from "./components/SettingsPreferences";
import BadgePopup from "./components/BadgePopup";

export default function MembershipPage() {
  const { isConnected } = useAccount();
  const { membershipData } = useMembership();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<number[]>([]);

  // Use a ref to keep track of latest data to avoid closure staleness issues in callbacks
  // Track previous badges to diff
  const prevBadgesRef = useRef<Set<number>>(new Set());
  const isFirstLoad = useRef(true);

  const membershipDataRef = useRef(membershipData);
  useEffect(() => {
    membershipDataRef.current = membershipData;

    // Initialize prevBadges on first load
    if (membershipData && isFirstLoad.current) {
      const ids = new Set(membershipData.badges.filter(b => b.earned).map(b => b.badgeId));
      prevBadgesRef.current = ids;
      isFirstLoad.current = false;
    }
  }, [membershipData]);

  const handleSubscriptionSuccess = () => {
    if (!membershipDataRef.current) return;

    // Check for "Pro" and "Elite" and "Early Adopter"
    const relevantIds = [1001, 3001, 3002];
    const currentEarned = membershipDataRef.current.badges
      .filter(b => relevantIds.includes(b.badgeId) && b.earned)
      .map(b => b.badgeId);

    // Identify ONLY the ones that were NOT present before
    const brandNew = currentEarned.filter(id => !prevBadgesRef.current.has(id));

    if (brandNew.length > 0) {
      // Update our "known" badges so we don't show them again later
      brandNew.forEach(id => prevBadgesRef.current.add(id));

      // Wait a moment for modal to close
      setTimeout(() => setNewlyEarnedBadges(brandNew), 500);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Membership Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Please connect your wallet to view your membership status and perks.</p>
        {/* Wallet connect button is usually in the header, but we can add a prompt here */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl max-w-md mx-auto border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold text-emerald-500">Waiting for connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column (Main) */}
          <div className="flex-1 space-y-8">
            {/* 10.2 Membership Overview */}
            <StatusCard onUpgrade={() => setIsUpgradeModalOpen(true)} />

            {/* 10.5 Badge System */}
            <BadgeSystem />

            {/* 10.7 Personalized Recommendations */}
            <Recommendations onUpgrade={() => setIsUpgradeModalOpen(true)} />

            {/* 10.3 Billing History */}
            <BillingHistory />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full md:w-80 space-y-8">
            {/* 10.4 Identity & Reputation */}
            <IdentityReputation
              onEmailVerified={(verified) => {
                // In a real app, this state would be lifted or managed via context
                // For this demo, we can just force re-render or use event bus if needed
                // But since IdentityReputation and SettingsPreferences are siblings, 
                // we need to lift state to page.
                setEmailVerified(verified);
              }}
            />

            {/* 10.8 Perks Summary */}
            <PerksChecklist />

            {/* 10.9 Settings */}
            <SettingsPreferences emailVerified={emailVerified} />
          </div>
        </div>

      </div>

      <SubscriptionModal
        isOpen={isUpgradeModalOpen}
        onClose={() => {
          setIsUpgradeModalOpen(false);
          // We can check for success here if we tracked it, but simple way:
          // if we have data and we just closed modal, check badges.
          // Ideally SubscriptionModal returns "success" status.
          // Let's assume we refresh data on success inside modal.
          handleSubscriptionSuccess();
        }}
      />

      <BadgePopup
        badgeIds={newlyEarnedBadges}
        onClose={() => setNewlyEarnedBadges([])}
        title="Membership Upgraded!"
        buttonText="Awesome!"
      />
    </div>
  );
}

