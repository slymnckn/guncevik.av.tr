import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createServerSupabaseClient()

  // Oturumu sonlandır
  await supabase.auth.signOut()

  // Login sayfasına yönlendir
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL))
}
