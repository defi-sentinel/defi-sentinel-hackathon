import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { notFound } from "next/navigation";

// ... imports remain the same but removed Image, Link, etc if already there. 
// Actually I need to add these imports at the top. I will do a multi-replace or just replace the whole file? 
// It's safer to just replace the rendering part and add imports.
// But imports are at line 1.
// Let's replace the whole file content for cleanliness or use multi-replace.
// I'll stick to replacing the render part first, but I need to start with imports.

// Wait, I can't just replace the render part because I need to add imports at top.
// I will use multi_replace_file_content to add imports and change render.

import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getAllArticles } from "@/lib/cms";
import ArticleUnlockPanel from "@/components/ArticleUnlockPanel";
import { Clock, Calendar, ArrowLeft, Lock, Share2, BookOpen } from "lucide-react";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${article.title} | DeFi Sentinel Research`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
    return null; // TS fix
  }

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

  // Get related articles (same tags)
  const relatedArticles = getAllArticles()
    .filter((a) => a.id !== article.id)
    .filter((a) => (a.tags || []).some((tag) => (article.tags || []).includes(tag)))
    .slice(0, 3);

  // If content is empty/stripped, it means it's locked
  const isLocked = article.isPaid && !article.content;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      <main className="container mx-auto px-4 py-12">
        <article className="relative max-w-4xl mx-auto">



          {/* Back Button (Mobile - Inline) */}
          <div className="xl:hidden mb-6">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold">
                {article.category || 'Research'}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[article.difficulty || 'intermediate']
                  }`}
              >
                {difficultyLabels[article.difficulty || 'intermediate']}
              </span>
              {article.isPaid ? (
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Member Only
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                  Free
                </span>
              )}
            </div>

            {/* Title & Back Button */}
            <div className="relative">
              <div className="hidden xl:block absolute -left-24 top-1">
                <Link
                  href="/research"
                  className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all shadow-sm hover:shadow-md flex items-center justify-center group"
                  title="Back to Research Hub"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {article.title}
              </h1>
            </div>

            {/* Summary */}
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {article.summary}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between py-4 border-y border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-6">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-700">
                    <Image
                      src="/images/logos/logo.png"
                      alt={article.author?.name || 'DeFi Sentinel'}
                      width={48}
                      height={48}
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {article.author?.name || 'DeFi Sentinel'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {article.author?.role || 'Research Team'}
                    </div>
                  </div>
                </div>

                {/* Date & Read Time */}
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime || '5'} min read</span>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </header>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content or Unlock Panel */}
          <div className="mb-12">
            {isLocked ? (
              <ArticleUnlockPanel slug={article!!.slug} previewText={article!!.summary} />
            ) : (
              <div className="prose prose-lg dark:prose-invert max-w-none prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-img:rounded-xl">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {article!!.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-gray-200 dark:border-gray-700">
            {(article.tags || []).map((tag, index) => (
              <Link
                key={index}
                href={`/research?tag=${tag}`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg text-sm font-medium transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Author Bio */}
          {
            article.author?.bio && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-12 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  About the Author
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <Image
                      src="/images/logos/logo.png"
                      alt={article.author?.name || 'Author'}
                      width={64}
                      height={64}
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                      {article.author?.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {article.author?.role}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{article.author?.bio}</p>
                  </div>
                </div>
              </div>
            )
          }

          {/* Related Articles */}
          {
            relatedArticles.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/research/${related.slug}`}
                      className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-emerald-500 transition-all"
                    >
                      {related.coverImage && (
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={related.coverImage}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {related.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {related.readTime} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          }
        </article >
      </main >

      {/* Footer */}
      < footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-12 mt-20" >
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 DeFi Sentinel. All rights reserved.</p>
          </div>
        </div>
      </footer >
    </div >
  );
}
