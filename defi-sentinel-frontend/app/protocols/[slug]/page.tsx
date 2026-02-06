'use client';

import React, { useEffect, useState } from 'react';
import ProtocolHeader from './_components/ProtocolHeader';
import ProtocolRisks from './_components/ProtocolRisks';
import ProtocolMechanics from './_components/ProtocolMechanics';
import ProtocolGovernance from './_components/ProtocolGovernance';
import ProtocolPerformance from './_components/ProtocolPerformance';
import ProtocolProducts from './_components/ProtocolProducts';
import ProtocolResources from './_components/ProtocolResources';
import { ProtocolDetail } from '@/lib/types';
import { FileText, ChevronRight, LayoutDashboard, Layers, Vote, BookOpen, FlaskConical, ExternalLink, Lightbulb, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from "@/lib/constants";
import { ProtocolLoadingSkeleton } from './ProtocolLoadingSkeleton';

const ProtocolDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [slug, setSlug] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<ProtocolDetail | null>(null);

  useEffect(() => {
    params.then((unwrappedParams) => setSlug(unwrappedParams.slug));
  }, [params]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/protocols/${slug}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Protocol not found");
          throw new Error("Failed to fetch protocol data");
        }
        const data = await res.json();

        // Parse JSON fields if they are strings (backup for API issues)
        const parsedData = {
          ...data,
          mechanics: typeof data.mechanics === 'string' ? JSON.parse(data.mechanics) : data.mechanics,
          metrics: typeof data.metrics === 'string' ? JSON.parse(data.metrics) : data.metrics,
          products: typeof data.products === 'string' ? JSON.parse(data.products) : data.products,
          governance: typeof data.governance === 'string' ? JSON.parse(data.governance) : data.governance,
          resources: typeof data.resources === 'string' ? JSON.parse(data.resources) : data.resources,
          risks: typeof data.risks === 'string' ? JSON.parse(data.risks) : data.risks,
          valueProposition: typeof data.valueProposition === 'string' ? JSON.parse(data.valueProposition) : data.valueProposition,
          statusBadges: typeof data.statusBadges === 'string' ? JSON.parse(data.statusBadges) : data.statusBadges,
          fundingHistory: typeof data.fundingHistory === 'string' ? JSON.parse(data.fundingHistory) : data.fundingHistory,
        };

        setProtocol(parsedData);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProtocol();
  }, [slug]);

  if (loading) {
    return <ProtocolLoadingSkeleton />;
  }

  if (error || !protocol) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {error || "Protocol not found"}
        </h1>
        <Link href="/protocols" className="text-purple-600 hover:underline">Back to Protocols</Link>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* 1. Header Section */}
        <section className="space-y-4">
          <Link href="/protocols" className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors">
            <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
            Back to Protocols
          </Link>
          <ProtocolHeader protocol={protocol} />
        </section>

        {/* 2. Mechanics Section (How it Works) */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <ProtocolMechanics protocol={protocol} />
        </section>

        {/* 3. Score Breakdown Section */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <ProtocolRisks protocol={protocol} />
        </section>

        {/* 4. Tabbed Details Section */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <nav className="-mb-px flex space-x-8 px-1" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-bold text-lg transition-all
                  ${activeTab === 'overview'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <LayoutDashboard className={`w-5 h-5 mr-2 ${activeTab === 'overview' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                Overview
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-bold text-lg transition-all
                  ${activeTab === 'products'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <Layers className={`w-5 h-5 mr-2 ${activeTab === 'products' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                Products & Strategies
              </button>

              <button
                onClick={() => setActiveTab('governance')}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-bold text-lg transition-all
                  ${activeTab === 'governance'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <Vote className={`w-5 h-5 mr-2 ${activeTab === 'governance' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                Token & Governance
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-bold text-lg transition-all
                  ${activeTab === 'resources'
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <BookOpen className={`w-5 h-5 mr-2 ${activeTab === 'resources' ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                Resources
              </button>
            </nav>
          </div>

          <div className="min-h-[300px] animate-fade-in">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Problem */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <Lightbulb className="w-5 h-5" />
                        <h3 className="font-bold">The Problem</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {protocol.valueProposition?.problem || "Yield in DeFi is volatile and unpredictable. Users cannot easily lock in fixed rates or speculate on yield movements."}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <Target className="w-5 h-5" />
                        <h3 className="font-bold">The Solution</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {protocol.valueProposition?.solution || "Pendle splits yield-bearing assets into Principal Tokens (PT) and Yield Tokens (YT). PT offers fixed yield, while YT represents the variable yield component."}
                      </p>
                    </div>

                    {/* Differentiation */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <Zap className="w-5 h-5" />
                        <h3 className="font-bold">Why it Matters</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {protocol.valueProposition?.differentiation || "First-mover advantage in yield tokenization with a specialized AMM designed for time-decaying assets."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <ProtocolPerformance protocol={protocol} />
                </div>
              </div>
            )}
            {activeTab === 'products' && <ProtocolProducts protocol={protocol} />}
            {activeTab === 'governance' && <ProtocolGovernance protocol={protocol} />}
            {activeTab === 'resources' && <ProtocolResources protocol={protocol} />}
          </div>
        </section>

        {/* 5. Related Articles Section */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-purple-600" />
              Related Research
            </h2>
            <Link href="/articles" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocol.resources?.articles && protocol.resources.articles.length > 0 ? (
              protocol.resources.articles.map((article: any, idx: number) => {
                const isExternal = article.url && article.url.startsWith('http');
                return (
                  <Link
                    key={idx}
                    href={article.url || `/articles/${article.slug || '#'}`}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                      {/* Placeholder for article image if real img not available */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <FileText className="w-12 h-12 opacity-20" />
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg group-hover:text-purple-600 transition-colors line-clamp-2">{article.title}</h3>
                        {isExternal && <ExternalLink className="w-4 h-4 text-gray-400" />}
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-4">{article.summary}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-medium">
                        <span>{article.category || 'Analysis'}</span>
                        <span>•</span>
                        <span>{article.readTime || 5} min read</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                No related analysis articles found for {protocol.name}.
              </div>
            )}
          </div>
        </section>



      </main>
    </div>
  );
};

export default ProtocolDetailPage;
