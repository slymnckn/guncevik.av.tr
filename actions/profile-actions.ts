"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Kullanıcı profilini getir
export async function getUserProfile(userId: string) {
  try {
    console.log("getUserProfile çağrıldı, userId:", userId)
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("admin_profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Profil getirme hatası:", error.message)
      return { error: error.message }
    }

    console.log("Getirilen profil:", data)
    return { profile: data }
  } catch (error: any) {
    console.error("Profil getirme exception:", error.message)
    return { error: error.message }
  }
}

// Kullanıcı profilini güncelle
export async function updateProfile(userId: string, formData: FormData) {
  try {
    console.log("updateProfile çağrıldı, userId:", userId)
    const supabase = createServerSupabaseClient()

    // Sadece izin verilen alanları güncelle
    const name = formData.get("name") as string

    // Avatar dosyası varsa yükle
    let avatarUrl = formData.get("avatar_url") as string
    const avatarFile = formData.get("avatar") as File

    if (avatarFile && avatarFile.size > 0) {
      console.log("Avatar dosyası yükleniyor...")

      // Dosya adını benzersiz yap
      const fileExt = avatarFile.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`

      // Dosyayı Supabase Storage'a yükle
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadError) {
        console.error("Avatar yükleme hatası:", uploadError.message)
        return { error: `Avatar yüklenirken hata: ${uploadError.message}` }
      }

      // Yüklenen dosyanın public URL'ini al
      const { data: urlData } = await supabase.storage.from("avatars").getPublicUrl(fileName)

      avatarUrl = urlData.publicUrl
      console.log("Avatar URL:", avatarUrl)
    }

    // Profili güncelle
    const updateData: any = { name }
    if (avatarUrl) {
      updateData.avatar_url = avatarUrl
    }

    console.log("Güncellenecek veriler:", updateData)

    const { data, error } = await supabase.from("admin_profiles").update(updateData).eq("id", userId).select().single()

    if (error) {
      console.error("Profil güncelleme hatası:", error.message)
      return { error: `Kullanıcı profili güncellenirken hata: ${error.message}` }
    }

    console.log("Profil güncellendi:", data)

    // Cache'i temizle ve profil sayfasına yönlendir
    revalidatePath("/admin/profile")
    return { success: true, profile: data }
  } catch (error: any) {
    console.error("Profil güncelleme exception:", error.message)
    return { error: `Kullanıcı profili güncellenirken hata: ${error.message}` }
  }
}
