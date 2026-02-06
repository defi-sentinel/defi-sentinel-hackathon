import Link from "next/link";
import { getRatingColor } from "@/lib/data";
import { ArrowRight, PlayCircle, BookOpen, ArrowUpRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { ProtocolLogo } from "./components/ProtocolLogo";
import { AcademyCarousel } from "./components/AcademyCarousel";

// Server-side data fetching function
async function getHomepageData() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/homepage`, {
      cache: 'no-store', // Temporarily disable caching to fix streaming issue
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch homepage data:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return null;
  }
}

export default async function Home() {
  // Fetch data on the server
  const homepageData = await getHomepageData();

  // Parse data with error handling - show "Coming soon" if parsing fails
  let securityAlerts: any[] = [];
  let yieldOpportunities: any[] = [];
  let newlyRated: any[] = [];
  let topRatedProtocols: any[] = [];
  let featuredResearch: any = null;

  try {
    if (homepageData) {
      // Hardcoded alerts as requested
      securityAlerts = [
        {
          type: 'Market Alert',
          title: 'Market Volatility',
          message: 'Reduce leverage right now',
          severity: 'high'
        },
        {
          type: 'Depeg Alert',
          title: 'USDF Depeg',
          message: 'Time to buy',
          severity: 'medium'
        },
        {
          type: 'Security Breach',
          title: 'Balancer Exploit',
          message: 'Withdraw funds immediately',
          severity: 'high'
        }
      ];
      yieldOpportunities = Array.isArray(homepageData.topStrategies) ? homepageData.topStrategies : [];
      newlyRated = Array.isArray(homepageData.newlyRated) ? homepageData.newlyRated : [];
      topRatedProtocols = Array.isArray(homepageData.topRated) ? homepageData.topRated : [];
      featuredResearch = homepageData.featuredResearch || null;
    }
  } catch (parseError) {
    console.error("Error parsing homepage data:", parseError);
    // Data will remain empty arrays/null, will show "Coming soon" placeholders
  }

  // Default CMS Data (Frontend Backup) - Using real articles from research hub
  const DEFAULT_CMS_DATA = {
    featured: {
      titleLine1: "Surviving the Dark Forest:",
      titleLine2: "Risks in DeFi World",
      description: "DeFi offers high yields but comes with significant risks. Learn about Smart Contract Risk, Impermanent Loss, and how to protect your capital in this comprehensive guide.",
      link: "/research/risks-in-defi-world",
      readTime: "10 min read"
    },
    insight1: {
      title: "Stablecoin Depegging Explained",
      description: "Understanding what causes stablecoins to lose their peg and how to protect yourself during depeg events.",
      link: "/research/stablecoins-depegging-explained"
    },
    insight2: {
      title: "Why Avoid Circular Lending",
      description: "Learn why circular lending strategies in DeFi are dangerous and how they can lead to cascading liquidations.",
      link: "/research/why-avoid-circular-lending-borrowing"
    }
  };

  const cmsContent = homepageData?.cms || DEFAULT_CMS_DATA;

  // Helper to get risk bar color and width
  const getRiskStyle = (score: number) => {
    let color = "bg-red-500";
    if (score >= 90) color = "bg-emerald-500";
    else if (score >= 80) color = "bg-green-500";
    else if (score >= 70) color = "bg-yellow-500";
    else if (score >= 60) color = "bg-orange-500";

    return { width: `${score}%`, className: color };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-emerald-500/30">

      <main className="container mx-auto px-4 py-12 space-y-20">

        {/* A. Hero Section */}
        <section className="text-center max-w-5xl mx-auto pt-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 pb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 tracking-tight leading-tight">
            Institutional‑Grade DeFi Intelligence & Ratings
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Risk ratings, yield strategy analysis, and institutional-grade research for the top DeFi protocols.
          </p>

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/protocols" className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-500/25 w-full sm:w-auto min-w-[180px]">
                Explore Protocols
              </Link>
              <Link href="/strategies" className="px-8 py-3.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-semibold transition-all w-full sm:w-auto min-w-[180px]">
                Find Strategies
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Article Section */}
        {cmsContent ? (
          <section className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-gray-900 to-blue-900 p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/50 via-cyan-900/30 to-gray-900/40 opacity-20"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    FEATURED RESEARCH
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {cmsContent.featured.titleLine1 || "Latest Research:"} <br />
                    <span className="text-blue-400">{cmsContent.featured.titleLine2 || "Insights & Analysis"}</span>
                  </h2>
                  <p className="text-gray-300 mb-8 leading-relaxed max-w-md">
                    {cmsContent.featured.description || "Read our latest research analysis."}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href={cmsContent.featured.link || "/research"}
                      className="px-6 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      Read Analysis
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-sm text-gray-400 font-medium">{cmsContent.featured.readTime || "5 min read"}</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-gray-50 dark:bg-gray-800">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Latest Insights</h3>
                  <div className="space-y-6">
                    {/* Insight 1 */}
                    {cmsContent.insight1.title && (
                      <Link href={cmsContent.insight1.link || "#"} className="block group cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg ${cmsContent.insight1.title.toLowerCase().includes('video') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'} flex items-center justify-center shrink-0`}>
                            {cmsContent.insight1.title.toLowerCase().includes('video') ? <PlayCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">{cmsContent.insight1.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{cmsContent.insight1.description}</p>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Insight 2 */}
                    {cmsContent.insight2.title && (
                      <Link href={cmsContent.insight2.link || "#"} className="block group cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg ${cmsContent.insight2.title.toLowerCase().includes('video') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'} flex items-center justify-center shrink-0`}>
                            {cmsContent.insight2.title.toLowerCase().includes('video') ? <PlayCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">{cmsContent.insight2.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{cmsContent.insight2.description}</p>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
                <Link href="/research" className="mt-8 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-2 group">
                  View Research Hub <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        ) : featuredResearch ? (
          <section className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-gray-900 to-blue-900 p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/50 via-cyan-900/30 to-gray-900/40 opacity-20"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    FEATURED RESEARCH
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {(() => {
                      const colonIndex = featuredResearch.title.indexOf(':');
                      if (colonIndex > 0) {
                        const firstPart = featuredResearch.title.substring(0, colonIndex + 1);
                        const secondPart = featuredResearch.title.substring(colonIndex + 1).trim();
                        return (
                          <>
                            {firstPart} <br />
                            <span className="text-blue-400">{secondPart}</span>
                          </>
                        );
                      }
                      return featuredResearch.title;
                    })()}
                  </h2>
                  <p className="text-gray-300 mb-8 leading-relaxed max-w-md">
                    {featuredResearch.summary || "Read our latest research analysis."}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/research/${featuredResearch.slug}`}
                      className="px-6 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      Read Analysis
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-sm text-gray-400 font-medium">12 min read</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-gray-50 dark:bg-gray-800">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Latest Insights</h3>
                  <div className="space-y-6">
                    <Link href="/research/stablecoins-depegging-explained" className="block group cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">Stablecoin Depegging Explained</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">Understanding what causes stablecoins to lose their peg and how to protect yourself during depeg events.</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/research/why-avoid-circular-lending-borrowing" className="block group cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">Why Avoid Circular Lending</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">Learn why circular lending strategies in DeFi are dangerous and how they can lead to cascading liquidations.</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <Link href="/research" className="mt-8 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-2 group">
                  View Research Hub <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-gray-900 to-blue-900 p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/50 via-cyan-900/30 to-gray-900/40 opacity-20"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    FEATURED RESEARCH
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    Coming soon
                  </h2>
                  <p className="text-gray-300 mb-8 leading-relaxed max-w-md">
                    Our latest research and analysis will be available here soon.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-gray-50 dark:bg-gray-800">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Latest Insights</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">Coming soon</p>
                </div>
                <Link href="/research" className="mt-8 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-2 group">
                  View Research Hub <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* C. Core Intelligence Panels (MOVED UP) */}
        <section className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

            {/* 1. Security Alerts */}
            <div className="flex flex-col h-full p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Security Alerts
              </h3>
              <div className="flex-1 flex flex-col">
                {[0, 1, 2].map((idx) => {
                  const alert = securityAlerts[idx];
                  return (
                    <div key={idx} className="h-[72px] flex items-center border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                      {alert ? (
                        <div className="text-sm group w-full">
                          <div className="flex items-start gap-3">
                            <span className="text-lg leading-none mt-0.5 shrink-0">
                              {alert.severity === 'high' ? '🚨' : '⚠️'}
                            </span>
                            <div>
                              <p className="text-gray-900 dark:text-white leading-snug">
                                <span className="font-bold block">{alert.title}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300 block mt-0.5">
                                  {alert.message || ''}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400/20 text-sm italic">
                          Coming soon
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Top Strategies */}
            <div className="flex flex-col h-full p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Top Strategies
              </h3>
              <div className="flex-1 flex flex-col">
                {[0, 1, 2].map((idx) => {
                  const yieldOp = yieldOpportunities[idx];
                  return (
                    <div key={idx} className="h-[72px] flex flex-col justify-center border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                      {yieldOp ? (
                        <>
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">{yieldOp.name}</div>
                            </div>
                            <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{yieldOp.apy} APY</div>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 dark:text-gray-400">{yieldOp.type}</span>
                            </div>
                            <span className="text-gray-400 dark:text-gray-500">{yieldOp.risk} Risk</span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400/20 text-sm italic">
                          {/* Placeholder for empty strategy slot */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <Link
                href="/strategies"
                className="block pt-4 text-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All Strategies &rarr;
              </Link>
            </div>

            {/* 3. Newly Rated */}
            <div className="flex flex-col h-full p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Newly Rated Protocols
              </h3>
              <div className="flex-1 flex flex-col">
                {[0, 1, 2].map((idx) => {
                  const item = newlyRated[idx];
                  return (
                    <div key={idx} className="h-[72px] flex items-center border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                      {item ? (
                        <Link
                          href={`/protocols/${item.slug}`}
                          className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
                        >
                          <div className="flex items-center gap-3">
                            <ProtocolLogo name={item.name} slug={item.slug} logoUrl={(item as any).logo} />
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</div>
                              {item.ratedDate && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.ratedDate}</div>
                              )}
                            </div>
                          </div>
                          {item.rating && (
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-bold ${getRatingColor(
                                item.rating.replace('+', '').replace('-', '')
                              )}`}
                            >
                              {item.rating}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400/20 text-sm italic">
                          {/* Placeholder for empty newly rated slot */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <Link href="/protocols" className="block pt-4 text-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                View All Updates &rarr;
              </Link>
            </div>

          </div>

        </section>

        {/* B. Top Rated Protocols Table (MOVED DOWN) */}
        <section className="max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Rated Protocols</h2>
            <Link href="/protocols" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View All <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Risk Score</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topRatedProtocols.length > 0 ? (
                  topRatedProtocols.map((project) => {
                    const score = project.score || 0;
                    const riskStyle = getRiskStyle(score);
                    return (
                      <tr key={project.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <ProtocolLogo name={project.name} slug={project.slug} logoUrl={project.logo} className="w-10 h-10" />
                            <div className="font-semibold text-gray-900 dark:text-white">{project.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                          <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-medium">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-32">
                            <div className="flex justify-between text-xs mb-1.5 text-gray-600 dark:text-gray-400">
                              <span className="font-medium">{score}/100</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${riskStyle.className}`} style={{ width: riskStyle.width }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {project.rating && (
                            <span className={`px-3 py-1 rounded-md text-xs font-bold ${getRatingColor(project.rating)}`}>
                              {project.rating}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/protocols/${project.slug}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                            View detail <span aria-hidden="true">&rarr;</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">Coming soon</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Academy & Guides - Big Widget Carousel */}
        <AcademyCarousel />

        {/* Partner CTA Section */}
        <section className="max-w-6xl mx-auto pb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-xl border border-gray-700">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Cooperate with DeFi Sentinel</h2>
              <p className="text-gray-300 text-lg">
                Join us in providing institutional-grade transparency to the DeFi ecosystem. We collaborate with protocols, auditors, and researchers.
              </p>
            </div>
            <Link href="/about#connect-with-us" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-1 flex items-center gap-2 whitespace-nowrap">
              Connect with us
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>

    </div>
  );
}
