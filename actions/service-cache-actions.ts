"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Tüm hizmetleri getir
export async function getAllServices() {
  const supabase = createServerSupabaseClient()

  try {
    const { data: services, error } = await supabase.from("services").select("*").order("title", { ascending: true })

    if (error) {
      console.error("Hizmetleri getirme hatası:", error)
      return []
    }

    return services || []
  } catch (error) {
    console.error("Hizmetleri getirme hatası:", error)
    return []
  }
}

// Hizmet ekle
export async function addService(serviceData: any) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("services").insert(serviceData).select()

    if (error) {
      console.error("Hizmet ekleme hatası:", error)
      return { success: false, message: error.message }
    }

    // Hizmetler sayfasını yeniden doğrula
    revalidatePath("/hizmetlerimiz")
    revalidatePath("/admin/services")

    return { success: true, message: "Hizmet başarıyla eklendi.", data }
  } catch (error: any) {
    console.error("Hizmet ekleme hatası:", error)
    return { success: false, message: error.message || "Hizmet eklenirken bir hata oluştu." }
  }
}

// Hizmet güncelle
export async function updateService(id: string, serviceData: any) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("services").update(serviceData).eq("id", id).select()

    if (error) {
      console.error("Hizmet güncelleme hatası:", error)
      return { success: false, message: error.message }
    }

    // Hizmetler sayfasını yeniden doğrula
    revalidatePath("/hizmetlerimiz")
    revalidatePath("/admin/services")

    return { success: true, message: "Hizmet başarıyla güncellendi.", data }
  } catch (error: any) {
    console.error("Hizmet güncelleme hatası:", error)
    return { success: false, message: error.message || "Hizmet güncellenirken bir hata oluştu." }
  }
}

// Hizmet sil
export async function deleteService(id: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("services").delete().eq("id", id)

    if (error) {
      console.error("Hizmet silme hatası:", error)
      return { success: false, message: error.message }
    }

    // Hizmetler sayfasını yeniden doğrula
    revalidatePath("/hizmetlerimiz")
    revalidatePath("/admin/services")

    return { success: true, message: "Hizmet başarıyla silindi." }
  } catch (error: any) {
    console.error("Hizmet silme hatası:", error)
    return { success: false, message: error.message || "Hizmet silinirken bir hata oluştu." }
  }
}

// Hizmet önbelleğini temizle
export async function invalidateServiceCache(slug?: string) {
  // Belirli bir hizmet için yeniden doğrula
  if (slug) {
    revalidatePath(`/hizmetlerimiz/${slug}`)
  }

  // Tüm hizmetler sayfasını yeniden doğrula
  revalidatePath("/hizmetlerimiz")

  return { success: true }
}
