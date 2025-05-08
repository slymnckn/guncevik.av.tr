"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Eski ikon isimlerini yeni ikon isimlerine dönüştüren yardımcı fonksiyon
const iconNameMap: Record<string, string> = {
  "dollar-sign": "dollarSign",
  "file-text": "fileText",
  scale: "scale",
  briefcase: "briefcase",
  shield: "shield",
  users: "users",
  home: "home",
  heart: "heart",
  file: "file",
  award: "award",
}

// Veritabanındaki tüm hizmetlerin ikonlarını standartlaştıran fonksiyon
export async function standardizeServiceIcons() {
  const supabase = createServerSupabaseClient()

  try {
    // Tüm hizmetleri getir
    const { data: services, error: fetchError } = await supabase.from("services").select("id, icon")

    if (fetchError) {
      console.error("Hizmetleri getirme hatası:", fetchError)
      return { success: false, message: fetchError.message }
    }

    // Her bir hizmet için ikon adını standartlaştır
    for (const service of services || []) {
      if (service.icon && iconNameMap[service.icon]) {
        // Eski ikon adını yeni standart adla güncelle
        const { error: updateError } = await supabase
          .from("services")
          .update({ icon: iconNameMap[service.icon] })
          .eq("id", service.id)

        if (updateError) {
          console.error(`Hizmet ID ${service.id} için ikon güncelleme hatası:`, updateError)
        }
      }
    }

    // Sayfaları yeniden doğrula
    revalidatePath("/hizmetlerimiz")
    revalidatePath("/")

    return { success: true, message: "Hizmet ikonları başarıyla standartlaştırıldı." }
  } catch (error) {
    console.error("İkon standartlaştırma hatası:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    }
  }
}
