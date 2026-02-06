"use client";

import { useMembership } from "@/context/MembershipContext";
import { Check, X } from "lucide-react";

export default function PerksChecklist() {
  const { tier } = useMembership();
  const isMember = tier !== 'free';

  const perks = [
    { name: "Basic Strategy Access", free: true, pro: true },
    { name: "Weekly Newsletter", free: true, pro: true },
    { name: "Real time Strategy Alerts", free: false, pro: true },
    { name: "Real time Arbtirage Alerts", free: false, pro: true },
    { name: "Advanced Risk Analytics", free: false, pro: true },
    { name: "Priority Support", free: false, pro: true },
    { name: "Ad-free Experience", free: false, pro: true },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Membership Perks</h3>
        <div className="space-y-3">
            {perks.map((perk, index) => {
                const hasAccess = isMember ? perk.pro : perk.free;
                
                return (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <span className={`${hasAccess ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                            {perk.name}
                        </span>
                        {hasAccess ? (
                            <Check size={16} className="text-emerald-500" />
                        ) : (
                            <X size={16} className="text-gray-400" />
                        )}
                    </div>
                );
            })}
        </div>
        {!isMember && (
             <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 mb-2">Unlock full potential with Pro</p>
             </div>
        )}
    </div>
  );
}

