import React from 'react';
import { ProtocolDetail } from '@/lib/types';
import { Lightbulb, Target, Zap } from 'lucide-react';

interface ProtocolOverviewProps {
  protocol: ProtocolDetail;
}

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProtocolOverviewProps {
  protocol: ProtocolDetail;
}

const ProtocolOverview: React.FC<ProtocolOverviewProps> = ({ protocol }) => {
  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {protocol.overview ? (
          <article className="prose prose-purple dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {protocol.overview}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Lightbulb className="w-5 h-5" />
                <h3>The Problem</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {protocol.valueProposition.problem}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Target className="w-5 h-5" />
                <h3>The Solution</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {protocol.valueProposition.solution}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Zap className="w-5 h-5" />
                <h3>Why it Matters</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {protocol.valueProposition.differentiation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtocolOverview;
