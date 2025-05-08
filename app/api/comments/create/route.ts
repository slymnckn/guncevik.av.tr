import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"

const commentSchema = z.object({
  post_id: z.string().uuid(),
  parent_id: z.string().uuid().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  content: z.string().min(5),
})

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Validate input
    const validatedData = commentSchema.parse(body)

    // Check if post exists and is published
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("id", validatedData.post_id)
      .eq("published", true)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { success: false, message: "Blog yazısı bulunamadı veya yayında değil" },
        { status: 404 },
      )
    }

    // If parent_id is provided, check if it exists
    if (validatedData.parent_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from("blog_comments")
        .select("id")
        .eq("id", validatedData.parent_id)
        .eq("status", "approved")
        .single()

      if (parentError || !parentComment) {
        return NextResponse.json(
          { success: false, message: "Yanıt verilen yorum bulunamadı veya onaylanmamış" },
          { status: 404 },
        )
      }
    }

    // Insert comment
    const { data, error } = await supabase
      .from("blog_comments")
      .insert({
        post_id: validatedData.post_id,
        parent_id: validatedData.parent_id,
        name: validatedData.name,
        email: validatedData.email,
        content: validatedData.content,
        status: "pending", // Default status is pending
      })
      .select()

    if (error) {
      console.error("Yorum eklenirken hata:", error)
      return NextResponse.json({ success: false, message: "Yorum eklenirken bir hata oluştu" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Yorum oluşturma hatası:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Geçersiz veri", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, message: "Bir hata oluştu" }, { status: 500 })
  }
}
