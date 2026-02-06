import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const dynamic = "force-dynamic"

export default async function TagsPage() {
  const supabase = await createServerSupabaseClient()

  let tags = []
  let error = null

  try {
    const { data, error: fetchError } = await supabase.from("blog_tags").select("*").order("name")

    if (fetchError) throw fetchError

    tags = data || []
  } catch (err) {
    console.error("Etiketler getirilirken hata oluştu:", err)
    error = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu"
  }

  // Her etiket için kullanım sayısını getir
  const tagsWithCount = await Promise.all(
    (tags || []).map(async (tag) => {
      try {
        const { count, error: countError } = await supabase
          .from("blog_post_tags")
          .select("*", { count: "exact", head: true })
          .eq("tag_id", tag.id)

        if (countError) throw countError

        return {
          ...tag,
          count: count || 0,
        }
      } catch (err) {
        console.error(`Etiket ${tag.id} için kullanım sayısı getirilirken hata:`, err)
        return {
          ...tag,
          count: 0,
        }
      }
    }),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Etiketler</h1>
        <Button asChild>
          <Link href="/admin/blog/tags/new">
            <Plus className="mr-2 h-4 w-4" /> Yeni Etiket
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>
            Etiketler getirilirken bir hata oluştu: {error}
            <div className="mt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/dashboard">Gösterge Paneline Dön</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>Kullanım</TableHead>
              <TableHead className="w-[100px]">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagsWithCount.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  Henüz etiket bulunmuyor.
                </TableCell>
              </TableRow>
            )}

            {tagsWithCount.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell className="max-w-xs truncate">{tag.description || "-"}</TableCell>
                <TableCell>{tag.count}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/blog/tags/edit/${tag.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Düzenle</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/blog/tags/delete/${tag.id}`}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Sil</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
