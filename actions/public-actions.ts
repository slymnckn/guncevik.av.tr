"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server" // Doğru import
import { getCachedOrFetch, invalidateCache } from "@/lib/redis-cache"

// Tüm blog yazılarını getir
export async function getPublicBlogPosts() {
  const supabase = await createServerSupabaseClient() // createClient yerine createServerSupabaseClient kullanıldı

  const cacheKey = `public-blog-posts` // createCacheKey yerine doğrudan string kullanıldı

  try {
    const data = await getCachedOrFetch(
      cacheKey,
      async () => {
        const { data, error } = await supabase
          .from("blog_posts")
          .select(
            `
           id, title, slug, excerpt, content, published_at, updated_at, image_path, view_count, category_id,
           blog_categories(id, name, slug)
         `,
          )
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
  return getCachedOrFetch(
    `popular-blog-posts-{"limit":${limit}}`,
    async () => {
      const supabase = await createServerSupabaseClient()
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
           id, title, slug, excerpt, published_at, image_path, view_count,
           blog_categories(id, name, slug)
         `,
        )
        .eq("published", true)
        .order("view_count", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("[getPopularBlogPosts] Error:", error)
        return []
      }
      return data
    },
    3600,
  )
}

// Blog yazısı önbelleğini temizle
export async function invalidateBlogCache(slug?: string) {
  try {
    // Belirli bir blog yazısı için önbelleği temizle
    if (slug) {
      await invalidateCache(`blog-post-${slug}`) // createCacheKey yerine doğrudan string kullanıldı
    }

    // Tüm blog yazıları listesi önbelleğini temizle
    await invalidateCache(`public-blog-posts`) // createCacheKey yerine doğrudan string kullanıldı

    // Popüler blog yazıları önbelleğini temizle
    await invalidateCache(`popular-blog-posts-{"limit":5}`) // createCacheKey yerine doğrudan string kullanıldı

    return { success: true }
  } catch (error) {
    console.error("Blog önbelleği temizleme hatası:", error)
    return { success: false, error: "Blog önbelleği temizlenemedi" }
  }
}
