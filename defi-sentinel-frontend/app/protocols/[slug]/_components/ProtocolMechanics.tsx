import React from 'react';
import { ProtocolDetail } from '@/lib/types';
import { MECHANICS_REGISTRY, DefaultMechanics } from '../_mechanics/registry';

interface ProtocolMechanicsProps {
  protocol: ProtocolDetail;
}

const ProtocolMechanics: React.FC<ProtocolMechanicsProps> = ({ protocol }) => {
  // Look up the specific mechanics component
  const SpecificMechanics = MECHANICS_REGISTRY[protocol.slug];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
          <svg
            className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mechanics & Architecture
        </h3>
      </div>

      <div className="bg-white dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        {SpecificMechanics ? (
          <SpecificMechanics protocol={protocol} />
        ) : (
          <DefaultMechanics protocol={protocol} />
        )}
      </div>
    </div>
  );
};

export default ProtocolMechanics;
