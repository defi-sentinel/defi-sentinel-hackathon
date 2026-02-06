'use client';

import React from 'react';
import { ProtocolDetail } from '@/lib/types';
import { LidoAnimation } from './LidoAnimation';

interface LidoMechanicsProps {
    protocol: ProtocolDetail;
}

const LidoMechanics: React.FC<LidoMechanicsProps> = ({ protocol }) => {
    return (
        <div className="w-full">
            <LidoAnimation />
        </div>
    );
};

export default LidoMechanics;
