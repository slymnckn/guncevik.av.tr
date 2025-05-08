import Link from "next/link"

interface BlogTag {
  id: string
  name: string
  slug: string
}

interface BlogTagsProps {
  tags: BlogTag[]
  className?: string
}

export function BlogTags({ tags, className = "" }: BlogTagsProps) {
  if (!tags || tags.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/makaleler/etiket/${tag.slug}`}
          className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  )
}
