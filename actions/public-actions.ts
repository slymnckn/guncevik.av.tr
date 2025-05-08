import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getCachedData, createCacheKey, invalidateCache } from "@/lib/cache"

// Tüm blog yazılarını getir
export async function getPublicBlogPosts() {
  const supabase = createServerComponentClient({ cookies })

  const cacheKey = createCacheKey("public-blog-posts")

  try {
    const data = await getCachedData(
      cacheKey,
      async () => {
        const { data, error } = await supabase
          .from("blog_posts")
          .select(`
            id, title, slug, excerpt, content, published_at, updated_at, image_path, view_count, category_id,
            blog_categories(id, name, slug)
          `)
          .eq("published", true)
          .order("published_at", { ascending: false })

        if (error) {
          console.error("Blog yazıları getirme hatası:", error)
          return { success: false, data: null, error: error.message }
        }

        return { success: true, data, error: null }
      },
      1800, // 30 dakika TTL
    )

    return data
  } catch (error) {
    console.error("Blog yazıları getirme hatası:", error)
    return { success: false, data: null, error: "Blog yazıları getirilemedi" }
  }
}

// Popüler blog yazılarını getir
export async function getPopularBlogPosts(limit = 5) {
  const supabase = createServerComponentClient({ cookies })

  const cacheKey = createCacheKey("popular-blog-posts", { limit })

  try {
    const data = await getCachedData(
      cacheKey,
      async () => {
        const { data, error } = await supabase
          .from("blog_posts")
          .select(`
            id, title, slug, excerpt, published_at, image_path, view_count,
            blog_categories(id, name, slug)
          `)
          .eq("published", true)
          .order("view_count", { ascending: false })
          .limit(limit)

        if (error) {
          console.error("Popüler blog yazıları getirme hatası:", error)
          return { success: false, data: null, error: error.message }
        }

        return { success: true, data, error: null }
      },
      3600, // 1 saat TTL
    )

    return data
  } catch (error) {
    console.error("Popüler blog yazıları getirme hatası:", error)
    return { success: false, data: null, error: "Popüler blog yazıları getirilemedi" }
  }
}

// Blog yazısı önbelleğini temizle
export async function invalidateBlogCache(slug?: string) {
  try {
    // Belirli bir blog yazısı için önbelleği temizle
    if (slug) {
      await invalidateCache(createCacheKey(`blog-post-${slug}`))
    }

    // Tüm blog yazıları listesi önbelleğini temizle
    await invalidateCache(createCacheKey("public-blog-posts"))

    // Popüler blog yazıları önbelleğini temizle
    await invalidateCache(createCacheKey("popular-blog-posts", { limit: 5 }))

    return { success: true }
  } catch (error) {
    console.error("Blog önbelleği temizleme hatası:", error)
    return { success: false, error: "Blog önbelleği temizlenemedi" }
  }
}
