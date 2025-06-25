import { BlogListSkeleton } from "@/components/skeletons/blog-list-skeleton"
import { BlogSidebarSkeleton } from "@/components/skeletons/blog-sidebar-skeleton"
import { SectionHeader } from "@/components/section-header"

export default function Loading() {
  return (
    <div className="bg-gray-50">
      <SectionHeader
        title="Makaleler Yükleniyor..."
        description="Hukuki konularda bilgilendirici makaleler ve güncel hukuk haberleri yükleniyor."
      />

      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BlogListSkeleton />
          </div>
          <div className="lg:col-span-1">
            <BlogSidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
