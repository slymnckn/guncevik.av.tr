import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { BlogSidebar } from "@/components/blog-sidebar"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: category } = await supabase.from("blog_categories").select("name").eq("slug", params.slug).single()

  if (!category) {
    return {
      title: "Kategori Bulunamadı | GÜN ÇEVİK Hukuk Bürosu",
      description: "Aradığınız kategori bulunamadı.",
    }
  }

  return {
    title: `${category.name} Makaleleri | GÜN ÇEVİK Hukuk Bürosu`,
    description: `GÜN ÇEVİK Hukuk Bürosu'nun ${category.name} kategorisindeki makaleleri.`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient()

  // Kategoriyi getir
  const { data: category } = await supabase.from("blog_categories").select("*").eq("slug", params.slug).single()

  if (!category) {
    notFound()
  }

  // Kategoriye ait blog yazılarını getir
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_categories(name, slug)
    `)
    .eq("published", true)
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Blog posts error:", error)
  }

  // Tüm kategorileri getir
  const { data: categories } = await supabase.from("blog_categories").select("*").eq("is_active", true).order("name")

  // Popüler makaleleri getir
  const { data: popularPosts } = await supabase
    .from("blog_posts")
    .select(`id, title, slug, published_at`)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(5)

  // Görsellerin URL'lerini oluştur
  const postsWithImages = await Promise.all(
    (posts || []).map(async (post) => {
      let imageUrl = null
      if (post.image_path) {
        const { data } = await supabase.storage.from("blog-images").getPublicUrl(post.image_path)
        imageUrl = data.publicUrl
      }
      return {
        ...post,
        imageUrl,
        date: post.published_at
          ? new Date(post.published_at).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : null,
      }
    }),
  )

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">{category.name}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {category.description || `${category.name} kategorisindeki makalelerimiz.`}
            </p>
          </div>

          {/* Arama Kutusu */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Makalelerde ara..."
                className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Button
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-1 h-8"
                size="sm"
              >
                Ara
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Ana İçerik - Makale Listesi */}
            <div className="lg:w-2/3">
              {postsWithImages && postsWithImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {postsWithImages.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                    >
                      {post.imageUrl && (
                        <div className="relative h-48">
                          <Image
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-primary font-medium">
                            {post.blog_categories?.name || "Genel"}
                          </span>
                          <span className="text-sm text-gray-500">{post.date}</span>
                        </div>
                        <h2 className="text-xl font-bold mb-2 line-clamp-2">
                          <Link href={`/makaleler/${post.slug}`} className="hover:text-primary transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/makaleler/${post.slug}`}>Devamını Oku</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">Bu kategoride henüz makale bulunmamaktadır.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <BlogSidebar categories={categories || []} popularPosts={popularPosts || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
