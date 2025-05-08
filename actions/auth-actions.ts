"use server"

import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

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

export async function signOut() {
  const supabase = createAdminSupabaseClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}
