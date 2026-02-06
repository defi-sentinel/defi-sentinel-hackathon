"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Article } from "@/lib/types";
import { Clock, Lock } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  viewMode?: "grid" | "list";
  onTagClick?: (tag: string) => void;
  onDifficultyClick?: (difficulty: string) => void;
  onCategoryClick?: (category: string) => void;
}

export default function ArticleCard({ article, viewMode = "grid", onTagClick, onDifficultyClick, onCategoryClick }: ArticleCardProps) {
  const router = useRouter();

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const difficultyLabels = {
    easy: "Easy",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  const handleCardClick = () => {
    router.push(`/research/${article.slug}`);
  };

  // List view layout (horizontal)
  if (viewMode === "list") {
    return (
      <div
        onClick={handleCardClick}
        className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Cover Image - Smaller on the left */}
          <div className="relative sm:w-64 h-40 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
            {article.coverImage && (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="256px"
              />
            )}
            {article.isPaid && (
              <div className="absolute top-3 right-3 p-2 bg-black/70 backdrop-blur-sm rounded-full">
                <Lock className="w-4 h-4 text-yellow-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col">
            {/* Category & Difficulty Badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (article.category) onCategoryClick?.(article.category);
                }}
                className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors"
              >
                {article.category || 'Research'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (article.difficulty) onDifficultyClick?.(article.difficulty);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity ${difficultyColors[article.difficulty || 'intermediate']
                  }`}
              >
                {difficultyLabels[article.difficulty || 'intermediate']}
              </button>
              {article.isPaid ? (
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Member Only
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                  Free
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
              {article.title}
            </h3>

            {/* Summary */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-auto line-clamp-2">
              {article.summary}
            </p>

            {/* Meta Information & Tags */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap gap-2">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime || '5'} min read</span>
                </div>
                <div>
                  {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }) : 'N/A'}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {(article.tags || []).slice(0, 3).map((tag, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTagClick?.(tag);
                    }}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view layout (original vertical)
  return (
    <div
      onClick={handleCardClick}
      className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col"
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {article.isPaid && (
          <div className="absolute top-3 right-3 p-2 bg-black/70 backdrop-blur-sm rounded-full">
            <Lock className="w-4 h-4 text-yellow-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category & Difficulty Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (article.category) onCategoryClick?.(article.category);
            }}
            className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors"
          >
            {article.category || 'Research'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (article.difficulty) onDifficultyClick?.(article.difficulty);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity ${difficultyColors[article.difficulty || 'intermediate']
              }`}
          >
            {difficultyLabels[article.difficulty || 'intermediate']}
          </button>
          {article.isPaid ? (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Member Only
            </span>
          ) : (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
              Free
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {article.summary}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime || '5'} min read</span>
            </div>
            <div>
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) : 'N/A'}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(article.tags || []).slice(0, 3).map((tag, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick?.(tag);
              }}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
