import { createClient } from "@/lib/supabase/server"
import { getCachedOrFetch } from "@/lib/redis-cache"

export async function getPopularBlogPosts(limit = 5) {
  console.log(`[getPopularBlogPosts] Fetching popular posts with limit: ${limit}`)
  return getCachedOrFetch(
    `popular-blog-posts-{"limit":${limit}}`,
    async () => {
      console.log(`[getPopularBlogPosts] Cache miss for popular posts, fetching from DB.`)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`id, title, slug, image_path, published_at`)
        .eq("published", true)
        .order("view_count", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("[getPopularBlogPosts] Error fetching popular posts from DB:", error)
        return []
      }
      console.log(`[getPopularBlogPosts] Successfully fetched ${data.length} popular posts from DB.`)
      return data
    },
    60 * 60, // 1 saat önbellekte tut
  )
}
