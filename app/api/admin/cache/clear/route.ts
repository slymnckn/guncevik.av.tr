import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { invalidateAllCache } from "@/lib/redis-cache"

export async function POST(request: NextRequest) {
  try {
    // Admin yetkisi kontrolü
    const supabase = await createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Yetkilendirme hatası: Oturum bulunamadı" }, { status: 401 })
    }

    // Admin rolünü kontrol et
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Yetkilendirme hatası: Admin yetkisi gerekli" },
        { status: 403 },
      )
    }

    // Önbellek türünü al
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    // Redis önbelleğini temizle (varsa)
    await invalidateAllCache()

    // Next.js önbelleğini temizle
    if (type === "all") {
      revalidatePath("/", "layout")
      revalidatePath("/hizmetlerimiz")
      revalidatePath("/makaleler")
      revalidatePath("/admin")

      return NextResponse.json({
        success: true,
        message: "Tüm önbellek başarıyla temizlendi.",
      })
    } else if (type === "blog") {
      revalidatePath("/makaleler")
      revalidatePath("/makaleler/[slug]", "page")
      revalidatePath("/makaleler/kategori/[slug]", "page")
      revalidatePath("/makaleler/etiket/[slug]", "page")

      return NextResponse.json({
        success: true,
        message: "Blog önbelleği başarıyla temizlendi.",
      })
    } else if (type === "service") {
      revalidatePath("/hizmetlerimiz")

      return NextResponse.json({
        success: true,
        message: "Hizmet önbelleği başarıyla temizlendi.",
      })
    }

    return NextResponse.json({
      success: false,
      message: "Geçersiz önbellek türü.",
    })
  } catch (error: any) {
    console.error("Önbellek temizleme hatası:", error)

    return NextResponse.json(
      { success: false, message: error.message || "Önbellek temizlenirken bir hata oluştu." },
      { status: 500 },
    )
  }
}
