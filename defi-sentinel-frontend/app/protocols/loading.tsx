export default function ProtocolsLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-64 mb-4"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-96"></div>
        </div>

        {/* Widgets Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
          {/* Featured Protocol Widget */}
          <div className="md:col-span-1 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-emerald-200 dark:border-gray-600">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>

          {/* Latest Rated Widget */}
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Widget */}
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter Bar Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Protocols Table Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="animate-pulse">
            {/* Table Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="grid grid-cols-12 gap-4 px-6 py-4">
                <div className="col-span-3 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="col-span-2 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="col-span-1 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>

            {/* Table Rows */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                  </div>
                  <div className="col-span-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-8 flex justify-center gap-2 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
