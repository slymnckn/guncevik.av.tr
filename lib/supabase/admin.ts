// Enhanced server-side Supabase client with admin functions

import { createServerSupabaseClient } from "./server"
import type { ContactSubmission, DashboardStats } from "../types"
import { createClient } from "@supabase/supabase-js"

// Supabase admin client (servis rolü ile)
export function createAdminSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase URL veya servis rolü anahtarı bulunamadı.")
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient()

  // Get total counts
  const { count: totalContacts } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })

  // Get new counts (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const dateFilter = sevenDaysAgo.toISOString()

  const { count: newContacts } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .gt("created_at", dateFilter)

  return {
    totalContacts: totalContacts || 0,
    totalConsultations: 0,
    newContacts: newContacts || 0,
    newConsultations: 0,
  }
}

export async function getRecentContactSubmissions(limit = 5): Promise<ContactSubmission[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent contact submissions:", error)
    return []
  }

  return data as ContactSubmission[]
}

export async function getContactSubmissionById(id: string): Promise<ContactSubmission | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.from("contact_submissions").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching contact submission ${id}:`, error)
    return null
  }

  return data as ContactSubmission
}
