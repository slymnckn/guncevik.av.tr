import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "../types/database"

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Çerez ayarlanırken hata oluştu, muhtemelen SSG sırasında
            console.error("Çerez ayarlanırken hata:", error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // Çerez kaldırılırken hata oluştu, muhtemelen SSG sırasında
            console.error("Çerez kaldırılırken hata:", error)
          }
        },
      },
    },
  )
}

export function createAdminSupabaseClient() {
  return createServerSupabaseClient()
}

export const createClient = createServerSupabaseClient
