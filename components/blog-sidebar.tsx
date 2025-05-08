import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { PopularTags } from "@/components/popular-tags"

export async function BlogSidebar() {
  const supabase = createServerSupabaseClient()

  // Kategorileri getir
  const { data: categories } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true })

  // Son yazıları getir
  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      {/* Kategoriler */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Kategoriler</h3>
        <ul className="space-y-2">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/makaleler/kategori/${category.slug}`}
                  className="text-gray-700 hover:text-primary transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {category.name}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500">Henüz kategori bulunmamaktadır.</li>
          )}
        </ul>
      </div>

      {/* Son Yazılar */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Son Yazılar</h3>
        <ul className="space-y-4">
          {recentPosts && recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/makaleler/${post.slug}`} className="group">
                  <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(post.published_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500">Henüz yazı bulunmamaktadır.</li>
          )}
        </ul>
      </div>

      {/* Popüler Etiketler */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Popüler Etiketler</h3>
        <PopularTags />
      </div>
    </div>
  )
}
