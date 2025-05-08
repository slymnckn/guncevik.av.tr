import Link from "next/link"
import { OptimizedImage } from "@/components/optimized-image"
import { formatDate } from "@/lib/utils"

interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  published_at?: string
  image_url?: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
  title?: string
}

export function RelatedPosts({ posts, title = "İlgili Yazılar" }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/makaleler/${post.slug}`} className="block group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform group-hover:scale-[1.02]">
              {post.image_url && (
                <div className="h-40 overflow-hidden">
                  <OptimizedImage
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                {post.published_at && <p className="text-gray-500 text-sm mb-2">{formatDate(post.published_at)}</p>}
                {post.excerpt && <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
