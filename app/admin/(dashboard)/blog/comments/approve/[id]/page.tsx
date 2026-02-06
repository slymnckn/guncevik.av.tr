import { createServerSupabaseClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ApproveCommentForm } from "@/components/admin/blog/approve-comment-form"

interface PageProps {
  params: {
    id: string
  }
}

export const dynamic = "force-dynamic"

export default async function ApproveCommentPage({ params }: PageProps) {
  await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { data: comment, error } = await supabase
    .from("blog_comments")
    .select(`
      *,
      blog_posts(id, title, slug)
    `)
    .eq("id", params.id)
    .single()

  if (error || !comment) {
    console.error("Yorum alınırken hata:", error)
    redirect("/admin/blog/comments")
  }

  if (comment.status === "approved") {
    redirect("/admin/blog/comments")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Yorumu Onayla</h1>
      <ApproveCommentForm comment={comment} />
    </div>
  )
}
