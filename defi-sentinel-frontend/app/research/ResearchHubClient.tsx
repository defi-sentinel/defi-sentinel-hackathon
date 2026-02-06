"use client";

import { useState, useMemo } from "react";
import { Article } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import { Search, X, Grid3x3, List, SlidersHorizontal, Lock } from "lucide-react";

interface ResearchHubClientProps {
    initialArticles: Article[];
}

export default function ResearchHubClient({ initialArticles }: ResearchHubClientProps) {
    // State for filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
    const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<"latest" | "earliest" | "popular">("latest");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);

    // Extract unique values for filters
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        initialArticles.forEach((article) => {
            (article.tags || []).forEach((tag) => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [initialArticles]);

    // Filter and sort articles
    const filteredArticles = useMemo(() => {
        let filtered = initialArticles;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (article) =>
                    article.title.toLowerCase().includes(query) ||
                    (article.summary || '').toLowerCase().includes(query) ||
                    (article.tags || []).some((tag) => tag.toLowerCase().includes(query))
            );
        }

        // Tag filter
        if (selectedTags.length > 0) {
            filtered = filtered.filter((article) =>
                selectedTags.some((tag) => (article.tags || []).includes(tag))
            );
        }

        // Difficulty filter
        if (selectedDifficulty.length > 0) {
            filtered = filtered.filter((article) =>
                selectedDifficulty.includes(article.difficulty || '')
            );
        }

        // Pricing filter
        if (selectedPricing.length > 0) {
            filtered = filtered.filter((article) => {
                if (selectedPricing.includes("free") && !article.isPaid) return true;
                if (selectedPricing.includes("member") && article.isPaid) return true;
                return false;
            });
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === "latest") {
                return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
            } else if (sortBy === "earliest") {
                return new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime();
            } else {
                // popular
                return ((b as any).popularity || 0) - ((a as any).popularity || 0);
            }
        });

        return sorted;
    }, [searchQuery, selectedTags, selectedDifficulty, selectedPricing, sortBy, initialArticles]);

    // Clear all filters
    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedTags([]);
        setSelectedDifficulty([]);
        setSelectedPricing([]);
    };

    const hasActiveFilters =
        searchQuery ||
        selectedTags.length > 0 ||
        selectedDifficulty.length > 0 ||
        selectedPricing.length > 0;

    // Toggle filter helpers
    const toggleArrayFilter = (
        value: string,
        selected: string[],
        setter: (val: string[]) => void
    ) => {
        if (selected.includes(value)) {
            setter(selected.filter((v) => v !== value));
        } else {
            setter([...selected, value]);
        }
    };

    const difficultyConfig = [
        { value: "easy", label: "Beginner", color: "bg-green-500" },
        { value: "intermediate", label: "Intermediate", color: "bg-yellow-500" },
        { value: "advanced", label: "Advanced", color: "bg-red-500" },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Research Academy</h1>
                        <p className="text-xl text-emerald-100 mb-8">
                            In-depth analysis, tutorials, and insights from our research team
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-transparent focus:border-emerald-400 focus:outline-none shadow-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Filter Toggle & Layout Controls */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showFilters || hasActiveFilters
                                ? "bg-emerald-600 text-white shadow-md"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-500"
                                }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                                    {selectedTags.length + selectedDifficulty.length + selectedPricing.length}
                                </span>
                            )}
                        </button>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                Clear all
                            </button>
                        )}

                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {filteredArticles.length}
                            </span>{" "}
                            {filteredArticles.length === 1 ? "article" : "articles"}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded transition-colors ${viewMode === "grid"
                                    ? "bg-white dark:bg-gray-700 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <Grid3x3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded transition-colors ${viewMode === "list"
                                    ? "bg-white dark:bg-gray-700 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-emerald-500 cursor-pointer transition-all hover:border-emerald-400 hover:shadow-md"
                        >
                            <option value="latest">Recently published</option>
                            <option value="earliest">Oldest first</option>
                            <option value="popular">Most popular</option>
                        </select>
                    </div>
                </div>

                {/* Filter Panel - Hidden by default */}
                {showFilters && (
                    <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm animate-slide-down">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-8">
                            {/* Difficulty Column */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                                    Difficulty
                                </h3>
                                <div className="space-y-3">
                                    {difficultyConfig.map((diff) => (
                                        <button
                                            key={diff.value}
                                            onClick={() =>
                                                toggleArrayFilter(diff.value, selectedDifficulty, setSelectedDifficulty)
                                            }
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${selectedDifficulty.includes(diff.value)
                                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500"
                                                : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                                }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${diff.color}`} />
                                            <span
                                                className={`text-sm font-medium ${selectedDifficulty.includes(diff.value)
                                                    ? "text-emerald-700 dark:text-emerald-400"
                                                    : "text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                {diff.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Topics Column */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                                    Topics
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleArrayFilter(tag, selectedTags, setSelectedTags)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${selectedTags.includes(tag)
                                                ? "bg-emerald-500 text-white shadow-md scale-105"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Access Column */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                                    Access
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() =>
                                            toggleArrayFilter("free", selectedPricing, setSelectedPricing)
                                        }
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all relative overflow-hidden group ${selectedPricing.includes("free")
                                            ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-500 dark:border-emerald-400 shadow-md"
                                            : "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md"
                                            }`}
                                    >
                                        <div className={`p-1.5 rounded-full transition-all ${selectedPricing.includes("free")
                                            ? "bg-emerald-500 dark:bg-emerald-400 scale-110"
                                            : "bg-blue-400 dark:bg-blue-500 group-hover:scale-110"
                                            }`}>
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span
                                            className={`text-sm font-medium transition-colors ${selectedPricing.includes("free")
                                                ? "text-emerald-700 dark:text-emerald-400"
                                                : "text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300"
                                                }`}
                                        >
                                            Free Access
                                        </span>
                                        {selectedPricing.includes("free") && (
                                            <span className="ml-auto px-2 py-0.5 bg-emerald-500 dark:bg-emerald-400 text-white text-xs font-bold rounded-full">
                                                Active
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        onClick={() =>
                                            toggleArrayFilter("member", selectedPricing, setSelectedPricing)
                                        }
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all relative overflow-hidden group ${selectedPricing.includes("member")
                                            ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-500 dark:border-yellow-400 shadow-md"
                                            : "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md"
                                            }`}
                                    >
                                        <div className={`p-1.5 rounded-full transition-all ${selectedPricing.includes("member")
                                            ? "bg-yellow-500 dark:bg-yellow-400 scale-110"
                                            : "bg-amber-400 dark:bg-amber-500 group-hover:scale-110"
                                            }`}>
                                            <Lock
                                                className={`w-3 h-3 ${selectedPricing.includes("member")
                                                    ? "text-white"
                                                    : "text-white"
                                                    }`}
                                            />
                                        </div>
                                        <span
                                            className={`text-sm font-medium transition-colors ${selectedPricing.includes("member")
                                                ? "text-yellow-700 dark:text-yellow-400"
                                                : "text-amber-700 dark:text-amber-400 group-hover:text-amber-800 dark:group-hover:text-amber-300"
                                                }`}
                                        >
                                            Member Only
                                        </span>
                                        {selectedPricing.includes("member") && (
                                            <span className="ml-auto px-2 py-0.5 bg-yellow-500 dark:bg-yellow-400 text-white text-xs font-bold rounded-full">
                                                Premium
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Articles Grid */}
                {filteredArticles.length > 0 ? (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "space-y-4"
                        }
                    >
                        {filteredArticles.map((article) => (
                            <div
                                key={article.id}
                                className="opacity-0 animate-fade-in"
                                style={{
                                    animation: 'fadeIn 0.4s ease-out forwards',
                                    animationDelay: '0.05s'
                                }}
                            >
                                <ArticleCard
                                    article={article}
                                    viewMode={viewMode}
                                    onTagClick={(tag) => {
                                        setShowFilters(true);
                                        if (!selectedTags.includes(tag)) {
                                            setSelectedTags([...selectedTags, tag]);
                                        }
                                    }}
                                    onDifficultyClick={(difficulty) => {
                                        setShowFilters(true);
                                        if (!selectedDifficulty.includes(difficulty)) {
                                            setSelectedDifficulty([...selectedDifficulty, difficulty]);
                                        }
                                    }}
                                    onCategoryClick={(category) => {
                                        setShowFilters(true);
                                        // Could add category filter in the future
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No articles found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your filters or search query
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </main>

        </div>
    );
}
