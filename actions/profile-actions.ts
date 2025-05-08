"use server"

import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function getUserProfile(userId: string) {
  try {
    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase.from("admin_profiles").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Profil bilgileri alınırken hata:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Profil bilgileri alınırken hata:", error)
    return null
  }
}

export async function updateProfile(profileData: {
  name: string
  avatar_url: string | null
}) {
  try {
    const supabase = createAdminSupabaseClient()

    // Mevcut kullanıcıyı al
    const cookieStore = cookies()
    const supabaseClient = createAdminSupabaseClient()
    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    if (!session) {
      return { success: false, error: "Oturum bulunamadı." }
    }

    const { error } = await supabase
      .from("admin_profiles")
      .update({
        name: profileData.name,
        avatar_url: profileData.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Profil güncellenirken hata:", error)
      return { success: false, error: "Profil güncellenirken bir hata oluştu." }
    }

    revalidatePath("/admin/profile")
    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Profil güncellenirken hata:", error)
    return { success: false, error: "Profil güncellenirken bir hata oluştu." }
  }
}

export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = createAdminSupabaseClient()

    // Mevcut kullanıcıyı al
    const cookieStore = cookies()
    const supabaseClient = createAdminSupabaseClient()
    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    if (!session) {
      return { success: false, error: "Oturum bulunamadı." }
    }

    const file = formData.get("avatar") as File

    if (!file) {
      return { success: false, error: "Dosya bulunamadı." }
    }

    // Dosya boyutunu kontrol et (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: "Dosya boyutu 2MB'dan büyük olamaz." }
    }

    // Dosya tipini kontrol et
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Sadece resim dosyaları yüklenebilir." }
    }

    // Dosya adını oluştur
    const fileExt = file.name.split(".").pop()
    const fileName = `${session.user.id}-${uuidv4()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Eski avatarı sil
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("avatar_url")
      .eq("id", session.user.id)
      .single()

    if (profile?.avatar_url) {
      const oldPath = profile.avatar_url.split("/").pop()
      if (oldPath) {
        await supabase.storage.from("avatars").remove([`avatars/${oldPath}`])
      }
    }

    // Yeni avatarı yükle
    const { data, error } = await supabase.storage.from("avatars").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Avatar yüklenirken hata:", error)
      return { success: false, error: "Avatar yüklenirken bir hata oluştu." }
    }

    // Dosya URL'sini al
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath)

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error("Avatar yüklenirken hata:", error)
    return { success: false, error: "Avatar yüklenirken bir hata oluştu." }
  }
}

export async function getCurrentUser() {
  try {
    const supabase = createAdminSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    return session.user
  } catch (error) {
    console.error("Kullanıcı bilgileri alınırken hata:", error)
    return null
  }
}
