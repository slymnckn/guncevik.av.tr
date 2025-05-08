export function BlogSidebarSkeleton() {
  return (
    <div className="space-y-8">
      {/* Arama Kutusu Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 w-24 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      {/* Kategoriler Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 w-32 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-5 w-full bg-gray-200 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Popüler Yazılar Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 w-40 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-3">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="flex-grow">
                <div className="h-5 w-full bg-gray-200 rounded-md mb-2 animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Etiketler Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 w-36 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 8].map((item) => (
            <div key={item} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
