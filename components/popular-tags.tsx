import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function PopularTags() {
  const supabase = createServerSupabaseClient()

  // Popüler etiketleri getir - blog_post_tags tablosundan sayım yaparak
  const { data } = await supabase
    .from("blog_post_tags")
    .select(`
      tag_id,
      blog_tags (id, name, slug)
    `)
    .not("blog_tags", "is", null)

  if (!data || data.length === 0) {
    return <p className="text-gray-500">Henüz etiket bulunmamaktadır.</p>
  }

  // Etiketleri sayarak popülerlik sıralaması yap
  const tagCounts = data.reduce((acc: Record<string, any>, item) => {
    const tagId = item.tag_id
    const tag = item.blog_tags

    if (!acc[tagId]) {
      acc[tagId] = {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        count: 0,
      }
    }

    acc[tagId].count += 1
    return acc
  }, {})

  // Etiketleri popülerliğe göre sırala ve en popüler 10 tanesini al
  const popularTags = Object.values(tagCounts)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)

  // Rastgele renkler için dizi
  const colors = ["primary", "blue", "green", "red", "purple", "indigo", "pink", "yellow", "teal", "orange"]

  return (
    <div className="flex flex-wrap gap-2">
      {popularTags.map((tag: any, index: number) => {
        // Her etiket için rastgele bir renk seç
        const color = colors[index % colors.length]

        return (
          <Link
            key={tag.id}
            href={`/makaleler/etiket/${tag.slug}`}
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-700 hover:bg-${color}-200 transition-colors`}
          >
            {tag.name} ({tag.count})
          </Link>
        )
      })}
    </div>
  )
}
