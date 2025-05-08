import { createServerSupabaseClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function TagStatsPage() {
  await requireAuth()
  const supabase = createServerSupabaseClient()

  // Etiketleri ve kullanım sayılarını getir
  const { data: tags, error } = await supabase
    .from("blog_tags")
    .select(`
      id,
      name,
      color,
      blog_post_tags!inner(tag_id)
    `)
    .order("name")

  if (error) {
    console.error("Etiketler alınırken hata:", error)
    throw new Error("Etiket istatistikleri alınamadı")
  }

  // Etiketleri kullanım sayılarına göre düzenle
  const tagsWithCount = tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    color: tag.color || "#3b82f6",
    count: tag.blog_post_tags.length,
  }))

  // Kullanım sayısına göre sırala
  tagsWithCount.sort((a, b) => b.count - a.count)

  // En çok kullanılan 10 etiketi al
  const topTags = tagsWithCount.slice(0, 10)

  // Toplam etiket kullanımı
  const totalUsage = tagsWithCount.reduce((sum, tag) => sum + tag.count, 0)

  // Kullanılmayan etiketler
  const unusedTags = tagsWithCount.filter((tag) => tag.count === 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Etiket İstatistikleri</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Etiket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tagsWithCount.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Toplam Kullanım</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Kullanılmayan Etiketler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{unusedTags.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>En Çok Kullanılan Etiketler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <div className="w-full h-full flex items-end">
                {topTags.map((tag, index) => (
                  <div
                    key={tag.id}
                    className="flex flex-col items-center mx-1"
                    style={{ height: `${(tag.count / Math.max(...topTags.map((t) => t.count))) * 100}%` }}
                  >
                    <div
                      className="w-8 rounded-t-md"
                      style={{
                        backgroundColor: tag.color,
                        height: `${(tag.count / Math.max(...topTags.map((t) => t.count))) * 100}%`,
                        minHeight: "20px",
                      }}
                    ></div>
                    <div className="text-xs mt-1 transform -rotate-45 origin-top-left">{tag.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Etiketler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">Etiket</th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">Renk</th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">Kullanım Sayısı</th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">Kullanım Oranı</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tagsWithCount.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{tag.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: tag.color }}></div>
                        {tag.color}
                      </div>
                    </td>
                    <td className="px-4 py-3">{tag.count}</td>
                    <td className="px-4 py-3">{totalUsage > 0 ? ((tag.count / totalUsage) * 100).toFixed(1) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
