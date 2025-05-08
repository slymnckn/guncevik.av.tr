"use server"

import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  try {
    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      console.error("Ayarlar yüklenirken hata:", error)
      throw new Error("Ayarlar yüklenirken bir hata oluştu.")
    }

    // Ayarları key-value formatına dönüştür
    const settings: Record<string, string> = {}
    data.forEach((item) => {
      settings[item.setting_key] = item.setting_value
    })

    return settings
  } catch (error) {
    console.error("Ayarlar yüklenirken hata:", error)
    throw new Error("Ayarlar yüklenirken bir hata oluştu.")
  }
}

export async function updateSetting(key: string, value: string) {
  try {
    const supabase = createAdminSupabaseClient()

    // Ayarın mevcut olup olmadığını kontrol et
    const { data: existingData, error: existingError } = await supabase
      .from("site_settings")
      .select("*")
      .eq("setting_key", key)
      .single()

    if (existingError && existingError.code !== "PGRST116") {
      // PGRST116: Sonuç bulunamadı hatası
      console.error("Ayar kontrol edilirken hata:", existingError)
      throw new Error("Ayar kontrol edilirken bir hata oluştu.")
    }

    let result
    if (existingData) {
      // Mevcut ayarı güncelle
      const { data, error } = await supabase
        .from("site_settings")
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq("setting_key", key)
        .select()

      if (error) {
        console.error("Ayar güncellenirken hata:", error)
        throw new Error("Ayar güncellenirken bir hata oluştu.")
      }

      result = data[0]
    } else {
      // Yeni ayar ekle
      const { data, error } = await supabase
        .from("site_settings")
        .insert({
          setting_key: key,
          setting_value: value,
          setting_type: "text",
        })
        .select()

      if (error) {
        console.error("Ayar eklenirken hata:", error)
        throw new Error("Ayar eklenirken bir hata oluştu.")
      }

      result = data[0]
    }

    // Tüm sayfaları yenile
    revalidatePath("/")
    revalidatePath("/admin/site-settings")

    return result
  } catch (error) {
    console.error("Ayar güncellenirken hata:", error)
    throw new Error("Ayar güncellenirken bir hata oluştu.")
  }
}
