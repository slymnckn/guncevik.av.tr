import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { TagForm } from "@/components/admin/blog/tag-form"

export default async function EditTagPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  const { data: tag, error } = await supabase.from("blog_tags").select("*").eq("id", params.id).single()

  if (error || !tag) {
    console.error("Etiket getirilirken hata oluştu:", error)
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Etiket Düzenle</h1>
      <TagForm initialData={tag} />
    </div>
  )
}
