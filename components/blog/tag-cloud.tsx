"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface Tag {
  id: string
  name: string
  slug: string
  count: number
}

export function TagCloud() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true)

        // Etiketleri ve kullanım sayılarını getir
        const { data, error } = await supabase
          .from("blog_tags")
          .select(`
            id,
            name,
            slug,
            blog_post_tags!inner(tag_id)
          `)
          .eq("is_active", true)

        if (error) {
          throw error
        }

        // Etiketleri kullanım sayılarına göre düzenle
        const tagsWithCount = data.map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          count: tag.blog_post_tags.length,
        }))

        // Kullanım sayısına göre sırala
        tagsWithCount.sort((a, b) => b.count - a.count)

        setTags(tagsWithCount)
      } catch (error) {
        console.error("Etiketler yüklenirken hata:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [supabase])

  // Etiket boyutunu kullanım sayısına göre hesapla
  const getTagSize = (count: number) => {
    const maxCount = Math.max(...tags.map((t) => t.count))
    const minCount = Math.min(...tags.map((t) => t.count))
    const range = maxCount - minCount

    // Minimum ve maksimum font boyutları
    const minSize = 0.75
    const maxSize = 1.5

    if (range === 0) return 1 // Tüm etiketler aynı sayıda kullanılmışsa

    // Doğrusal ölçekleme
    const size = minSize + ((count - minCount) / range) * (maxSize - minSize)
    return size.toFixed(2)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (tags.length === 0) {
    return <div className="text-center p-4 text-gray-500">Henüz etiket bulunmuyor</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Etiket Bulutu</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/makaleler/etiket/${tag.slug}`}
            className="inline-block bg-gray-100 hover:bg-primary hover:text-white transition-colors rounded-full px-3 py-1 text-gray-700"
            style={{ fontSize: `${getTagSize(tag.count)}rem` }}
          >
            {tag.name} ({tag.count})
          </Link>
        ))}
      </div>
    </div>
  )
}
