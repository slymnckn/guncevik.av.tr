"use server"

import { createServerSupabaseClient } from "./supabase/server"
import { redirect } from "next/navigation"

// Admin kullanıcısını kontrol et
export async function requireAuth() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/admin/login")
  }

  // Kullanıcının admin rolünü kontrol et
  const { data: profile, error } = await supabase.from("admin_profiles").select("*").eq("id", user.id).single()

  if (error || !profile) {
    console.error("Admin profili bulunamadı:", error)
    redirect("/admin/login")
  }

  return { user, profile }
}
