"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "../types/database"

// Singleton pattern için tek bir Supabase istemcisi
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseClient
}

// Geriye dönük uyumluluk için eski fonksiyon adını da koruyalım
export const createClientSupabaseClient = getSupabaseClient

export async function checkAdminStatus() {
  const supabase = getSupabaseClient()

  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting user or no user found:", userError)
      return false
    }

    // Check if user is admin
    const { data, error } = await supabase.from("admin_profiles").select("role").eq("id", user.id).single()

    if (error) {
      console.error("Error checking admin status:", error)
      return false
    }

    return data?.role === "admin"
  } catch (err) {
    console.error("Exception in checkAdminStatus:", err)
    return false
  }
}
