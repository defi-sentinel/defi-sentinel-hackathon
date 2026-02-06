export default function ProtocolDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* Back Button Skeleton */}
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-40"></div>
        </div>

        {/* Header Section Skeleton */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Logo */}
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>

            {/* Header Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mechanics Section Skeleton */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
          <div className="space-y-4">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </section>

        {/* Performance & Risks Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
            <div className="space-y-4">
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risks */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
            <div className="space-y-4">
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section Skeleton */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
          <div className="space-y-4">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Governance Section Skeleton */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
          <div className="space-y-4">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Section Skeleton */}
        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
          <div className="space-y-4">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Insights Skeleton */}
        <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-purple-200 dark:border-gray-700 shadow-sm animate-pulse">
          <div className="space-y-4">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
