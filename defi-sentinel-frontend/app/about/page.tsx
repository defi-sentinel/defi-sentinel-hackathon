import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, Users, Lock, Eye, FileText, Target, CheckCircle, AlertTriangle, BookOpen, Layers, BarChart3, Scale, Mail, Briefcase, Lightbulb, UserPlus } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      <main>
        {/* Hero Section - "Why We Exist" */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Research-first. Risk-aware. Web3-native.
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 tracking-tight">
              Bringing Clarity, Discipline, and Risk Awareness to DeFi
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
              DeFi Sentinel is a research-driven platform designed to help users navigate decentralized finance with confidence. 
              We aggregate protocol data, evaluate risks, and present actionable strategies — without hype, paid shills, or hidden incentives.
            </p>
          </div>
        </section>

        {/* The Problem We're Solving */}
        <section className="py-16 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  The Problem We&apos;re Solving
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  DeFi moves fast — but reliable information doesn&apos;t.
                </h3>
                <div className="space-y-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    Users are often forced to choose between raw on-chain data with no context or influencer-driven narratives with unclear incentives.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Fragmented Data</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Information scattered across dashboards, forums, and Discord servers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Over-marketed Strategies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Yield-chasing without understanding downside risks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Hidden Risks</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Smart contract vulnerabilities and governance risks buried in documentation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">Information Gap</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Retail vs insider information asymmetry</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Philosophy & Principles */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Our Philosophy & Principles
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                How we think about DeFi research and why it matters for long-term trust
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Risk-first, not APY-first</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We prioritize understanding what could go wrong before promoting high yields
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Transparency over hype</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clear disclosure of partnerships and methodologies that remain consistent regardless of commercial relationships
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Data &gt; narratives</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ratings are methodology-driven, not influenced by market sentiment
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Open methodologies</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All assumptions are documented and available for community review
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Opinions separated from facts</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We clearly distinguish between objective data and subjective analysis
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">User sovereignty</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We provide information, not custody. You maintain full control of your assets
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                What We Do
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Clear, actionable DeFi intelligence without marketing fluff
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">📊</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Protocol Ratings</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Comprehensive ratings based on security, liquidity, governance, and sustainability metrics
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🧠</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Strategy Analysis</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Yield strategies categorized by risk level and capital efficiency with detailed execution guides
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-red-200 dark:border-red-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">⚠️</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Risk Assessments</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Detailed analysis to help users understand downside scenarios and potential vulnerabilities
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🎓</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Educational Tools</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Interactive quizzes and guides to improve DeFi literacy and decision-making skills
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800 shadow-sm md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🔔</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Member-only Insights</h3>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Advanced analytics, real-time alerts, and exclusive research for active DeFi participants
                </p>
                <ul className="space-y-3 text-base text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Real-time DeFi security alerts
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Real-time arbitrage alerts
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Exclusive research and insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency & Methodology */}
        <section className="py-16 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Transparency & Methodology
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                Our rating system is continuously refined and versioned. Methodologies, assumptions, and limitations are documented and open for review.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/protocols" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 justify-center">
                  <BookOpen className="w-5 h-5" />
                  View Our Ratings
                </Link>
                <Link href="/research/methodology-rating-defi-protocols" className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-all flex items-center gap-2 justify-center">
                  <FileText className="w-5 h-5" />
                  Read Methodology
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Connect With Us */}
        <section id="connect-with-us" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Connect With Us
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Whether you&apos;re looking to partner with us, share feedback, or join our team — we&apos;d love to hear from you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              {/* Commercial Partnerships */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Commercial Partnerships</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Interested in partnering with DeFi Sentinel? We collaborate with protocols, auditors, data providers, and institutional partners.
                </p>
              </div>

              {/* Platform Feedback */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Platform Feedback</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Have suggestions to improve our platform? We value community feedback and continuously iterate based on user needs.
                </p>
              </div>

              {/* Join Our Team */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Join Our Team</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Passionate about DeFi research and risk analysis? We&apos;re always looking for talented researchers, developers, and analysts.
                </p>
              </div>

              {/* General Inquiries */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">General Inquiries</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  For all other questions, media inquiries, or general support — reach out to our team and we&apos;ll get back to you promptly.
                </p>
              </div>
            </div>

            {/* Single Email CTA */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 text-center shadow-xl border border-gray-700">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Get In Touch</h3>
                <p className="text-gray-300 mb-6">
                  For partnerships, feedback, careers, or any inquiries, contact us at:
                </p>
                <a 
                  href="/"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/25 text-lg"
                >
                  <Mail className="w-6 h-6" />
                  sampleemail@gmail.com
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Or connect with us on social media</p>
              <div className="flex justify-center gap-4">
                <a 
                  href="https://x.com/TheDeFiSentinel" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a 
                  href="/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
                <a 
                  href="/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
                <a 
                  href="/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to Navigate DeFi with Confidence?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Explore our protocol ratings, discover risk-aware strategies, and join a community that values transparency.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/protocols" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 justify-center">
                Explore Protocols <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/strategies" className="px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold transition-all flex items-center gap-2 justify-center">
                View Strategies
              </Link>
            </div>
          </div>
        </section>

        {/* Independence & Disclaimer */}
        <section className="py-16 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 md:p-12 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    Independence & Disclaimer
                  </h2>
                  <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
                    Important information about our platform
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  DeFi Sentinel is an independent research platform.
                </p>
                <p>
                  We do not provide financial advice, custody assets, or execute transactions on behalf of users. 
                  All information is provided for educational and informational purposes only.
                </p>
                <p>
                  Users are responsible for conducting their own due diligence and assessing the suitability of any strategy or protocol for their individual circumstances. 
                  Past performance does not guarantee future results, and all DeFi investments carry inherent risks including total loss of capital.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  By using DeFi Sentinel, you acknowledge that you understand these risks and agree to make your own informed decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}







