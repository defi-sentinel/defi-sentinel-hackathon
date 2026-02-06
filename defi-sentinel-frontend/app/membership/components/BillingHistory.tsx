"use client";

import { useAccount } from "wagmi";
import { useMembership } from "@/context/MembershipContext";
import { ExternalLink, Receipt } from "lucide-react";

export default function BillingHistory() {
  const { address } = useAccount();
  const { membershipData, isLoading } = useMembership();

  if (!address) return null;

  const history = membershipData?.billingHistory || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <Receipt size={20} className="text-gray-400" />
          Billing History
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-3">Plan</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Wallet</th>
              <th className="px-6 py-3 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white uppercase tracking-wider">{item.plan}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.price}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {item.date}
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                  {item.wallet.slice(0, 6)}...{item.wallet.slice(-4)}
                </td>
                <td className="px-6 py-4 text-right">
                  <a
                    href={`https://etherscan.io/tx/${item.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-500 hover:text-emerald-600 inline-flex items-center gap-1 text-xs font-medium"
                  >
                    View Tx <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500">
        Showing recent transactions for {address.slice(0, 6)}...{address.slice(-4)}
      </div>
    </div>
  );
}

