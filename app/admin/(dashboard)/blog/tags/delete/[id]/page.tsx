import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DeleteTag } from "@/components/admin/blog/delete-tag"

export default async function DeleteTagPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  const { data: tag, error } = await supabase.from("blog_tags").select("*").eq("id", params.id).single()

  if (error || !tag) {
    console.error("Etiket getirilirken hata oluştu:", error)
    notFound()
  }

  // Etiketin kullanım sayısını getir
  const { count, error: countError } = await supabase
    .from("blog_post_tags")
    .select("*", { count: "exact", head: true })
    .eq("tag_id", tag.id)

  if (countError) {
    console.error("Etiket kullanım sayısı getirilirken hata oluştu:", countError)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Etiket Sil</h1>
      <DeleteTag tag={tag} postCount={count || 0} />
    </div>
  )
}
