"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProtocolLogo } from "@/lib/getProtocolLogo";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Flame,
  Clock,
  Shield,
  Info,
  X,
  Grid3x3,
  List
} from "lucide-react";
import { getRatingColor } from "@/lib/data";
import { fetchProtocols, type Protocol, type ProtocolsQueryParams } from "@/lib/api";
import { ProtocolsLoadingSkeleton } from "./ProtocolsLoadingSkeleton";

export default function ProtocolsPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [riskScoreRange, setRiskScoreRange] = useState<[number, number]>([0, 100]);
  const [tvlRange, setTvlRange] = useState<[number, number]>([0, 100]);
  const [apyRange, setApyRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>("rating");
  const [sortDirection, setSortDirection] = useState<"none" | "asc" | "desc">("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [animationKey, setAnimationKey] = useState(0);

  const itemsPerPage = viewMode === "grid" ? 15 : 20;

  // Available filter options
  const categories = ["Lending", "DEX", "Yield", "Liquid Staking", "Derivatives", "Stablecoin"];
  const chains = ["Ethereum", "Arbitrum", "Optimism", "Polygon", "Base", "BSC", "Avalanche", "Solana"];
  const ratings = useMemo(() => ["AAA", "AA", "A", "BBB", "BB", "B", "CCC"], []);

  // Build API query params
  const queryParams: ProtocolsQueryParams = useMemo(() => {
    const params: ProtocolsQueryParams = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (searchQuery) params.search = searchQuery;
    if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
    if (selectedChains.length > 0) params.chain = selectedChains.join(',');
    if (selectedRatings.length > 0) params.rating = selectedRatings.join(',');
    if (riskScoreRange[0] > 0) params.minScore = riskScoreRange[0];
    if (riskScoreRange[1] < 100) params.maxScore = riskScoreRange[1];

    // Map sortBy to backend sort parameter
    // Map sortBy to backend sort parameter
    if (sortDirection !== "none") {
      if (sortBy === "rating") params.sort = sortDirection === "desc" ? "rating" : "rating-low";
      else if (sortBy === "score") params.sort = sortDirection === "desc" ? "score" : "score-low";
      else if (sortBy === "tvl") params.sort = sortDirection === "desc" ? "tvl" : "tvl-low";
      else if (sortBy === "tvl-change") params.sort = sortDirection === "desc" ? "tvl-change" : "tvl-change-low";
      else if (sortBy === "newest") params.sort = "newest";
    }

    if (tvlRange[0] > 0) params.minTvl = tvlRange[0];
    if (tvlRange[1] < 100) params.maxTvl = tvlRange[1];

    return params;
  }, [searchQuery, selectedCategories, selectedChains, selectedRatings, riskScoreRange, tvlRange, sortBy, sortDirection, currentPage, itemsPerPage]);

  // Fetch protocols from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['protocols', queryParams],
    queryFn: () => fetchProtocols(queryParams),
    staleTime: 30000, // Cache for 30 seconds
    placeholderData: keepPreviousData, // Keep previous data while fetching new data to prevent flash
  });

  const allProtocols = data?.data || [];
  const widgets = data?.widgets;
  const pagination = data?.pagination;

  // Protocols are already filtered and sorted by the backend
  const filteredAndSortedProtocols = allProtocols;
  const paginatedProtocols = allProtocols; // Backend handles pagination
  const totalPages = pagination?.totalPages || 1;

  // Reset to page 1 and trigger animation when filters change
  // Reset to page 1 and trigger animation when filters change
  useEffect(() => {
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  }, [searchQuery, selectedCategories, selectedChains, selectedRatings, riskScoreRange, tvlRange, apyRange]);

  // Reset to page 1 when sort changes, but don't trigger full remount animation
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortDirection]);

  // Handle column header sort - three-state: none -> desc -> asc -> none
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Cycle through: none -> desc -> asc -> none
      if (sortDirection === "none") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("asc");
      } else {
        // Return to default: reset to rating with none direction
        setSortDirection("none");
        setSortBy("rating");
      }
    } else {
      // Set new column and start with descending (high to low)
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  // Toggle filter
  const toggleFilter = (value: string, selected: string[], setSelected: (values: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedChains([]);
    setSelectedRatings([]);
    setRiskScoreRange([0, 100]);
    setTvlRange([0, 100]);
    setApyRange([0, 100]);
    setSortBy("rating");
    setSortDirection("none");
  };

  const getRiskBarColor = (rating: string) => {
    switch (rating) {
      case "AAA": return "bg-green-500";
      case "AA": return "bg-emerald-500";
      case "A": return "bg-yellow-500";
      case "BBB": return "bg-orange-500";
      case "BB": return "bg-red-500";
      case "B": return "bg-red-700";
      case "CCC": return "bg-red-800";
      default: return "bg-gray-500";
    }
  };

  const getHoverBorderColor = (rating: string) => {
    switch (rating) {
      case "AAA": return "hover:border-green-500 dark:hover:border-green-500";
      case "AA": return "hover:border-emerald-500 dark:hover:border-emerald-500";
      case "A": return "hover:border-yellow-500 dark:hover:border-yellow-500";
      case "BBB": return "hover:border-orange-500 dark:hover:border-orange-500";
      case "BB": return "hover:border-red-500 dark:hover:border-red-500";
      case "B": return "hover:border-red-700 dark:hover:border-red-700";
      case "CCC": return "hover:border-red-800 dark:hover:border-red-800";
      default: return "hover:border-gray-500 dark:hover:border-gray-500";
    }
  };

  // Get rating text color only (no background)
  const getRatingTextColor = (rating: string) => {
    switch (rating) {
      case "AAA": return "text-green-600 dark:text-green-400";
      case "AA": return "text-emerald-600 dark:text-emerald-400";
      case "A": return "text-yellow-600 dark:text-yellow-400";
      case "BBB": return "text-orange-600 dark:text-orange-400";
      case "BB": return "text-red-600 dark:text-red-400";
      case "B": return "text-red-700 dark:text-red-500";
      case "CCC": return "text-red-800 dark:text-red-600";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  // Triangle sort icons
  const TriangleUp = ({ className }: { className?: string }) => (
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" className={className}>
      <path d="M4 0L8 6H0L4 0Z" fill="currentColor" />
    </svg>
  );

  const TriangleDown = ({ className }: { className?: string }) => (
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" className={className}>
      <path d="M4 6L0 0H8L4 6Z" fill="currentColor" />
    </svg>
  );

  // Simple Sparkline Component for TVL
  const TvlSparkline = ({ data, change }: { data?: number[] | { day7?: number[], day30?: number[], all?: number[] }, change?: number }) => {
    const isPositive = (change || 0) > 0;
    const color = isPositive ? "#10b981" : "#ef4444";

    const points = useMemo(() => {
      // Handle different data formats
      let dataArray: number[] = [];

      if (Array.isArray(data)) {
        dataArray = data;
      } else if (data && typeof data === 'object') {
        // Use day7 for sparkline (most recent trend)
        dataArray = data.day7 || data.day30 || data.all || [];
      }

      if (!dataArray || dataArray.length < 2) return "0,12 100,12";

      const min = Math.min(...dataArray);
      const max = Math.max(...dataArray);
      const range = max - min || 1;

      return dataArray.map((val, index) => {
        const x = (index / (dataArray.length - 1)) * 100;
        // Map value to Y (0 is top, so we invert). Use 2-22 range (20px height)
        const normalized = (val - min) / range;
        const y = 22 - (normalized * 20);
        return `${x},${y.toFixed(1)}`;
      }).join(" ");
    }, [data]);

    return (
      <svg width="120" height="24" viewBox="0 0 100 24" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const getTvlChangeColor = (change: number | undefined) => {
    if (!change) return "text-gray-500";
    return change > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
  };

  const getBadges = (protocol: Protocol) => {
    const badges = [];
    if (protocol.isNew) badges.push({ icon: Sparkles, text: "New", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" });
    if (protocol.isTrending) badges.push({ icon: Flame, text: "Trending", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" });
    if (protocol.hasRiskAlert) badges.push({ icon: AlertTriangle, text: "Alert", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" });
    return badges;
  };

  // Get score styling based on risk rating
  const getScoreStyle = (rating: string) => {
    switch (rating) {
      case "AAA":
        return {
          bg: "bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500",
          border: "border-green-400 dark:border-green-300",
          shadow: "shadow-lg shadow-green-500/20 dark:shadow-green-400/20",
          text: "text-white"
        };
      case "AA":
        return {
          bg: "bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500",
          border: "border-emerald-400 dark:border-emerald-300",
          shadow: "shadow-lg shadow-emerald-500/20 dark:shadow-emerald-400/20",
          text: "text-white"
        };
      case "A":
        return {
          bg: "bg-gradient-to-br from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500",
          border: "border-yellow-400 dark:border-yellow-300",
          shadow: "shadow-lg shadow-yellow-500/20 dark:shadow-yellow-400/20",
          text: "text-white"
        };
      case "BBB":
        return {
          bg: "bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-500",
          border: "border-orange-400 dark:border-orange-300",
          shadow: "shadow-lg shadow-orange-500/20 dark:shadow-orange-400/20",
          text: "text-white"
        };
      case "BB":
        return {
          bg: "bg-gradient-to-br from-red-500 to-red-700 dark:from-red-400 dark:to-red-600",
          border: "border-red-400 dark:border-red-300",
          shadow: "shadow-lg shadow-red-500/20 dark:shadow-red-400/20",
          text: "text-white"
        };
      case "B":
        return {
          bg: "bg-gradient-to-br from-red-600 to-red-800 dark:from-red-500 dark:to-red-700",
          border: "border-red-500 dark:border-red-400",
          shadow: "shadow-lg shadow-red-600/20 dark:shadow-red-500/20",
          text: "text-white"
        };
      case "CCC":
        return {
          bg: "bg-gradient-to-br from-red-700 to-red-900 dark:from-red-600 dark:to-red-800",
          border: "border-red-600 dark:border-red-500",
          shadow: "shadow-lg shadow-red-700/20 dark:shadow-red-600/20",
          text: "text-white"
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700",
          border: "border-gray-300 dark:border-gray-500",
          shadow: "shadow-lg shadow-gray-500/20 dark:shadow-gray-400/20",
          text: "text-white"
        };
    }
  };

  // Get featured, latest, and top rated protocols from widgets
  const featuredProtocol = widgets?.featured ? {
    ...widgets.featured,
    id: widgets.featured.slug,
  } : null;

  const latestRatedProtocols = widgets?.latestRated || [];
  const topRatedProtocols = widgets?.topRated || [];

  // Show skeleton on initial load, use placeholderData for subsequent loads
  if (isLoading && !data) {
    return <ProtocolsLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Protocols</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : "Failed to load protocols"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto animate-fade-in">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
            DeFi Protocols Directory
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
            Comprehensive risk ratings and analysis for {pagination?.total || 0}+ DeFi protocols across multiple chains.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Feature Cards - Replacing Market Insights */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured Protocol */}
          {featuredProtocol && (
            <Link href={`/protocols/${featuredProtocol.slug}`} className="group bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-lg">Featured Protocol</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 flex items-center justify-center text-3xl shrink-0">
                  {getProtocolLogo(featuredProtocol).startsWith('/') || getProtocolLogo(featuredProtocol).startsWith('http') ? (
                    <Image src={getProtocolLogo(featuredProtocol)} alt={featuredProtocol.name} width={32} height={32} className="w-full h-full object-contain rounded-full" />
                  ) : (
                    <span>{getProtocolLogo(featuredProtocol)}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{featuredProtocol.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">{featuredProtocol.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Score:</span>
                  <span className={`w-10 h-10 rounded-full border-2 ${getScoreStyle(featuredProtocol.rating).bg} ${getScoreStyle(featuredProtocol.rating).border} ${getScoreStyle(featuredProtocol.rating).shadow} flex items-center justify-center ${getScoreStyle(featuredProtocol.rating).text} text-sm font-bold ring-2 ring-white/20 dark:ring-white/10 [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.8),_0_0_4px_rgb(0_0_0_/_0.5)]`}>
                    {featuredProtocol.score}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded font-bold ${getRatingColor(featuredProtocol.rating)}`}>{featuredProtocol.rating}</span>
              </div>
            </Link>
          )}

          {/* Latest Rated */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-lg">Latest Rated</span>
            </div>
            <div className="space-y-3">
              {latestRatedProtocols.map((protocol) => (
                <Link key={protocol.slug} href={`/protocols/${protocol.slug}`} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors group">
                  <div className="w-6 h-6 flex items-center justify-center text-xl shrink-0">
                    {getProtocolLogo(protocol).startsWith('/') || getProtocolLogo(protocol).startsWith('http') ? (
                      <Image src={getProtocolLogo(protocol)} alt={protocol.name} width={24} height={24} className="w-full h-full object-contain rounded-full" />
                    ) : (
                      <span>{getProtocolLogo(protocol)}</span>
                    )}
                  </div>
                  <span className="font-medium text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex-1">{protocol.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${getRatingColor(protocol.rating)} flex items-center justify-center min-w-[2.5rem]`}>{protocol.rating}</span>
                  <span className={`w-8 h-8 rounded-full border-2 ${getScoreStyle(protocol.rating).bg} ${getScoreStyle(protocol.rating).border} ${getScoreStyle(protocol.rating).shadow} flex items-center justify-center ${getScoreStyle(protocol.rating).text} text-xs font-bold ring-1 ring-white/20 dark:ring-white/10 [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.8),_0_0_4px_rgb(0_0_0_/_0.5)]`}>
                    {protocol.score}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Rated */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-lg">Top Rated</span>
            </div>
            <div className="space-y-3">
              {topRatedProtocols.map((protocol) => (
                <Link key={protocol.slug} href={`/protocols/${protocol.slug}`} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors group">
                  <div className="w-6 h-6 flex items-center justify-center text-xl shrink-0">
                    {getProtocolLogo(protocol).startsWith('/') || getProtocolLogo(protocol).startsWith('http') ? (
                      <Image src={getProtocolLogo(protocol)} alt={protocol.name} width={24} height={24} className="w-full h-full object-contain rounded-full" />
                    ) : (
                      <span>{getProtocolLogo(protocol)}</span>
                    )}
                  </div>
                  <span className="font-medium text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex-1">{protocol.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${getRatingColor(protocol.rating)} flex items-center justify-center min-w-[2.5rem]`}>{protocol.rating}</span>
                  <span className={`w-8 h-8 rounded-full border-2 ${getScoreStyle(protocol.rating).bg} ${getScoreStyle(protocol.rating).border} ${getScoreStyle(protocol.rating).shadow} flex items-center justify-center ${getScoreStyle(protocol.rating).text} text-xs font-bold ring-1 ring-white/20 dark:ring-white/10 [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.8),_0_0_4px_rgb(0_0_0_/_0.5)]`}>
                    {protocol.score}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 space-y-4">
            {/* Search and Controls Row */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search protocols (e.g., Aave, Uniswap...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-sm transition-all"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => {
                    setViewMode("list");
                    setCurrentPage(1);
                  }}
                  className={`p-2 rounded transition-all ${viewMode === "list"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setViewMode("grid");
                    setCurrentPage(1);
                  }}
                  className={`p-2 rounded transition-all ${viewMode === "grid"
                    ? "bg-emerald-600 text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-all hover:scale-105 active:scale-95"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(selectedCategories.length + selectedChains.length + selectedRatings.length) > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {selectedCategories.length + selectedChains.length + selectedRatings.length}
                  </span>
                )}
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4 animate-slide-down">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${selectedCategories.includes(category)
                          ? "bg-emerald-600 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chains */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Chains
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {chains.map((chain) => (
                      <button
                        key={chain}
                        onClick={() => toggleFilter(chain, selectedChains, setSelectedChains)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 ${selectedChains.includes(chain)
                          ? "bg-emerald-600 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                      >
                        {chain}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ratings
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ratings.map((rating) => (
                      <button
                        key={rating}
                        onClick={() => toggleFilter(rating, selectedRatings, setSelectedRatings)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all hover:scale-105 ${selectedRatings.includes(rating)
                          ? "bg-emerald-600 text-white shadow-md"
                          : `${getRatingColor(rating)}`
                          }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold">{pagination?.total || 0}</span> protocol{(pagination?.total || 0) !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {pagination && ` (Page ${pagination.page} of ${pagination.totalPages})`}
          </p>
        </div>

        {/* Protocol List */}
        <div
          key={`${viewMode}-${animationKey}`}
          className={`max-w-7xl mx-auto ${viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
            }`}
        >
          {/* List View Header */}
          {viewMode === "list" && paginatedProtocols.length > 0 && (
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Category</div>
              <div
                className="col-span-1 text-center cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-0.5"
                onClick={() => handleSort("rating")}
              >
                Rating
                <div className="flex flex-col items-center ml-1 gap-0.5">
                  <TriangleUp className={sortBy === "rating" && sortDirection === "asc" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"} />
                  <TriangleDown className={sortBy === "rating" && sortDirection === "desc" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"} />
                </div>
              </div>
              <div
                className="col-span-2 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-0.5"
                onClick={() => handleSort("score")}
              >
                Score
                <div className="flex flex-col items-center ml-1 gap-0.5">
                  <TriangleUp className={sortBy === "score" && sortDirection === "asc" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"} />
                  <TriangleDown className={sortBy === "score" && sortDirection === "desc" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"} />
                </div>
              </div>
              <div
                className="col-span-1 text-right cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-end gap-0.5"
                onClick={() => handleSort("tvl")}
              >
                TVL
                <div className="flex flex-col items-center ml-1 gap-0.5">
                  <TriangleUp className={sortBy === "tvl" && sortDirection === "asc" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"} />
                  <TriangleDown className={sortBy === "tvl" && sortDirection === "desc" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"} />
                </div>
              </div>
              <div
                className="col-span-2 text-left pl-6 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-0.5"
                onClick={() => handleSort("tvl-change")}
              >
                TVL Change (7d)
                <div className="flex flex-col items-center ml-1 gap-0.5">
                  <TriangleUp className={sortBy === "tvl-change" && sortDirection === "asc" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"} />
                  <TriangleDown className={sortBy === "tvl-change" && sortDirection === "desc" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"} />
                </div>
              </div>
            </div>
          )}

          {paginatedProtocols.length === 0 ? (
            <div className="col-span-full bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No protocols found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            paginatedProtocols.map((protocol, index) => {
              const badges = getBadges(protocol);
              return (
                <div
                  key={protocol.id}
                  className={`group relative bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${getHoverBorderColor(protocol.rating)} transition-[transform,shadow,border-color] duration-300 hover:shadow-2xl cursor-pointer overflow-hidden ${viewMode === "grid" ? "hover:-translate-y-2" : "hover:shadow-lg"
                    } animate-fade-in-up`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  onClick={() => window.location.href = `/protocols/${protocol.slug}`}
                >
                  {/* Hover Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {viewMode === "grid" ? (
                    <div className="relative p-6 space-y-4">
                      {/* Grid View Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                            {(protocol.logo?.startsWith('http') || protocol.logo?.startsWith('/')) ? (
                              <Image src={protocol.logo} alt={protocol.name} width={48} height={48} className="w-full h-full object-contain rounded-full" unoptimized />
                            ) : (
                              protocol.logo
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {protocol.name}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProtocol(protocol);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                              >
                                <Info className="w-4 h-4 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">{protocol.category}</span>
                              {badges.map((badge, idx) => {
                                const Icon = badge.icon;
                                return (
                                  <span
                                    key={idx}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}
                                  >
                                    <Icon className="w-3 h-3" />
                                    {badge.text}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className={`px-4 py-2 text-xl rounded-lg font-bold ${getRatingColor(protocol.rating)} shadow-md`}>
                          {protocol.rating}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {protocol.description}
                      </p>

                      {/* Metrics */}
                      <div className="grid grid-cols-12 gap-2 pt-2">
                        <div className="col-span-5">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Score</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getRiskBarColor(protocol.rating)} transition-all duration-500`}
                                style={{ width: `${protocol.score}%` }}
                              />
                            </div>
                            <span className={`w-9 h-9 rounded-full border-2 ${getScoreStyle(protocol.rating).bg} ${getScoreStyle(protocol.rating).border} ${getScoreStyle(protocol.rating).shadow} flex items-center justify-center ${getScoreStyle(protocol.rating).text} text-xs font-bold ring-1 ring-white/20 dark:ring-white/10 shrink-0 [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.8),_0_0_4px_rgb(0_0_0_/_0.5)]`}>
                              {protocol.score}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">TVL</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white truncate">{protocol.tvl}</div>
                        </div>
                        <div className="col-span-4">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 whitespace-nowrap">TVL Change (7d)</div>
                          {typeof protocol.tvlChange7d === 'number' && (
                            <div className="flex items-center h-7">
                              <span className={`text-sm font-semibold ${getTvlChangeColor(protocol.tvlChange7d)}`}>
                                {protocol.tvlChange7d > 0 ? '+' : ''}{protocol.tvlChange7d.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="relative p-4">
                      {/* List View - Grid Layout */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Logo & Name */}
                        <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl shrink-0">
                            {(protocol.logo?.startsWith('http') || protocol.logo?.startsWith('/')) ? (
                              <Image src={protocol.logo} alt={protocol.name} width={48} height={48} className="w-full h-full object-contain rounded-full" unoptimized />
                            ) : (
                              protocol.logo
                            )}
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                              {protocol.name}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProtocol(protocol);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                            >
                              <Info className="w-4 h-4 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400" />
                            </button>
                          </div>
                        </div>

                        {/* Category */}
                        <div className="col-span-6 md:col-span-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {protocol.category}
                          </span>
                        </div>

                        {/* Rating Badge */}
                        <div className="col-span-6 md:col-span-1 flex md:justify-center">
                          <div className={`px-3 py-1 text-lg rounded-lg font-bold ${getRatingColor(protocol.rating)} shadow-md inline-block`}>
                            {protocol.rating}
                          </div>
                        </div>

                        {/* Score Display */}
                        <div className="col-span-12 md:col-span-2">
                          <div className="flex items-center gap-3">
                            <span className={`w-9 h-9 rounded-full border-2 ${getScoreStyle(protocol.rating).bg} ${getScoreStyle(protocol.rating).border} ${getScoreStyle(protocol.rating).shadow} flex items-center justify-center ${getScoreStyle(protocol.rating).text} text-xs font-bold ring-1 ring-white/20 dark:ring-white/10 shrink-0 [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.8),_0_0_4px_rgb(0_0_0_/_0.5)]`}>
                              {protocol.score}
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getRiskBarColor(protocol.rating)} transition-all duration-500`}
                                style={{ width: `${protocol.score}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* TVL */}
                        <div className="col-span-6 md:col-span-1 text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{protocol.tvl}</div>
                        </div>

                        {/* Trend */}
                        <div className="col-span-6 md:col-span-2 flex items-center justify-start pl-6 gap-2">
                          {typeof protocol.tvlChange7d === 'number' && (
                            <>
                              <div className="w-32">
                                <TvlSparkline data={protocol.tvlHistory} change={protocol.tvlChange7d} />
                              </div>
                              <span className={`text-xs font-semibold ${getTvlChangeColor(protocol.tvlChange7d)}`}>
                                {protocol.tvlChange7d > 0 ? '+' : ''}{protocol.tvlChange7d.toFixed(1)}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${currentPage === pageNum
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}

        {/* Methodology Link */}
        <div className="max-w-7xl mx-auto text-center pb-8">
          <Link
            href="/research/methodology-rating-defi-protocols"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Info className="w-4 h-4" />
            Learn about our rating methodology
          </Link>
        </div>
      </main>

      {/* Info Modal */}
      {selectedProtocol && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedProtocol(null)}
        >
          <div
            className="bg-gray-100 dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl">
                  {(selectedProtocol.logo?.startsWith('http') || selectedProtocol.logo?.startsWith('/')) ? (
                    <Image src={selectedProtocol.logo} alt={selectedProtocol.name} width={64} height={64} className="w-full h-full object-contain rounded-full" unoptimized />
                  ) : (
                    selectedProtocol.logo
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProtocol.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{selectedProtocol.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProtocol(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">About</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedProtocol.description}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Risk Rating</div>
                  <div className={`text-2xl font-bold ${getRatingTextColor(selectedProtocol.rating)}`}>
                    {selectedProtocol.rating}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Score</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedProtocol.score}/100
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Value Locked</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProtocol.tvl}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Audit Status</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedProtocol.auditStatus || "Not Available"}
                  </div>
                </div>
              </div>

              {/* Chains */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Supported Chains</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProtocol.chains.map((chain) => (
                    <span
                      key={chain}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                    >
                      {chain}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {(selectedProtocol.websiteUrl || selectedProtocol.docsUrl || selectedProtocol.twitterUrl) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Official Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProtocol.websiteUrl && (
                      <a
                        href={selectedProtocol.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        Website <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {selectedProtocol.docsUrl && (
                      <a
                        href={selectedProtocol.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        Docs <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href={`/protocols/${selectedProtocol.slug}`}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                >
                  View Full Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
