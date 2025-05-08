export function BlogListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Öne Çıkan Makale Skeleton */}
      <div className="mb-12">
        <div className="h-8 w-64 bg-gray-200 rounded-md mb-6 animate-pulse"></div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <div className="h-64 md:h-80 bg-gray-300 animate-pulse"></div>
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="h-4 w-32 bg-gray-200 rounded-md mb-3 animate-pulse"></div>
              <div className="h-8 w-full bg-gray-200 rounded-md mb-4 animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md mb-2 animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-6 animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Son Makaleler Skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded-md mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-300 animate-pulse"></div>
              <div className="p-6">
                <div className="h-4 w-32 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
                <div className="h-6 w-full bg-gray-200 rounded-md mb-2 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded-md mb-2 animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
