
import React, { useState } from 'react';
import BabylonAnimation from './BabylonAnimation';
import BabylonInfoPanel from './BabylonInfoPanel';
import { ProtocolStep, PROTOCOL_STEPS, STEP_ICONS } from './babylonConstants';
import { ShieldCheck } from 'lucide-react';

const BabylonMechanics: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<ProtocolStep>(ProtocolStep.IDLE);

    return (
        <div className="w-full h-full p-8">

            {/* Progress Bar */}
            <div className="mb-12 max-w-4xl mx-auto">
                <div className="flex justify-between relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full z-0"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / (Object.keys(PROTOCOL_STEPS).length - 1)) * 100}%` }}
                    ></div>

                    {/* Steps */}
                    {Object.keys(PROTOCOL_STEPS).map((key) => {
                        const stepIndex = Number(key);
                        const isActive = stepIndex <= currentStep;
                        const isCurrent = stepIndex === currentStep;

                        return (
                            <button
                                key={stepIndex}
                                onClick={() => setCurrentStep(stepIndex)}
                                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive
                                    ? 'bg-slate-900 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                                    : 'bg-slate-900 border-slate-700 text-slate-600 hover:border-slate-500'
                                    } ${isCurrent ? 'scale-125' : 'scale-100'}`}
                            >
                                {STEP_ICONS[stepIndex as ProtocolStep]}
                            </button>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-3 px-2">
                    {Object.values(PROTOCOL_STEPS).map((step, idx) => (
                        <span key={idx} className={`text-xs font-medium transition-colors duration-300 ${idx === currentStep ? 'text-orange-400' : 'text-slate-600'}`}>
                            {step.title}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Visualizer Column (2/3 width) */}
                <div className="lg:col-span-2">
                    <BabylonAnimation step={currentStep} />
                </div>

                {/* Info Column (1/3 width) */}
                <div className="lg:col-span-1 h-full min-h-[400px]">
                    <BabylonInfoPanel step={currentStep} setStep={setCurrentStep} />
                </div>

            </div>
        </div>

    );
};

export default BabylonMechanics;
