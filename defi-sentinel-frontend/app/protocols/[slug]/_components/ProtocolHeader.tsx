import React from 'react';
import Image from 'next/image';
import { ProtocolDetail } from '@/lib/types';
import { Shield, Share2, ExternalLink } from 'lucide-react';
import { getRatingDotColor, getRatingColor } from '@/lib/data';
import { getProtocolLogo } from '@/lib/getProtocolLogo';

interface ProtocolHeaderProps {
  protocol: ProtocolDetail;
}

const ProtocolHeader: React.FC<ProtocolHeaderProps> = ({ protocol }) => {
  // Extract text color classes from rating color
  const ratingColorClasses = getRatingColor(protocol.rating).split(' ').filter(cls => cls.startsWith('text-')).join(' ');

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Left: Logo & Info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image src={getProtocolLogo(protocol)} alt={protocol.name} width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{protocol.name}</h1>
              {protocol.statusBadges?.map((badge: string) => (
                <span key={badge} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                  {badge === 'Audited' && <Shield className="w-3 h-3 mr-1 text-green-500" />}
                  {badge}
                </span>
              ))}
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl leading-relaxed">{protocol.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {protocol.category}
              </span>
              {protocol.chains.map(chain => (
                <span key={chain} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {chain}
                </span>
              ))}

              {protocol.tvl && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                  TVL: {protocol.tvl}
                </span>
              )}

              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center ml-2">
                Last updated: {(protocol as any).ratedDate ? new Date((protocol as any).ratedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Rating & Actions */}
        <div className="flex flex-col items-end gap-6 min-w-[280px]">
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Risk Rating</div>
              <div className="flex items-center justify-end gap-3">
                <span className={`w-8 h-8 rounded-full ${getRatingDotColor(protocol.rating)} shadow-lg ring-4 ring-white dark:ring-gray-800`}></span>
                <span className={`text-7xl font-black ${ratingColorClasses} drop-shadow-xl tracking-tighter`}>{protocol.rating}</span>
              </div>
            </div>

            <div className={`p-5 rounded-2xl text-center min-w-[120px] shadow-xl border-4 ${protocol.score >= 80 ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
              protocol.score >= 60 ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Safety Score</div>
              <div className={`text-6xl font-black drop-shadow-sm ${protocol.score >= 80 ? 'text-green-600 dark:text-green-400' :
                protocol.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                {protocol.score}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <a href={protocol.resources.official.find(r => r.type === 'website')?.url || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <ExternalLink className="w-4 h-4 mr-2" /> Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolHeader;
