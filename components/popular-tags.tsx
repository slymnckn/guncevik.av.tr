import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function PopularTags() {
  const supabase = createServerSupabaseClient()

  // Popüler etiketleri getir
  const { data: tags } = await supabase
    .from("blog_tags")
    .select("*")
    .order("post_count", { ascending: false })
    .limit(10)

  if (!tags || tags.length === 0) {
    return <p className="text-gray-500">Henüz etiket bulunmamaktadır.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/makaleler/etiket/${tag.slug}`}
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${
            tag.color || "primary"
          }/10 text-${tag.color || "primary"} hover:bg-${tag.color || "primary"}/20 transition-colors`}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  )
}
