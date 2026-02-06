
import React from 'react';
import { RiskAnalysisResult } from '../types';
import { ShieldAlert, Coins } from 'lucide-react';
import { getRiskColor, getRiskColorClass } from '../utils';

interface BottleneckSectionProps {
    result: RiskAnalysisResult;
}

export const BottleneckSection: React.FC<BottleneckSectionProps> = ({ result }) => {
    return (
        <div className="flex flex-col gap-2 h-full">
            {/* Protocol Bottleneck - Compact */}
            <div
                className="p-3 rounded-lg bg-gray-900 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded text-gray-400">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-bold">Primary Protocol Exposure</div>
                        <div className="text-base font-semibold text-gray-200">{result.minProtocol.name}</div>
                    </div>
                </div>
                <div className={`text-xl font-bold font-mono ${getRiskColorClass(result.minProtocol.score).split(' ')[0]}`}>
                    {result.minProtocol.score}
                </div>
            </div>

            {/* Asset Bottleneck - Compact */}
            <div
                className="p-3 rounded-lg bg-gray-900 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded text-gray-400">
                        <Coins className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-bold">Primary Asset Exposure</div>
                        <div className="text-base font-semibold text-gray-200">{result.minAsset.name}</div>
                    </div>
                </div>
                <div className={`text-xl font-bold font-mono ${getRiskColorClass(result.minAsset.score).split(' ')[0]}`}>
                    {result.minAsset.score}
                </div>
            </div>

            <div className="mt-auto text-[10px] text-gray-600 text-center italic pt-1">
                Limits base score potential
            </div>
        </div>
    );
};
