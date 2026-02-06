import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { MetadataRoute } from "next"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guncevik.av.tr"

  // Statik sayfalar
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hizmetlerimiz`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/makaleler`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/danismanlik`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/randevu`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sss`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    // Referanslar sayfası kaldırıldı
  ]

  // Blog yazılarını getir
  try {
    const supabase = await createServerSupabaseClient()

    const [{ data: blogPosts }, { data: categories }, { data: tags }] = await Promise.all([
      supabase
        .from("blog_posts")
        .select("slug, updated_at, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false }),
      supabase.from("blog_categories").select("slug").eq("is_active", true),
      supabase.from("blog_tags").select("slug").eq("is_active", true),
    ])

    const blogEntries =
      blogPosts?.map((post) => ({
        url: `${baseUrl}/makaleler/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })) || []

    const categoryEntries =
      categories?.map((category) => ({
        url: `${baseUrl}/makaleler/kategori/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })) || []

    const tagEntries =
      tags?.map((tag) => ({
        url: `${baseUrl}/makaleler/etiket/${tag.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })) || []

    return [...staticPages, ...blogEntries, ...categoryEntries, ...tagEntries]
  } catch {
    // Supabase bağlantısı yoksa sadece statik sayfaları döndür
    return staticPages
  }
}
