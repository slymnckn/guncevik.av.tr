import { type NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

// Bucket adı
const BUCKET_NAME = "blog-images"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get("path")

    if (!path) {
      return new NextResponse("Resim yolu belirtilmedi", { status: 400 })
    }

    // Admin client'ı oluştur (servis rolü ile)
    const supabase = createAdminSupabaseClient()

    // Resim URL'sini al
    const { data } = await supabase.storage.from(BUCKET_NAME).getPublicUrl(path)

    if (!data || !data.publicUrl) {
      return new NextResponse("Resim bulunamadı", { status: 404 })
    }

    // Resmi yönlendir
    return NextResponse.redirect(data.publicUrl)
  } catch (error) {
    console.error("Resim alınırken hata:", error)
    return new NextResponse("Resim alınırken hata oluştu", { status: 500 })
  }
}
