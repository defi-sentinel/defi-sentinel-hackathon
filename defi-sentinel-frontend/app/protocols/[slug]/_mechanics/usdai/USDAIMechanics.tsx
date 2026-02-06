'use client';

import React, { useState } from 'react';
import { ProtocolDetail } from '@/lib/types';
import { ProtocolFlow } from './ProtocolFlow';
import { YieldSimulator } from './YieldSimulator';
import { Info, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface USDAIMechanicsProps {
    protocol: ProtocolDetail;
}

const USDAIMechanics: React.FC<USDAIMechanicsProps> = ({ protocol }) => {
    const [activeTab, setActiveTab] = useState<'mechanics' | 'simulate'>('mechanics');

    return (
        <div className="flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8 w-full bg-[#0F172A] rounded-xl text-slate-200">

            {/* Navigation Tabs */}
            <div className="flex bg-slate-800/50 p-1 rounded-xl mb-12 border border-slate-700">
                <button
                    onClick={() => setActiveTab('mechanics')}
                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'mechanics'
                        ? 'bg-slate-700 text-white shadow-md'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                        }`}
                >
                    Visual Flow
                </button>
                <button
                    onClick={() => setActiveTab('simulate')}
                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'simulate'
                        ? 'bg-slate-700 text-white shadow-md'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                        }`}
                >
                    Yield Simulator
                </button>
            </div>

            {/* Main Content Area */}
            <main className="w-full">
                <AnimatePresence mode="wait">
                    {activeTab === 'mechanics' ? (
                        <motion.div
                            key="mechanics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProtocolFlow />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="simulate"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <YieldSimulator />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default USDAIMechanics;
