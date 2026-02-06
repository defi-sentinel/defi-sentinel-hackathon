
import React, { useState, useEffect } from 'react';
import { ProtocolStep, PROTOCOL_STEPS } from './babylonConstants';
import { Bot, ChevronRight, RefreshCw } from 'lucide-react';

interface InfoPanelProps {
    step: ProtocolStep;
    setStep: (step: ProtocolStep) => void;
}

const BabylonInfoPanel: React.FC<InfoPanelProps> = ({ step, setStep }) => {
    const info = PROTOCOL_STEPS[step];
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    // Reset AI response when step changes
    useEffect(() => {
        setAiResponse(null);
    }, [step]);

    const handleAiAsk = async () => {
        setAiLoading(true);
        // SIMULATED AI RESPONSE
        setTimeout(() => {
            setAiResponse(`In simple terms: ${info.description} This ensures your Bitcoin remains safe while earning rewards.`);
            setAiLoading(false);
        }, 1500);
    };

    const nextStep = () => {
        if (step < ProtocolStep.UNBONDING) {
            setStep(step + 1);
        } else {
            setStep(ProtocolStep.IDLE);
        }
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col h-full shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-500 text-black text-xs flex items-center justify-center font-bold">
                            {step + 1}
                        </span>
                        {info.title}
                    </h2>
                    <p className="text-slate-400 text-sm">Step {step + 1} of 5</p>
                </div>
            </div>

            <div className="mb-6 flex-grow">
                <p className="text-slate-200 text-lg leading-relaxed mb-4">
                    {info.description}
                </p>

                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 mb-4">
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Under the Hood</p>
                    <p className="text-slate-300 text-sm font-light italic">
                        {info.technicalNote}
                    </p>
                </div>


            </div>

            {/* Controls */}
            <div className="mt-auto">
                <button
                    onClick={nextStep}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-orange-900/20"
                >
                    {step === ProtocolStep.UNBONDING ? (
                        <>
                            <RefreshCw className="w-5 h-5" />
                            Restart Demo
                        </>
                    ) : (
                        <>
                            Next Step
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default BabylonInfoPanel;
