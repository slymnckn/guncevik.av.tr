import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { SiteWrapper } from "@/components/site-wrapper"
import { BlogCard } from "@/components/blog-card"
import { BlogSidebar } from "@/components/blog-sidebar"
import { getPopularBlogPosts } from "@/actions/public-actions"
import type { Metadata } from "next"

interface SearchPageProps {
  searchParams: { q?: string }
}

export const metadata: Metadata = {
  title: "Blog Arama | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu blog yazılarında arama yapın.",
}

export default async function BlogSearchPage({ searchParams }: SearchPageProps) {
  const supabase = createServerComponentClient({ cookies })
  const searchQuery = searchParams.q || ""

  // Kategorileri getir
  const { data: categories } = await supabase
    .from("blog_categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name")

  // Popüler yazıları getir
  const { data: popularPosts } = await getPopularBlogPosts(5)

  // Arama sorgusu varsa, blog yazılarını ara
  let searchResults = []
  if (searchQuery) {
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        blog_categories(name, slug)
      `)
      .eq("published", true)
      .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
      .order("published_at", { ascending: false })

    if (!error) {
      searchResults = posts
    }
  }

  return (
    <SiteWrapper>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold mb-6">
                {searchQuery ? `"${searchQuery}" için Arama Sonuçları` : "Blog Yazılarında Ara"}
              </h1>

              <form action="/makaleler/ara" method="get" className="mb-8">
                <div className="flex">
                  <input
                    type="text"
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Anahtar kelime girin..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-r-md hover:bg-primary/90 transition-colors"
                  >
                    Ara
                  </button>
                </div>
              </form>

              {searchQuery ? (
                <>
                  <p className="mb-6 text-gray-600">{searchResults.length} sonuç bulundu.</p>

                  {searchResults.length > 0 ? (
                    <div className="space-y-6">
                      {searchResults.map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Aramanızla eşleşen sonuç bulunamadı.</p>
                      <p className="text-gray-500 mt-2">Lütfen farklı anahtar kelimelerle tekrar deneyin.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Arama yapmak için yukarıdaki kutuya anahtar kelimeler girin.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <BlogSidebar categories={categories || []} popularPosts={popularPosts || []} />
          </div>
        </div>
      </div>
    </SiteWrapper>
  )
}
