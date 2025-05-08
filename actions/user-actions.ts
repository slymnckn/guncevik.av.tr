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

    // Kullanıcı oluştur
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error("Kullanıcı oluşturulurken hata:", authError)
      return { error: "Kullanıcı oluşturulurken bir hata oluştu." }
    }

    // Profil oluştur
    const { error: profileError } = await supabase.from("admin_profiles").insert({
      id: authData.user.id,
      email,
      name,
      role,
    })

    if (profileError) {
      console.error("Profil oluşturulurken hata:", profileError)
      return { error: "Kullanıcı profili oluşturulurken bir hata oluştu." }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Kullanıcı oluşturulurken hata:", error)
    return { error: "Kullanıcı oluşturulurken bir hata oluştu." }
  }
}

export async function updateUser(userId: string, formData: FormData) {
  try {
    const supabase = createAdminSupabaseClient()

    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const role = formData.get("role") as string
    const password = formData.get("password") as string

    // Kullanıcı güncelle
    if (password) {
      const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        password,
        email,
      })

      if (authError) {
        console.error("Kullanıcı güncellenirken hata:", authError)
        return { error: "Kullanıcı güncellenirken bir hata oluştu." }
      }
    }

    // Profil güncelle
    const { error: profileError } = await supabase
      .from("admin_profiles")
      .update({
        name,
        role,
        email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (profileError) {
      console.error("Profil güncellenirken hata:", profileError)
      return { error: "Kullanıcı profili güncellenirken bir hata oluştu." }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Kullanıcı güncellenirken hata:", error)
    return { error: "Kullanıcı güncellenirken bir hata oluştu." }
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = createAdminSupabaseClient()

    // Kullanıcıyı sil
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Kullanıcı silinirken hata:", authError)
      return { error: "Kullanıcı silinirken bir hata oluştu." }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Kullanıcı silinirken hata:", error)
    return { error: "Kullanıcı silinirken bir hata oluştu." }
  }
}
