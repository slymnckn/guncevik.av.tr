import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { withRateLimit } from "@/app/api/rate-limit"
import { sanitizeHTML } from "@/lib/sanitize"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  return withRateLimit(req, async () => {
    try {
      const { searchParams } = new URL(req.url)
      const query = searchParams.get("q")
      const type = searchParams.get("type") || "all"
      const page = Number.parseInt(searchParams.get("page") || "1")
      const limit = Number.parseInt(searchParams.get("limit") || "10")
      const offset = (page - 1) * limit

      if (!query) {
        return NextResponse.json({ error: "Arama sorgusu gerekli" }, { status: 400 })
      }

      const supabase = createServerComponentClient({ cookies })
      const sanitizedQuery = sanitizeHTML(query)
      const searchTerm = `%${sanitizedQuery.toLowerCase()}%`

      let results = []
      let total = 0

      // Blog yazılarında arama
      if (type === "all" || type === "blog") {
        const {
          data: blogPosts,
          count: blogCount,
          error: blogError,
        } = await supabase
          .from("blog_posts")
          .select(
            `
            id, title, slug, excerpt, published_at, image_path, category_id,
            blog_categories(id, name, slug)
          `,
            { count: "exact" },
          )
          .eq("published", true)
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
          .order("published_at", { ascending: false })
          .range(offset, offset + limit - 1)

        if (blogError) {
          console.error("Blog arama hatası:", blogError)
        } else if (blogPosts) {
          results = blogPosts.map((post) => ({
            ...post,
            type: "blog",
            url: `/makaleler/${post.slug}`,
            date: post.published_at,
            category: post.blog_categories?.name || "Genel",
          }))
          total = blogCount || 0
        }
      }

      // Hizmetlerde arama
      if (type === "all" || type === "service") {
        const {
          data: services,
          count: serviceCount,
          error: serviceError,
        } = await supabase
          .from("services")
          .select("id, title, slug, description, icon", { count: "exact" })
          .eq("is_active", true)
          .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
          .order("title")
          .range(offset, offset + limit - 1)

        if (serviceError) {
          console.error("Hizmet arama hatası:", serviceError)
        } else if (services) {
          const serviceResults = services.map((service) => ({
            ...service,
            type: "service",
            url: `/hizmetlerimiz#${service.slug}`,
            excerpt: service.description,
          }))

          if (type === "service") {
            results = serviceResults
            total = serviceCount || 0
          } else {
            // Tüm sonuçları birleştir
            results = [...results, ...serviceResults]
            total += serviceCount || 0
          }
        }
      }

      // SSS'lerde arama
      if (type === "all" || type === "faq") {
        const {
          data: faqs,
          count: faqCount,
          error: faqError,
        } = await supabase
          .from("faqs")
          .select("id, question, answer, category", { count: "exact" })
          .eq("is_active", true)
          .or(`question.ilike.${searchTerm},answer.ilike.${searchTerm}`)
          .order("category")
          .range(offset, offset + limit - 1)

        if (faqError) {
          console.error("SSS arama hatası:", faqError)
        } else if (faqs) {
          const faqResults = faqs.map((faq) => ({
            ...faq,
            type: "faq",
            url: `/sss#faq-${faq.id}`,
            title: faq.question,
            excerpt: faq.answer,
            category: faq.category || "Genel",
          }))

          if (type === "faq") {
            results = faqResults
            total = faqCount || 0
          } else if (results.length < limit) {
            // Limit dolmadıysa SSS sonuçlarını ekle
            const remainingSpace = limit - results.length
            results = [...results, ...faqResults.slice(0, remainingSpace)]
            total += faqCount || 0
          }
        }
      }

      return NextResponse.json({
        results,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      })
    } catch (error) {
      console.error("Arama hatası:", error)
      return NextResponse.json({ error: "Arama işlemi sırasında bir hata oluştu" }, { status: 500 })
    }
  })
}
