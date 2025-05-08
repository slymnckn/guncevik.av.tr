"use server"

import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Mevcut kullanıcıyı getir
export async function getCurrentUser() {
  try {
    const supabase = createServerSupabaseClient()

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

// Çıkış yap
export async function signOut() {
  try {
    const supabase = createServerSupabaseClient()
    await supabase.auth.signOut()

    // Çerezleri temizle
    cookies().delete("supabase-auth-token")

    return { success: true }
  } catch (error) {
    console.error("Çıkış yapılırken hata:", error)
    return { error: "Çıkış yapılırken bir hata oluştu." }
  }
}

// Admin kullanıcısını kontrol et
export async function requireAuth() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return redirect("/admin/login")
  }

  // Kullanıcının admin rolünü kontrol et
  const { data: profile, error } = await supabase.from("admin_profiles").select("*").eq("id", session.user.id).single()

  if (error || !profile) {
    console.error("Admin profili bulunamadı:", error)
    return redirect("/admin/login")
  }

  return { user: session.user, profile }
}
