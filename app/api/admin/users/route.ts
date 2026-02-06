import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()

  // Kullanıcının admin olup olmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const search = url.searchParams.get("search") || ""
  const role = url.searchParams.get("role") || ""
  const status = url.searchParams.get("status") || ""
  const limit = Number.parseInt(url.searchParams.get("limit") || "20")
  const offset = Number.parseInt(url.searchParams.get("offset") || "0")

  // Kullanıcıları getir
  let query = supabase
    .from("user_profiles")
    .select("*, auth_user:id(email)")
    .order("created_at", { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`display_name.ilike.%${search}%,auth_user.email.ilike.%${search}%`)
  }

  if (role) {
    query = query.eq("role", role)
  }

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count })
}
