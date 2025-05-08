import { createClient as supabaseCreateClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

// Singleton pattern - tek bir admin Supabase istemcisi oluştur
let adminSupabaseClient: ReturnType<typeof supabaseCreateClient<Database>> | null = null

export const createAdminSupabaseClient = () => {
  if (adminSupabaseClient) return adminSupabaseClient

  // Çevre değişkenlerini kontrol et
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Supabase çevre değişkenleri eksik:", {
      url: supabaseUrl ? "Mevcut" : "Eksik",
      key: supabaseServiceRoleKey ? "Mevcut" : "Eksik",
    })
    throw new Error("Supabase çevre değişkenleri eksik")
  }

  try {
    adminSupabaseClient = supabaseCreateClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    console.log("Admin Supabase client başarıyla oluşturuldu")
    return adminSupabaseClient
  } catch (error) {
    console.error("Admin Supabase client oluşturulurken hata:", error)
    throw new Error("Admin Supabase client oluşturulurken hata")
  }
}

// Geriye dönük uyumluluk için createServerSupabaseClient alias'ı
export const createServerSupabaseClient = createAdminSupabaseClient

// Geriye dönük uyumluluk için createClient export'u
export const createClient = createAdminSupabaseClient

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
