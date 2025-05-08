import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DeleteCategory } from "@/components/admin/blog/delete-category"

export const metadata: Metadata = {
  title: "Kategori Sil | GÜN ÇEVİK Hukuk Bürosu",
  description: "Kategori silme sayfası",
}

export default async function DeleteCategoryPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  const { data: category, error } = await supabase.from("blog_categories").select("*").eq("id", params.id).single()

  if (error || !category) {
    console.error("Kategori getirilirken hata oluştu:", error)
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Kategori Sil: {category.name}</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <DeleteCategory category={category} />
      </div>
    </div>
  )
}
