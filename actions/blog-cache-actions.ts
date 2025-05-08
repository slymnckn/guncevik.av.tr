"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getCachedOrFetch } from "@/lib/redis-cache"

// Önbellek anahtarı önekleri
const BLOG_CACHE_PREFIX = "blog"
const BLOG_POST_KEY = (slug: string) => `${BLOG_CACHE_PREFIX}:post:${slug}`
const BLOG_POSTS_KEY = (page: number, limit: number) => `${BLOG_CACHE_PREFIX}:posts:${page}:${limit}`
const BLOG_CATEGORY_POSTS_KEY = (categorySlug: string, page: number, limit: number) =>
  `${BLOG_CACHE_PREFIX}:category:${categorySlug}:${page}:${limit}`
const BLOG_TAG_POSTS_KEY = (tagSlug: string, page: number, limit: number) =>
  `${BLOG_CACHE_PREFIX}:tag:${tagSlug}:${page}:${limit}`

// Blog yazısını getir (önbellekli)
export async function getBlogPost(slug: string) {
  return getCachedOrFetch(
    BLOG_POST_KEY(slug),
    async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          blog_categories(*),
          blog_post_tags(
            blog_tags(*)
          )
        `)
        .eq("slug", slug)
        .eq("published", true)
        .single()

      if (error) {
        console.error("Blog yazısı getirme hatası:", error)
        return null
      }

      return data
    },
    60 * 60 * 12, // 12 saat önbellekte tut
  )
}

// Blog yazılarını getir (önbellekli)
export async function getBlogPosts(page = 1, limit = 10) {
  return getCachedOrFetch(
    BLOG_POSTS_KEY(page, limit),
    async () => {
      const supabase = createClient()
      const from = (page - 1) * limit
      const to = from + limit - 1

      // Toplam sayıyı al
      const { count } = await supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .eq("published", true)

      // Yazıları al
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          blog_categories(*),
          blog_post_tags(
            blog_tags(*)
          )
        `)
        .eq("published", true)
        .order("published_at", { ascending: false })
        .range(from, to)

      if (error) {
        console.error("Blog yazıları getirme hatası:", error)
        return { data: [], count: 0 }
      }

      return { data, count }
    },
    60 * 30, // 30 dakika önbellekte tut
  )
}

// Kategori bazlı blog yazılarını getir (önbellekli)
export async function getBlogPostsByCategory(categorySlug: string, page = 1, limit = 10) {
  return getCachedOrFetch(
    BLOG_CATEGORY_POSTS_KEY(categorySlug, page, limit),
    async () => {
      const supabase = createClient()
      const from = (page - 1) * limit
      const to = from + limit - 1

      // Kategoriyi bul
      const { data: category } = await supabase.from("blog_categories").select("id").eq("slug", categorySlug).single()

      if (!category) {
        return { data: [], count: 0, category: null }
      }

      // Toplam sayıyı al
      const { count } = await supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
        .eq("published", true)

      // Yazıları al
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          blog_categories(*),
          blog_post_tags(
            blog_tags(*)
          )
        `)
        .eq("category_id", category.id)
        .eq("published", true)
        .order("published_at", { ascending: false })
        .range(from, to)

      if (error) {
        console.error("Kategori blog yazıları getirme hatası:", error)
        return { data: [], count: 0, category: null }
      }

      return { data, count, category }
    },
    60 * 30, // 30 dakika önbellekte tut
  )
}

// Etiket bazlı blog yazılarını getir (önbellekli)
export async function getBlogPostsByTag(tagSlug: string, page = 1, limit = 10) {
  return getCachedOrFetch(
    BLOG_TAG_POSTS_KEY(tagSlug, page, limit),
    async () => {
      const supabase = createClient()
      const from = (page - 1) * limit
      const to = from + limit - 1

      // Etiketi bul
      const { data: tag } = await supabase
        .from("blog_tags")
        .select("id, name, slug, color")
        .eq("slug", tagSlug)
        .single()

      if (!tag) {
        return { data: [], count: 0, tag: null }
      }

      // Etiketle ilişkili yazı ID'lerini al
      const { data: postTags, error: postTagsError } = await supabase
        .from("blog_post_tags")
        .select("post_id")
        .eq("tag_id", tag.id)

      if (postTagsError || !postTags.length) {
        return { data: [], count: 0, tag }
      }

      const postIds = postTags.map((pt) => pt.post_id)

      // Toplam sayıyı al
      const { count } = await supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .in("id", postIds)
        .eq("published", true)

      // Yazıları al
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          blog_categories(*),
          blog_post_tags(
            blog_tags(*)
          )
        `)
        .in("id", postIds)
        .eq("published", true)
        .order("published_at", { ascending: false })
        .range(from, to)

      if (error) {
        console.error("Etiket blog yazıları getirme hatası:", error)
        return { data: [], count: 0, tag }
      }

      return { data, count, tag }
    },
    60 * 30, // 30 dakika önbellekte tut
  )
}

// Blog önbelleğini temizle
export async function invalidateBlogCache(slug?: string) {
  // Belirli bir blog yazısı için yeniden doğrula
  if (slug) {
    revalidatePath(`/makaleler/${slug}`)
  }

  // Tüm blog sayfalarını yeniden doğrula
  revalidatePath("/makaleler")
  revalidatePath("/makaleler/kategori/[slug]", "page")
  revalidatePath("/makaleler/etiket/[slug]", "page")

  return { success: true }
}

// Kategori önbelleğini temizle
export async function invalidateCategoryCache(slug?: string) {
  // Belirli bir kategori için yeniden doğrula
  if (slug) {
    revalidatePath(`/makaleler/kategori/${slug}`)
  }

  // Tüm blog sayfalarını yeniden doğrula
  revalidatePath("/makaleler")

  return { success: true }
}

// Etiket önbelleğini temizle
export async function invalidateTagCache(slug?: string) {
  // Belirli bir etiket için yeniden doğrula
  if (slug) {
    revalidatePath(`/makaleler/etiket/${slug}`)
  }

  // Tüm blog sayfalarını yeniden doğrula
  revalidatePath("/makaleler")

  return { success: true }
}
