import { BlogForm } from "@/components/admin/blog/blog-form"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function NewBlogPage() {
  // Supabase client oluştur
  const supabase = createServerSupabaseClient()

  // Kategorileri getir
  const { data: categories, error } = await supabase.from("blog_categories").select("*").order("name")

  if (error) {
    console.error("Kategoriler getirilirken hata:", error)
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Yeni Blog Yazısı</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <BlogForm categories={categories || []} />
      </div>
    </div>
  )
}
