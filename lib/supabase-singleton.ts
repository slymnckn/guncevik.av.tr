import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./types/database"

let supabase: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function createClientSupabaseClient() {
  if (!supabase) {
    supabase = createClientComponentClient<Database>()
  }
  return supabase
}
