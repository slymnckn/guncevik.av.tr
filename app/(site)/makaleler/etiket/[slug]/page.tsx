import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { BlogSidebar } from "@/components/blog-sidebar"
import { BlogCard } from "@/components/blog-card"
import { getPopularBlogPosts } from "@/actions/public-actions"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: tag } = await supabase.from("blog_tags").select("name").eq("slug", params.slug).single()

  if (!tag) {
    return {
      title: "Etiket Bulunamadı | GÜN ÇEVİK Hukuk Bürosu",
      description: "Aradığınız etiket bulunamadı.",
    }
  }

  return {
    title: `${tag.name} Etiketli Makaleler | GÜN ÇEVİK Hukuk Bürosu`,
    description: `GÜN ÇEVİK Hukuk Bürosu'nun ${tag.name} etiketli makaleleri.`,
  }
}

export default async function BlogTagPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Etiketi getir
    const { data: tag, error: tagError } = await supabase.from("blog_tags").select("*").eq("slug", params.slug).single()

    if (tagError || !tag) {
      console.error("Etiket bulunamadı:", tagError)
      notFound()
    }

    // Bu etikete sahip blog yazılarını getir
    const { data: postTags, error: postTagsError } = await supabase
      .from("blog_post_tags")
      .select("post_id")
      .eq("tag_id", tag.id)

    if (postTagsError) {
      console.error("Etiketli yazılar getirilirken hata oluştu:", postTagsError)
      notFound()
    }

    const postIds = postTags.map((item) => item.post_id)

    // Blog yazılarını getir
    let posts = []
    if (postIds.length > 0) {
      const { data: postsData, error: postsError } = await supabase
        .from("blog_posts")
        .select(
          `
          *,
          blog_categories(name, slug)
        `,
        )
        .in("id", postIds)
        .eq("published", true)
        .order("published_at", { ascending: false })

      if (postsError) {
        console.error("Blog yazıları getirilirken hata oluştu:", postsError)
      } else {
        posts = postsData
      }
    }

    // Kategorileri getir (sidebar için)
    const { data: categories } = await supabase
      .from("blog_categories")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("name")

    // Popüler yazıları getir (sidebar için)
    const { data: popularPosts } = await getPopularBlogPosts(5)

    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">"{tag.name}" Etiketli Makaleler</h1>
              {tag.description && <p className="text-gray-600">{tag.description}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6">
              {posts.length > 0 ? (
                posts.map((post) => <BlogCard key={post.id} post={post} />)
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">Bu etiketle ilgili henüz makale bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-full">
            <BlogSidebar categories={categories || []} popularPosts={popularPosts || []} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Etiket sayfası yüklenirken hata oluştu:", error)
    notFound()
  }
}
