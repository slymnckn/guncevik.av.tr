import type { Metadata } from "next"
import { BlogList } from "@/components/blog/blog-list"
import { BlogSidebar } from "@/components/blog-sidebar"
import { SectionHeader } from "@/components/section-header"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Makaleler | GÜN ÇEVİK Hukuk Bürosu",
  description: "Hukuki konularda bilgilendirici makaleler ve güncel hukuk haberleri.",
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page: string }
}) {
  const currentPage = Number(searchParams.page) || 1
  const pageSize = 6

  // Blog yazılarını getir
  const supabase = await createServerSupabaseClient()

  // Blog yazılarını getir
  const { data: posts, count } = await supabase
    .from("blog_posts")
    .select("*, blog_categories(*)", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false })
    .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)

  return (
    <div className="bg-gray-50">
      <SectionHeader
        title="Makaleler"
        description="Hukuki konularda bilgilendirici makaleler ve güncel hukuk haberleri"
      />

      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BlogList />
          </div>
          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
