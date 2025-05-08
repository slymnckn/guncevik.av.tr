import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "../types/database"

export function createServerSupabaseClient() {
  try {
    const cookieStore = cookies()

    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Mevcut" : "Eksik")

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
              console.error("Cookie set hatası:", error)
              // Cookies can't be set in middleware
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: "", ...options })
            } catch (error) {
              console.error("Cookie remove hatası:", error)
              // Cookies can't be removed in middleware
            }
          },
          getAll() {
            return cookieStore.getAll().map((cookie) => ({
              name: cookie.name,
              value: cookie.value,
            }))
          },
          setAll(cookieList) {
            try {
              cookieList.forEach((cookie) => {
                cookieStore.set(cookie)
              })
            } catch (error) {
              console.error("Cookie setAll hatası:", error)
              // Cookies can't be set in middleware
            }
          },
        },
      },
    )
  } catch (error) {
    console.error("Supabase client oluşturma hatası:", error)
    throw error
  }
}

// createClient fonksiyonu
export const createClient = createServerSupabaseClient

export function createAdminSupabaseClient() {
  // Service role key ile admin yetkilerine sahip client oluştur
  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
