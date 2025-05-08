"use server"

import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  try {
    console.log("Kullanıcılar getiriliyor...")
    const supabase = createAdminSupabaseClient()

    // Önce auth.users tablosundan kullanıcıları al
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error("Auth kullanıcıları getirilirken hata:", authError)
      throw new Error("Kullanıcılar getirilirken bir hata oluştu.")
    }

    // Admin profilleri al
    const { data: adminProfiles, error: profilesError } = await supabase.from("admin_profiles").select("*")

    if (profilesError) {
      console.error("Admin profilleri getirilirken hata:", profilesError)
      throw new Error("Admin profilleri getirilirken bir hata oluştu.")
    }

    // Kullanıcı ve profil verilerini birleştir
    const users = authUsers.users.map((user) => {
      const profile = adminProfiles.find((profile) => profile.user_id === user.id)
      return {
        id: user.id,
        email: user.email,
        role: profile?.role || "editor",
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        is_active: !user.banned_until,
      }
    })

    console.log("Getirilen kullanıcılar:", users)
    return users
  } catch (error) {
    console.error("Kullanıcılar getirilirken hata:", error)
    throw new Error("Kullanıcılar getirilirken bir hata oluştu.")
  }
}

export async function createUser(formData: FormData) {
  try {
    console.log("Form gönderiliyor:", Object.fromEntries(formData))

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = (formData.get("role") as string) || "editor"

    if (!email || !password) {
      throw new Error("E-posta ve şifre gereklidir.")
    }

    const supabase = createAdminSupabaseClient()

    // Kullanıcı oluştur
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (userError) {
      console.error("Kullanıcı oluşturulurken hata:", userError)
      throw new Error(`Kullanıcı oluşturulurken hata: ${userError.message}`)
    }

    // Admin profili oluştur
    const { error: profileError } = await supabase.from("admin_profiles").insert({
      user_id: userData.user.id,
      role,
    })

    if (profileError) {
      console.error("Admin profili oluşturulurken hata:", profileError)
      // Kullanıcı oluşturuldu ama profil oluşturulamadı, kullanıcıyı silmeyi düşünebiliriz
      throw new Error(`Admin profili oluşturulurken hata: ${profileError.message}`)
    }

    revalidatePath("/admin/users")
    return { success: true, message: "Kullanıcı başarıyla oluşturuldu." }
  } catch (error: any) {
    console.error("Form hatası:", error.message || "Bilinmeyen hata")
    return {
      success: false,
      message: `Kullanıcı oluşturulurken beklenmeyen hata: ${error.message || "Bilinmeyen hata"}`,
    }
  }
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  try {
    const supabase = createAdminSupabaseClient()

    if (isActive) {
      // Kullanıcıyı aktifleştir
      await supabase.auth.admin.updateUserById(userId, { banned_until: null })
    } else {
      // Kullanıcıyı devre dışı bırak (100 yıl)
      const banUntil = new Date()
      banUntil.setFullYear(banUntil.getFullYear() + 100)
      await supabase.auth.admin.updateUserById(userId, { banned_until: banUntil.toISOString() })
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Kullanıcı durumu güncellenirken hata:", error)
    return { success: false, message: "Kullanıcı durumu güncellenirken bir hata oluştu." }
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = createAdminSupabaseClient()

    // Önce admin profilini sil
    const { error: profileError } = await supabase.from("admin_profiles").delete().eq("user_id", userId)

    if (profileError) {
      console.error("Admin profili silinirken hata:", profileError)
      throw new Error("Admin profili silinirken bir hata oluştu.")
    }

    // Sonra kullanıcıyı sil
    const { error: userError } = await supabase.auth.admin.deleteUser(userId)

    if (userError) {
      console.error("Kullanıcı silinirken hata:", userError)
      throw new Error("Kullanıcı silinirken bir hata oluştu.")
    }

    revalidatePath("/admin/users")
    return { success: true, message: "Kullanıcı başarıyla silindi." }
  } catch (error: any) {
    console.error("Kullanıcı silinirken hata:", error)
    return { success: false, message: error.message || "Kullanıcı silinirken bir hata oluştu." }
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase.from("admin_profiles").update({ role }).eq("user_id", userId)

    if (error) {
      console.error("Kullanıcı rolü güncellenirken hata:", error)
      throw new Error("Kullanıcı rolü güncellenirken bir hata oluştu.")
    }

    revalidatePath("/admin/users")
    return { success: true, message: "Kullanıcı rolü başarıyla güncellendi." }
  } catch (error: any) {
    console.error("Kullanıcı rolü güncellenirken hata:", error)
    return { success: false, message: error.message || "Kullanıcı rolü güncellenirken bir hata oluştu." }
  }
}
