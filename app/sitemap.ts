import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guncevik.av.tr"

  // Sitemap.ts dosyasındaki staticPages dizisinden referanslar sayfasını kaldıralım

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
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })

  // Blog kategorilerini getir
  const { data: categories } = await supabase.from("blog_categories").select("slug").eq("is_active", true)

  // Blog etiketlerini getir
  const { data: tags } = await supabase.from("blog_tags").select("slug").eq("is_active", true)

  // Blog yazıları için sitemap girişleri
  const blogEntries =
    blogPosts?.map((post) => ({
      url: `${baseUrl}/makaleler/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || []

  // Kategori sayfaları için sitemap girişleri
  const categoryEntries =
    categories?.map((category) => ({
      url: `${baseUrl}/makaleler/kategori/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })) || []

  // Etiket sayfaları için sitemap girişleri
  const tagEntries =
    tags?.map((tag) => ({
      url: `${baseUrl}/makaleler/etiket/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })) || []

  // Tüm girişleri birleştir
  return [...staticPages, ...blogEntries, ...categoryEntries, ...tagEntries]
}
