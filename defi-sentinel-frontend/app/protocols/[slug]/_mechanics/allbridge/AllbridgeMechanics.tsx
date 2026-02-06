'use client';
import React from 'react';
import { AllbridgeModule } from './AllbridgeModule';
import { ProtocolDetail } from '@/lib/types';

interface AllbridgeMechanicsProps {
    protocol: ProtocolDetail;
}

const AllbridgeMechanics: React.FC<AllbridgeMechanicsProps> = ({ protocol }) => {
    return (
        <div className="flex justify-center w-full">
            <AllbridgeModule />
        </div>
    );
};

export default AllbridgeMechanics;
