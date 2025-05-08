import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { TrendingUp, Clock } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function BlogList() {
  const supabase = createServerSupabaseClient()

  // Blog yazılarını getir
  const { data: posts, count } = await supabase
    .from("blog_posts")
    .select("*, blog_categories(*)", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(10)

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">Henüz makale bulunmamaktadır.</p>
      </div>
    )
  }

  // Görsellerin URL'lerini oluştur
  const postsWithImages = await Promise.all(
    posts.map(async (post) => {
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

  // İlk makaleyi öne çıkan makale olarak ayarla
  const featuredPost = postsWithImages && postsWithImages.length > 0 ? postsWithImages[0] : null
  // Diğer makaleleri listele
  const otherPosts = postsWithImages && postsWithImages.length > 1 ? postsWithImages.slice(1) : []

  return (
    <>
      {/* Öne Çıkan Makale */}
      {featuredPost && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-primary" /> Öne Çıkan Makale
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={featuredPost.imageUrl || "/placeholder.svg?height=600&width=800&query=law+office"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.blog_categories?.name || "Genel"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{featuredPost.date}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  <Link href={`/makaleler/${featuredPost.slug}`} className="hover:text-primary transition-colors">
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <Button asChild className="w-fit">
                  <Link href={`/makaleler/${featuredPost.slug}`}>Devamını Oku</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Clock className="mr-2 h-6 w-6 text-primary" /> Son Makaleler
      </h2>
      {otherPosts && otherPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {otherPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg group"
            >
              <div className="relative h-48">
                <Image
                  src={post.imageUrl || "/placeholder.svg?height=400&width=600&query=law+document"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.blog_categories?.name || "Genel"}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/makaleler/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <Link
                  href={`/makaleler/${post.slug}`}
                  className="text-primary font-medium hover:text-primary/80 transition-colors inline-flex items-center"
                >
                  Devamını Oku
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Henüz makale bulunmamaktadır.</p>
        </div>
      )}
    </>
  )
}
