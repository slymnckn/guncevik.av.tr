"use server"

import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSiteSettings() {
  try {
    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase.from("site_settings").select("*").single()

    if (error) {
      console.error("Site ayarları yüklenirken hata:", error)
      return { error: "Site ayarları yüklenirken bir hata oluştu." }
    }

    return { settings: data }
  } catch (error) {
    console.error("Site ayarları yüklenirken hata:", error)
    return { error: "Site ayarları yüklenirken bir hata oluştu." }
  }
}

export async function updateSiteSettings(formData: FormData) {
  try {
    const supabase = createAdminSupabaseClient()

    // Form verilerini topla
    const settings: Record<string, any> = {}

    // Genel ayarlar
    settings.site_title = formData.get("site_title")
    settings.site_description = formData.get("site_description")

    // Görünüm ayarları
    settings.primary_color = formData.get("primary_color")
    settings.secondary_color = formData.get("secondary_color")
    settings.font_family = formData.get("font_family")

    // İletişim bilgileri
    settings.contact_email = formData.get("contact_email")
    settings.contact_phone = formData.get("contact_phone")
    settings.contact_address = formData.get("contact_address")
    settings.google_maps_url = formData.get("google_maps_url")

    // SEO ayarları
    settings.meta_title = formData.get("meta_title")
    settings.meta_description = formData.get("meta_description")
    settings.meta_keywords = formData.get("meta_keywords")
    settings.google_analytics_id = formData.get("google_analytics_id")

    // Dosya yükleme işlemleri
    // Not: Gerçek uygulamada dosya yükleme işlemleri için Supabase Storage kullanılmalıdır

    // Ayarları güncelle
    const { error } = await supabase.from("site_settings").upsert({
      id: 1, // Tek bir ayar kaydı kullanıyoruz
      ...settings,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Site ayarları güncellenirken hata:", error)
      return { error: "Site ayarları güncellenirken bir hata oluştu." }
    }

    revalidatePath("/admin/site-settings")
    revalidatePath("/") // Ana sayfayı da yenile

    return { success: true }
  } catch (error) {
    console.error("Site ayarları güncellenirken hata:", error)
    return { error: "Site ayarları güncellenirken bir hata oluştu." }
  }
}
