import React from 'react';
import Image from 'next/image';
import { ProtocolDetail } from '@/lib/types';
import Link from 'next/link';
import { ExternalLink, Github, MessageCircle, FileText, Globe, ShieldCheck, FileCheck, Bug, FlaskConical } from 'lucide-react';

interface ProtocolResourcesProps {
  protocol: ProtocolDetail;
}

const ProtocolResources: React.FC<ProtocolResourcesProps> = ({ protocol }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe className="w-4 h-4" />;
      case 'docs': return <FileText className="w-4 h-4" />;
      case 'twitter': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
      case 'github': return <Github className="w-4 h-4" />;
      case 'discord': return <MessageCircle className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const officialLinks = protocol.resources.official.map(resource => ({
    label: resource.label,
    url: resource.url,
    icon: getIcon(resource.type)
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Official Resources */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm h-full">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5" /> Official Resources
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {officialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm"
              >
                {link.icon}
                {link.label}
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </a>
            ))}
          </div>
        </div>

        {/* Safety Resources */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm h-full">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Safety Resources
            </h3>
          </div>
          <div className="space-y-6">
            {/* Audits */}
            {protocol.resources.audits && protocol.resources.audits.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3 text-gray-900 dark:text-white">
                  <FileCheck className="w-4 h-4" /> Audits
                </h4>
                <ul className="space-y-2">
                  {protocol.resources.audits.map((audit, idx) => (
                    <li key={idx} className="text-sm bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{audit.auditor}</span>
                      <a href={audit.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline">
                        {audit.date}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bug Bounty */}
            {protocol.resources.bugBounties && protocol.resources.bugBounties.length > 0 ? (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3 text-gray-900 dark:text-white">
                  <Bug className="w-4 h-4" /> Bug Bounty
                </h4>
                {protocol.resources.bugBounties.map((bounty, idx) => (
                  <a key={idx} href={bounty.link} target="_blank" rel="noreferrer" className="block bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-sm hover:border-emerald-500/50 transition-colors">
                    <span className="block font-medium text-gray-900 dark:text-white">{bounty.name}</span>
                    <div className="flex items-center gap-1 mt-1 text-emerald-600 dark:text-emerald-400 text-xs">
                      View Program <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-3 text-gray-900 dark:text-white">
                  <Bug className="w-4 h-4" /> Bug Bounty
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No active bug bounty program found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VC & Investors */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="pb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5" /> Core VCs & Investors
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {protocol.resources.investors && protocol.resources.investors.length > 0 ? (
            protocol.resources.investors.map((investor, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-emerald-500/50 transition-colors"
              >
                {investor.icon ? (
                  <Image src={investor.icon} alt={investor.name} width={48} height={48} className="w-12 h-12 rounded-lg object-contain" unoptimized />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400">{investor.name.charAt(0)}</span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-white text-center">{investor.name}</span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-sm text-gray-500 dark:text-gray-400 italic">
              No major investor information available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolResources;
