"use server"

import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  try {
    const supabase = createAdminSupabaseClient()

    // Auth kullanıcılarını çek
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error("Auth kullanıcıları çekilirken hata:", authError)
      return { error: "Kullanıcılar yüklenirken bir hata oluştu." }
    }

    // Admin profillerini çek
    const { data: profiles, error: profilesError } = await supabase.from("admin_profiles").select("*")

    if (profilesError) {
      console.error("Profiller çekilirken hata:", profilesError)
      return { error: "Kullanıcı profilleri yüklenirken bir hata oluştu." }
    }

    // İki veri setini birleştir
    const combinedUsers = authUsers.users.map((authUser) => {
      const profile = profiles?.find((p) => p.id === authUser.id)
      return {
        id: authUser.id,
        email: authUser.email || "",
        name: profile?.name || "İsimsiz Kullanıcı",
        role: profile?.role || "viewer",
        created_at: authUser.created_at,
        updated_at: profile?.updated_at || new Date().toISOString(),
        last_sign_in_at: authUser.last_sign_in_at,
        is_active: !authUser.banned_until,
      }
    })

    return { users: combinedUsers }
  } catch (error) {
    console.error("Kullanıcılar yüklenirken hata:", error)
    return { error: "Kullanıcılar yüklenirken bir hata oluştu." }
  }
}

export async function createUser(formData: FormData) {
  try {
    const supabase = createAdminSupabaseClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const role = formData.get("role") as string

    console.log("Kullanıcı oluşturma verileri:", { email, name, role, passwordLength: password?.length })

    if (!email || !password || !name || !role) {
      console.error("Eksik veri:", { email: !!email, password: !!password, name: !!name, role: !!role })
      return { error: "Tüm alanları doldurun." }
    }

    // 1. Önce auth kullanıcısı oluştur
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error("Kullanıcı oluşturulurken hata:", authError)
      return { error: `Kullanıcı oluşturulurken hata: ${authError.message}` }
    }

    if (!authData || !authData.user || !authData.user.id) {
      console.error("Auth verisi oluşturulamadı:", authData)
      return { error: "Kullanıcı kimliği oluşturulamadı." }
    }

    console.log("Auth kullanıcısı oluşturuldu:", authData.user.id)

    // 2. Service role ile profil oluştur (RLS bypass)
    const { data: profileData, error: profileError } = await supabase.from("admin_profiles").insert({
      id: authData.user.id,
      email,
      name,
      role,
    })

    if (profileError) {
      console.error("Profil oluşturulurken hata:", profileError)

      // Hata durumunda oluşturulan auth kullanıcısını sil
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
        console.log("Hata nedeniyle auth kullanıcısı silindi:", authData.user.id)
      } catch (deleteError) {
        console.error("Auth kullanıcısı silinirken hata:", deleteError)
      }

      return { error: `Kullanıcı profili oluşturulurken hata: ${profileError.message}` }
    }

    console.log("Profil oluşturuldu:", profileData)

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Kullanıcı oluşturulurken beklenmeyen hata:", error)
    return { error: `Kullanıcı oluşturulurken beklenmeyen hata: ${(error as Error).message}` }
  }
}

export async function updateUser(userId: string, formData: FormData) {
  try {
    const supabase = createAdminSupabaseClient()

    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const password = formData.get("password") as string

    console.log("Kullanıcı güncelleme verileri:", { userId, email, name, role, hasPassword: !!password })

    if (!userId || !email || !name || !role) {
      console.error("Eksik veri:", { userId: !!userId, email: !!email, name: !!name, role: !!role })
      return { error: "Tüm alanları doldurun." }
    }

    // 1. Şifre değişikliği varsa auth kullanıcısını güncelle
    if (password && password.trim() !== "") {
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        password,
        email,
      })

      if (authError) {
        console.error("Kullanıcı kimlik bilgileri güncellenirken hata:", authError)
        return { error: `Kullanıcı kimlik bilgileri güncellenirken hata: ${authError.message}` }
      }

      console.log("Kullanıcı kimlik bilgileri güncellendi")
    }

    // 2. Service role ile profili güncelle (RLS bypass)
    const { error: profileError } = await supabase
      .from("admin_profiles")
      .update({
        name,
        role,
        email,
      })
      .eq("id", userId)

    if (profileError) {
      console.error("Profil güncellenirken hata:", profileError)
      return { error: `Kullanıcı profili güncellenirken hata: ${profileError.message}` }
    }

    console.log("Profil güncellendi")

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Kullanıcı güncellenirken beklenmeyen hata:", error)
    return { error: `Kullanıcı güncellenirken beklenmeyen hata: ${(error as Error).message}` }
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = createAdminSupabaseClient()

    if (!userId) {
      return { error: "Kullanıcı ID'si gerekli." }
    }

    console.log("Kullanıcı siliniyor:", userId)

    // Kullanıcıyı sil (cascade ile profil de silinecek)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Kullanıcı silinirken hata:", authError)
      return { error: `Kullanıcı silinirken hata: ${authError.message}` }
    }

    console.log("Kullanıcı başarıyla silindi")

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Kullanıcı silinirken beklenmeyen hata:", error)
    return { error: `Kullanıcı silinirken beklenmeyen hata: ${(error as Error).message}` }
  }
}
