import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { BlogTags } from "@/components/blog-tags"

interface BlogCardProps {
  post: any
}

export async function BlogCard({ post }: BlogCardProps) {
  const supabase = createServerComponentClient({ cookies })

  // Görsel URL'sini oluştur
  let imageUrl = null
  if (post.image_path) {
    const { data } = await supabase.storage.from("blog-images").getPublicUrl(post.image_path)
    imageUrl = data.publicUrl
  }

  // Tarih formatını düzenle
  const publishDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  // Yazının etiketlerini getir
  const { data: postTags } = await supabase
    .from("blog_post_tags")
    .select(`
      tag_id,
      blog_tags(id, name, slug)
    `)
    .eq("post_id", post.id)

  const tags = postTags?.map((item) => item.blog_tags) || []

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      {imageUrl && (
        <div className="relative h-48">
          <img src={imageUrl || "/placeholder.svg"} alt={post.title} className="object-cover w-full h-full" />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-primary font-medium">{post.blog_categories?.name || "Genel"}</span>
          <span className="text-sm text-gray-500">{publishDate}</span>
        </div>
        <h2 className="text-xl font-bold mb-2 line-clamp-2">
          <Link href={`/makaleler/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Etiketleri göster */}
        {tags.length > 0 && <BlogTags tags={tags} className="mb-4" />}

        <Button asChild variant="outline" className="w-full">
          <Link href={`/makaleler/${post.slug}`}>Devamını Oku</Link>
        </Button>
      </div>
    </div>
  )
}
