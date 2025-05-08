import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const postId = params.postId

    // Validate post ID
    if (!postId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId)) {
      return NextResponse.json({ success: false, message: "Geçersiz blog yazısı ID'si" }, { status: 400 })
    }

    // Check if post exists and is published
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("id", postId)
      .eq("published", true)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { success: false, message: "Blog yazısı bulunamadı veya yayında değil" },
        { status: 404 },
      )
    }

    // Get all approved top-level comments for the post
    const { data: comments, error: commentsError } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", postId)
      .eq("status", "approved")
      .is("parent_id", null)
      .order("created_at", { ascending: false })

    if (commentsError) {
      console.error("Yorumlar alınırken hata:", commentsError)
      return NextResponse.json({ success: false, message: "Yorumlar alınırken bir hata oluştu" }, { status: 500 })
    }

    // Get all approved replies
    const { data: replies, error: repliesError } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", postId)
      .eq("status", "approved")
      .not("parent_id", "is", null)
      .order("created_at", { ascending: true })

    if (repliesError) {
      console.error("Yanıtlar alınırken hata:", repliesError)
      return NextResponse.json({ success: false, message: "Yanıtlar alınırken bir hata oluştu" }, { status: 500 })
    }

    // Organize replies into a nested structure
    const commentsWithReplies = comments?.map((comment) => {
      const commentReplies = replies?.filter((reply) => reply.parent_id === comment.id) || []
      return {
        ...comment,
        replies: commentReplies,
      }
    })

    return NextResponse.json({ success: true, comments: commentsWithReplies })
  } catch (error) {
    console.error("Yorumlar alınırken hata:", error)
    return NextResponse.json({ success: false, message: "Bir hata oluştu" }, { status: 500 })
  }
}
