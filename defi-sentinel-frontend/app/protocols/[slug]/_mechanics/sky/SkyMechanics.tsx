import React, { useState } from 'react';
import { SkyAnimation } from './SkyAnimation';
import { FlowStep } from './types';

const SkyMechanics: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<FlowStep>(FlowStep.INTRO);

    return (
        <div className="w-full h-full text-slate-100 flex flex-col">
            {/* Full Width Animation Module */}
            <div className="flex-1 w-full h-full">
                <SkyAnimation currentStep={currentStep} setStep={setCurrentStep} />
            </div>
        </div>
    );
};

export default SkyMechanics;
