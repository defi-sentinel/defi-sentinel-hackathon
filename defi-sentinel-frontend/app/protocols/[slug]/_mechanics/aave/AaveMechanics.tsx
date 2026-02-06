'use client';

import React from 'react';
import { ProtocolDetail } from '@/lib/types';
import { AaveSimulation } from './AaveSimulation';

interface AaveMechanicsProps {
    protocol: ProtocolDetail;
}

const AaveMechanics: React.FC<AaveMechanicsProps> = ({ protocol }) => {
    return (
        <div className="w-full h-full">
            <AaveSimulation />
        </div>
    );
};

export default AaveMechanics;
