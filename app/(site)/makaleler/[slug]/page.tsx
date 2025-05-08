import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BlogSidebar } from "@/components/blog-sidebar"
import { BlogTags } from "@/components/blog-tags"
import { getPopularBlogPosts } from "@/actions/public-actions"
import { OptimizedImage } from "@/components/optimized-image"
import { formatDate } from "@/lib/utils"
import { ShareButtons } from "@/components/blog/share-buttons"
import { CommentsSection } from "@/components/blog/comments-section"
import type { Metadata } from "next"
import { ArticleSchema } from "@/components/seo/article-schema"

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params
  const supabase = createServerComponentClient({ cookies })

  const { data: post } = await supabase
    .from("blog_posts")
    .select(`title, meta_title, meta_description, excerpt, image_path`)
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (!post) {
    return {
      title: "Makale Bulunamadı | GÜN ÇEVİK Hukuk Bürosu",
      description: "Aradığınız makale bulunamadı.",
    }
  }

  // Görsel URL'sini oluştur
  let imageUrl = null
  if (post.image_path) {
    const { data } = await supabase.storage.from("blog-images").getPublicUrl(post.image_path)
    imageUrl = data.publicUrl
  }

  return {
    title: post.meta_title || `${post.title} | GÜN ÇEVİK Hukuk Bürosu`,
    description:
      post.meta_description || post.excerpt || "GÜN ÇEVİK Hukuk Bürosu'nun hukuki konularda bilgilendirici makaleleri.",
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = params
  const supabase = createServerComponentClient({ cookies })

  try {
    // Blog yazısını getir
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        blog_categories(id, name, slug)
      `)
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error || !post) {
      console.error("Blog post not found:", error)
      notFound()
    }

    // Yazar bilgisini ayrı bir sorguyla al
    let authorName = "GÜN ÇEVİK Hukuk Bürosu"
    let authorTitle = ""

    if (post.author_id) {
      const { data: author } = await supabase
        .from("admin_profiles")
        .select("name, role")
        .eq("id", post.author_id)
        .single()

      if (author) {
        authorName = author.name
        authorTitle = author.role === "admin" ? "Avukat" : author.role === "editor" ? "Hukuk Danışmanı" : ""
      }
    }

    // Görüntülenme sayısını artır
    await supabase
      .from("blog_posts")
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq("id", post.id)

    // Görsel URL'sini oluştur
    let imageUrl = null
    if (post.image_path) {
      // Doğrudan Supabase Storage URL'sini oluştur
      const { data } = await supabase.storage.from("blog-images").getPublicUrl(post.image_path)
      imageUrl = data.publicUrl
    }

    // Tarih formatını düzenle
    const publishDate = post.published_at ? formatDate(post.published_at) : null

    // Yazının etiketlerini getir
    const { data: postTags } = await supabase
      .from("blog_post_tags")
      .select(`
        tag_id,
        blog_tags(id, name, slug)
      `)
      .eq("post_id", post.id)

    const tags = postTags?.map((item) => item.blog_tags) || []

    // Kategorileri getir (sidebar için)
    const { data: categories } = await supabase
      .from("blog_categories")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("name")

    // Popüler yazıları getir (sidebar için)
    const { data: popularPosts } = await getPopularBlogPosts(5)

    // İlgili yazıları getir
    const { data: relatedPosts } = await supabase
      .from("blog_posts")
      .select(`id, title, slug, excerpt, published_at, image_path`)
      .eq("published", true)
      .eq("category_id", post.category_id)
      .neq("id", post.id)
      .order("published_at", { ascending: false })
      .limit(3)

    // İçeriği güvenli bir şekilde işle
    const safeContent = post.content || ""
    const paragraphs = safeContent
      .split("\n\n")
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)

    // Paylaşım URL'si
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guncevik.av.tr"
    const shareUrl = `${siteUrl}/makaleler/${post.slug}`

    return (
      <>
        {/* Schema.org yapısal veri */}
        <ArticleSchema
          headline={post.title}
          description={post.excerpt || ""}
          image={imageUrl || `${siteUrl}/gc-law-logo.png`}
          datePublished={post.published_at || post.created_at}
          dateModified={post.updated_at || post.published_at || post.created_at}
          authorName={authorName}
          publisherName="GÜN ÇEVİK Hukuk Bürosu"
          publisherLogo={`${siteUrl}/gc-law-logo.png`}
          url={shareUrl}
        />

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <Link href="/makaleler" className="text-primary hover:text-primary/80 flex items-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Tüm Makaleler</span>
                  </Link>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

                  <div className="flex flex-wrap items-center text-gray-600 mb-6">
                    {publishDate && (
                      <time dateTime={post.published_at} className="mr-4">
                        {publishDate}
                      </time>
                    )}
                    {post.blog_categories && (
                      <>
                        <span className="mr-4">|</span>
                        <Link
                          href={`/makaleler/kategori/${post.blog_categories.slug}`}
                          className="mr-4 hover:text-primary transition-colors"
                        >
                          {post.blog_categories.name}
                        </Link>
                      </>
                    )}
                    <span className="mr-4">|</span>
                    <span>{authorName}</span>
                  </div>

                  {imageUrl && (
                    <div className="relative w-full h-80 rounded-lg overflow-hidden mb-8">
                      <OptimizedImage src={imageUrl} alt={post.title} className="w-full h-80" priority />
                    </div>
                  )}

                  {/* Etiketleri göster */}
                  {tags.length > 0 && <BlogTags tags={tags} className="mb-6" />}

                  {/* Paylaşım butonları */}
                  <div className="mb-6">
                    <ShareButtons url={shareUrl} title={post.title} description={post.excerpt} />
                  </div>

                  {post.excerpt && <p className="text-lg text-gray-700 mb-6">{post.excerpt}</p>}

                  <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
                    {paragraphs.map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl font-bold">
                          {authorName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{authorName}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{authorTitle || "GÜN ÇEVİK Hukuk Bürosu"}</p>
                      </div>
                    </div>
                  </div>

                  {/* İlgili Yazılar */}
                  {relatedPosts && relatedPosts.length > 0 && (
                    <div className="mt-12">
                      <h2 className="text-2xl font-bold mb-6">İlgili Yazılar</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((relatedPost) => {
                          // Görsel URL'sini oluştur
                          let relatedImageUrl = null
                          if (relatedPost.image_path) {
                            const { data } = supabase.storage.from("blog-images").getPublicUrl(relatedPost.image_path)
                            relatedImageUrl = data.publicUrl
                          }

                          return (
                            <Link key={relatedPost.id} href={`/makaleler/${relatedPost.slug}`} className="block group">
                              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform group-hover:scale-[1.02]">
                                {relatedImageUrl && (
                                  <div className="h-40 overflow-hidden">
                                    <OptimizedImage
                                      src={relatedImageUrl}
                                      alt={relatedPost.title}
                                      className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                                    />
                                  </div>
                                )}
                                <div className="p-4">
                                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                    {relatedPost.title}
                                  </h3>
                                  {relatedPost.excerpt && (
                                    <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </article>

              {/* Yorumlar Bölümü */}
              <CommentsSection postId={post.id} />
            </div>

            <div>
              <BlogSidebar categories={categories || []} popularPosts={popularPosts || []} />
            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error("Blog yazısı sayfası yüklenirken hata oluştu:", error)
    notFound()
  }
}
