import { strategies } from './strategies';
import { projects, risks } from './projects';
import { articles } from './articles';
import { Strategy, Article, Project, RiskAnalysis } from '@/lib/types';

export { strategies } from './strategies';
export { projects, risks } from './projects';
export { articles } from './articles';

// Helper function to group strategies by class
export function getStrategyClasses() {
    const classMap = new Map<string, {
        id: string; // Use class name as ID for grouping
        name: string;
        rating: string;
        riskLevel: 'Low' | 'Middle' | 'High';
        apyRange: { min: number; max: number };
        strategies: Strategy[];
    }>();

    strategies.forEach(strategy => {
        const className = strategy.strategyClass || strategy.name;

        if (!classMap.has(className)) {
            classMap.set(className, {
                id: className,
                name: className,
                rating: strategy.rating || 'N/A',
                riskLevel: strategy.riskLevel,
                apyRange: { min: strategy.apy, max: strategy.apy },
                strategies: []
            });
        }

        const classData = classMap.get(className)!;
        classData.strategies.push(strategy);
        classData.apyRange.min = Math.min(classData.apyRange.min, strategy.apy);
        classData.apyRange.max = Math.max(classData.apyRange.max, strategy.apy);
    });

    return Array.from(classMap.values());
}

export function getRatingColor(rating: string): string {
    const colors: Record<string, string> = {
        AAA: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
        AA: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
        A: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30",
        BBB: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
        BB: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
        B: "text-red-700 bg-red-200 dark:text-red-500 dark:bg-red-900/40",
        CCC: "text-red-800 bg-red-300 dark:text-red-600 dark:bg-red-900/50",
        D: "text-gray-800 bg-gray-300 dark:text-gray-400 dark:bg-gray-700",
    };
    return colors[rating] || colors.BBB;
}

export function getRatingDotColor(rating: string): string {
    const colors: Record<string, string> = {
        AAA: "bg-green-500",
        AA: "bg-emerald-500",
        A: "bg-yellow-500",
        BBB: "bg-orange-500",
        BB: "bg-red-500",
        B: "bg-red-600",
        CCC: "bg-red-700",
        D: "bg-gray-500",
    };
    return colors[rating] || colors.BBB;
}

export function getRatingScore(rating: string): number {
    const scoreMap: Record<string, number> = {
        AAA: 97,
        AA: 87,
        A: 77,
        BBB: 72,
        BB: 65,
        B: 55,
        CCC: 45,
        D: 20,
    };
    return scoreMap[rating] || 50;
}

export function getScoreColor(score: number): string {
    if (score >= 95) return "text-green-600 dark:text-green-400";
    if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 75) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 65) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
}

export function getScoreBgColor(score: number): string {
    if (score >= 95) return "bg-green-500";
    if (score >= 85) return "bg-emerald-500";
    if (score >= 75) return "bg-yellow-500";
    if (score >= 65) return "bg-orange-500";
    return "bg-red-500";
}

export function getArticleBySlug(slug: string): Article | undefined {
    return articles.find(a => a.slug === slug);
}

export function getAllArticles(): Article[] {
    return articles;
}

// Get score styling based on score number
export function getScoreStyle(score: number): { bg: string; border: string; shadow: string; text: string } {
    if (score > 80) { // Low Risk (Green/Emerald)
        if (score >= 95) { // AAA equivalent
            return {
                bg: "bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500",
                border: "border-green-400 dark:border-green-300",
                shadow: "shadow-lg shadow-green-500/20 dark:shadow-green-400/20",
                text: "text-white"
            };
        }
        // AA/A equivalent
        return {
            bg: "bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500",
            border: "border-emerald-400 dark:border-emerald-300",
            shadow: "shadow-lg shadow-emerald-500/20 dark:shadow-emerald-400/20",
            text: "text-white"
        };
    }

    if (score > 60) { // Middle Risk (Yellow/Orange)
        if (score > 70) {
            return {
                bg: "bg-gradient-to-br from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500",
                border: "border-yellow-400 dark:border-yellow-300",
                shadow: "shadow-lg shadow-yellow-500/20 dark:shadow-yellow-400/20",
                text: "text-white"
            };
        }
        return {
            bg: "bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-500",
            border: "border-orange-400 dark:border-orange-300",
            shadow: "shadow-lg shadow-orange-500/20 dark:shadow-orange-400/20",
            text: "text-white"
        };
    }

    // High Risk (Red)
    return {
        bg: "bg-gradient-to-br from-red-600 to-red-800 dark:from-red-500 dark:to-red-700",
        border: "border-red-500 dark:border-red-400",
        shadow: "shadow-lg shadow-red-600/20 dark:shadow-red-500/20",
        text: "text-white"
    };
}
