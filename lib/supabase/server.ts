import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

// Singleton pattern - tek bir admin Supabase istemcisi oluştur
let adminSupabaseClient: ReturnType<typeof supabaseCreateClient<Database>> | null = null

export const createAdminSupabaseClient = () => {
  if (adminSupabaseClient) return adminSupabaseClient

  adminSupabaseClient = supabaseCreateClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    },
  )

  return adminSupabaseClient
}

// Geriye dönük uyumluluk için createServerSupabaseClient alias'ı
export const createServerSupabaseClient = createAdminSupabaseClient

// Geriye dönük uyumluluk için createClient export'u
export const createClient = createAdminSupabaseClient

// Orijinal createClient fonksiyonunu da export edelim

// Admin profil kontrolü
export async function getAdminProfile(userId: string) {
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase.from("admin_profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Admin profili bulunamadı:", error)
    return null
  }

  return data
}

// Admin kontrolü
export async function isUserAdmin(userId: string) {
  const profile = await getAdminProfile(userId)
  return profile?.role === "admin"
}
