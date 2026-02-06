import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { slugify } from "@/lib/utils"

// Bucket adı - Supabase'de oluşturduğunuz bucket adı
const BUCKET_NAME = "blog-images"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    // Admin client'ı oluştur (servis rolü ile)
    const adminClient = createAdminSupabaseClient()

    // Kullanıcı bilgilerini al
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      // Kullanıcı oturumu yoksa, admin client ile devam et
      console.log("Kullanıcı oturumu bulunamadı, admin client ile devam ediliyor")
    }

    // Form verilerini al
    const formData = await request.formData()
    const title = formData.get("title") as string
    const slug = (formData.get("slug") as string) || slugify(title)
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const categoryId = formData.get("category_id") as string
    const metaTitle = formData.get("meta_title") as string
    const metaDescription = formData.get("meta_description") as string
    const published = formData.get("published") === "true"
    const image = formData.get("image") as File

    // Admin kullanıcılarını al
    const { data: adminUsers } = await adminClient.from("admin_profiles").select("id").limit(1)
    const authorId = session?.user?.id || (adminUsers && adminUsers.length > 0 ? adminUsers[0].id : null)

    if (!authorId) {
      return NextResponse.json(
        { success: false, message: "Yazar ID'si bulunamadı. Lütfen tekrar giriş yapın." },
        { status: 400 },
      )
    }

    // Resim yükleme işlemi
    let imagePath = null

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

    // Blog yazısını ekle - admin client kullan
    const { data, error } = await adminClient
      .from("blog_posts")
      .insert([
        {
          title,
          slug,
          excerpt,
          content,
          category_id: categoryId || null,
          author_id: authorId,
          meta_title: metaTitle,
          meta_description: metaDescription,
          published,
          published_at: published ? new Date().toISOString() : null,
          image_path: imagePath,
          view_count: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, message: `Blog yazısı eklenirken hata oluştu: ${error.message}` },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Blog yazısı eklenirken hata:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
