export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <main className="container mx-auto px-4 py-12 space-y-20">

        {/* Hero Section Skeleton */}
        <section className="text-center max-w-5xl mx-auto pt-8 animate-pulse">
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-6 max-w-3xl"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-4 max-w-2xl"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-10 max-w-xl"></div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </section>

        {/* Featured Article Section Skeleton */}
        <section className="max-w-6xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col md:flex-row animate-pulse">
            <div className="md:w-1/2 bg-gray-200 dark:bg-gray-700 p-12 min-h-[400px]"></div>
            <div className="md:w-1/2 p-8 md:p-12 space-y-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Intelligence Panels Skeleton */}
        <section className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                <div className="space-y-4">
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Protocols Table Skeleton */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>

          <div className="overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 space-y-4 animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </section>

        {/* Academy & Guides Carousel Skeleton */}
        <section className="max-w-6xl mx-auto">
          <div className="mb-6 px-1">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-800 rounded-[32px] min-h-[320px] animate-pulse"></div>
        </section>

        {/* Partner CTA Section Skeleton */}
        <section className="max-w-6xl mx-auto pb-12">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8 md:p-12 min-h-[200px] animate-pulse"></div>
        </section>

      </main>
    </div>
  );
}
