"use client";

import { useMembership } from "@/context/MembershipContext";
import { useState } from "react";
import { Mail, ShieldAlert, TrendingUp, Send } from "lucide-react";

export default function SettingsPreferences({ emailVerified }: { emailVerified: boolean }) {
  const { tier } = useMembership();
  const isMember = tier !== 'free';

  const [settings, setSettings] = useState({
    newsletter: true,
    riskAlerts: false,
    arbitrageAlerts: false
  });

  const [alertMethods, setAlertMethods] = useState({
    risk: 'email' as 'email' | 'telegram',
    arbitrage: 'email' as 'email' | 'telegram'
  });

  const toggle = (key: keyof typeof settings) => {
    if (!isMember && (key === 'riskAlerts' || key === 'arbitrageAlerts')) return; // Gate pro features
    
    // Check email verification for alerts
    if ((key === 'riskAlerts' || key === 'arbitrageAlerts') && !emailVerified) {
        alert("Please verify your email address in the Profile section to enable alerts.");
        return;
    }

    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setMethod = (alertType: 'risk' | 'arbitrage', method: 'email' | 'telegram') => {
      setAlertMethods(prev => ({ ...prev, [alertType]: method }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Settings & Preferences</h3>
        
        <div className="space-y-6">
            {/* Newsletter */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                        <Mail size={20} />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">Weekly Newsletter</div>
                        <div className="text-xs text-gray-500">Receive weekly DeFi updates</div>
                    </div>
                </div>
                <button 
                    onClick={() => toggle('newsletter')}
                    className={`w-11 h-6 flex items-center rounded-full transition-colors ${settings.newsletter ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${settings.newsletter ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </button>
            </div>

            {/* Risk Alerts */}
            <div className={`space-y-3 ${!isMember ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900 dark:text-white">Risk Alerts</div>
                                {!isMember && <span className="text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded uppercase">Pro</span>}
                            </div>
                            <div className="text-xs text-gray-500">Real-time risk alerts for protocols</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => toggle('riskAlerts')}
                        disabled={!isMember}
                        className={`w-11 h-6 flex items-center rounded-full transition-colors ${settings.riskAlerts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'} ${!isMember ? 'cursor-not-allowed' : ''}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${settings.riskAlerts ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </button>
                </div>
                
                {/* Delivery Method Selection */}
                {settings.riskAlerts && isMember && (
                    <div className="ml-12 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <button 
                            onClick={() => setMethod('risk', 'email')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                                alertMethods.risk === 'email' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' 
                                : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <Mail size={12} /> Email
                        </button>
                        <button 
                             onClick={() => setMethod('risk', 'telegram')}
                             className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                                alertMethods.risk === 'telegram' 
                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' 
                                : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <Send size={12} /> Telegram Bot
                        </button>
                    </div>
                )}
            </div>

            {/* Arbitrage Alerts */}
            <div className={`space-y-3 ${!isMember ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="font-medium text-gray-900 dark:text-white">Arbitrage Alerts</div>
                                {!isMember && <span className="text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded uppercase">Pro</span>}
                            </div>
                            <div className="text-xs text-gray-500">Real-time arbitrage opportunities</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => toggle('arbitrageAlerts')}
                        disabled={!isMember}
                        className={`w-11 h-6 flex items-center rounded-full transition-colors ${settings.arbitrageAlerts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'} ${!isMember ? 'cursor-not-allowed' : ''}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${settings.arbitrageAlerts ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </button>
                </div>

                 {/* Delivery Method Selection */}
                 {settings.arbitrageAlerts && isMember && (
                    <div className="ml-12 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <button 
                            onClick={() => setMethod('arbitrage', 'email')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                                alertMethods.arbitrage === 'email' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' 
                                : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <Mail size={12} /> Email
                        </button>
                        <button 
                             onClick={() => setMethod('arbitrage', 'telegram')}
                             className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                                alertMethods.arbitrage === 'telegram' 
                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' 
                                : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <Send size={12} /> Telegram Bot
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
