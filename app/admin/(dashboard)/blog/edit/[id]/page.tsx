import { BlogForm } from "@/components/admin/blog/blog-form"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface EditBlogPageProps {
  params: {
    id: string
  }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = params
  const supabase = createServerSupabaseClient()

  // Blog yazısını getir
  const { data: post, error: postError } = await supabase.from("blog_posts").select("*").eq("id", id).single()

  if (postError || !post) {
    console.error("Blog yazısı getirme hatası:", postError)
    notFound()
  }

  // Kategorileri getir
  const { data: categories, error: categoriesError } = await supabase.from("blog_categories").select("*").order("name")

  if (categoriesError) {
    console.error("Kategoriler getirme hatası:", categoriesError)
  }

  // Blog yazısının etiketlerini getir
  const { data: postTags, error: tagsError } = await supabase.from("blog_post_tags").select("tag_id").eq("post_id", id)

  if (tagsError) {
    console.error("Etiketler getirme hatası:", tagsError)
  }

  const tagIds = postTags ? postTags.map((tag) => tag.tag_id) : []

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Blog Yazısını Düzenle</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <BlogForm post={post} categories={categories || []} initialTags={tagIds} />
      </div>
    </div>
  )
}
