export default function StrategiesLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
          <div className="p-6 space-y-6 animate-pulse">
            {/* Header */}
            <div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            </div>

            {/* Risk Level Sections */}
            {['Low Risk', 'Medium Risk', 'High Risk'].map((risk, idx) => (
              <div key={idx} className="space-y-3">
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                </div>

                {/* Strategy Cards */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-8 animate-pulse">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Strategy Header */}
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>

            {/* Steps Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-4"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>

            {/* Risk Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
