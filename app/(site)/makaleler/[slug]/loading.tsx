import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { BlogSidebarSkeleton } from "@/components/skeletons/blog-sidebar-skeleton"

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="rounded-lg shadow-lg overflow-hidden p-6">
            <Skeleton className="h-6 w-32 mb-4" /> {/* Back to all articles link */}
            <Skeleton className="h-10 w-3/4 mb-4" /> {/* Title */}
            <Skeleton className="h-5 w-1/2 mb-6" /> {/* Metadata */}
            <Skeleton className="w-full h-80 rounded-lg mb-8" /> {/* Image */}
            <Skeleton className="h-5 w-1/3 mb-6" /> {/* Tags */}
            <Skeleton className="h-5 w-1/4 mb-6" /> {/* Share buttons */}
            <Skeleton className="h-6 w-full mb-4" /> {/* Excerpt */}
            <div className="space-y-4 mb-12">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center border-t border-gray-200 pt-8 mt-8">
              <Skeleton className="w-16 h-16 rounded-full mr-4" />
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="mt-12">
              <Skeleton className="h-7 w-48 mb-6" /> {/* Related Posts title */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="rounded-lg shadow-md overflow-hidden h-full">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
          <Card className="rounded-lg shadow-lg overflow-hidden p-6 mt-8">
            <Skeleton className="h-7 w-48 mb-6" /> {/* Comments section title */}
            <Skeleton className="h-24 w-full mb-4" /> {/* Comment form textarea */}
            <Skeleton className="h-10 w-24 ml-auto" /> {/* Comment form button */}
            <div className="space-y-6 mt-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <BlogSidebarSkeleton />
        </div>
      </div>
    </div>
  )
}
