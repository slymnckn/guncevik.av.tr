import { type NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

// Bucket adı - Supabase'de oluşturduğunuz bucket adı
const BUCKET_NAME = "blog-images"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Admin client'ı oluştur (servis rolü ile)
    const adminClient = createAdminSupabaseClient()

    // Form verilerini al
    const formData = await request.formData()
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const categoryId = formData.get("category_id") as string
    const metaTitle = formData.get("meta_title") as string
    const metaDescription = formData.get("meta_description") as string
    const published = formData.get("published") === "true"
    const image = formData.get("image") as File

    // Mevcut blog yazısını al
    const { data: existingPost, error: fetchError } = await adminClient
      .from("blog_posts")
      .select("published, image_path, author_id")
      .eq("id", params.id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: `Blog yazısı bulunamadı: ${fetchError.message}` },
        { status: 404 },
      )
    }

    // Resim yükleme işlemi
    let imagePath = existingPost.image_path

    if (image && image.size > 0) {
      try {
        const fileExt = image.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `blog/${fileName}`

        // Resmi ArrayBuffer'a dönüştür
        const arrayBuffer = await image.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Admin client ile resmi yükle (RLS bypass)
        const { error: uploadError } = await adminClient.storage.from(BUCKET_NAME).upload(filePath, buffer, {
          contentType: image.type,
        })

        if (uploadError) {
          console.error(`Resim yükleme hatası: ${uploadError.message}`)
          return NextResponse.json(
            { success: false, message: "Resim yüklenemedi: " + uploadError.message },
            { status: 500 },
          )
        } else {
          // Eski resmi sil
          if (existingPost.image_path) {
            await adminClient.storage.from(BUCKET_NAME).remove([existingPost.image_path])
          }

          imagePath = filePath
        }
      } catch (uploadErr: any) {
        console.error("Resim yükleme hatası:", uploadErr)
        return NextResponse.json(
          { success: false, message: "Resim yükleme hatası: " + uploadErr.message },
          { status: 500 },
        )
      }
    }

    // Blog yazısını güncelle - admin client kullan
    const updateData = {
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId || null,
      meta_title: metaTitle,
      meta_description: metaDescription,
      published,
      image_path: imagePath,
      updated_at: new Date().toISOString(),
    }

    // Eğer yazı yayınlanmamışken yayınlanıyorsa, yayınlanma tarihini ekle
    if (published && !existingPost.published) {
      updateData.published_at = new Date().toISOString()
    }

    const { data, error } = await adminClient
      .from("blog_posts")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, message: `Blog yazısı güncellenirken hata oluştu: ${error.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Blog yazısı güncellenirken hata:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
