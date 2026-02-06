'use client';

import React from 'react';
import { ProtocolDetail } from '@/lib/types';
import PendleModule from './PendleModule';

interface PendleMechanicsProps {
    protocol: ProtocolDetail;
}

const PendleMechanics: React.FC<PendleMechanicsProps> = ({ protocol }) => {
    return (
        <div className="w-full h-full">
            <PendleModule />
        </div>
    );
};

export default PendleMechanics;
