"use client";

import { useDisconnect } from 'wagmi';
import { Trash2 } from 'lucide-react';

export default function DebugTools() {
  const { disconnect } = useDisconnect();

  const handleClearCache = () => {
    if (confirm("Are you sure you want to disconnect and clear all local storage? This will reset your wallet connection and membership data.")) {
      // 1. Disconnect Wagmi
      disconnect();

      // 2. Clear Local Storage
      localStorage.clear();

      // 3. Reload page to ensure clean state
      window.location.reload();
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      <button
        onClick={handleClearCache}
        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all flex items-center justify-center group"
        title="Reset All Data (Dev Only)"
      >
        <Trash2 size={20} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap text-sm font-bold">
          Reset State
        </span>
      </button>
    </div>
  );
}

