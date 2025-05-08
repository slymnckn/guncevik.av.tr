"use server"

import { createServerSupabaseClient } from "./supabase/server"
import { redirect } from "next/navigation"

// Admin kullanıcısını kontrol et
export async function requireAuth() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Kullanıcının admin rolünü kontrol et
  const { data: profile, error } = await supabase.from("admin_profiles").select("*").eq("id", session.user.id).single()

  if (error || !profile) {
    console.error("Admin profili bulunamadı:", error)
    redirect("/admin/login")
  }

  return { user: session.user, profile }
}
