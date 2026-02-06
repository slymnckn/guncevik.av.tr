import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()

  // Kullanıcının oturum açıp açmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, all } = body

    if (all) {
      // Tüm bildirimleri okundu olarak işaretle
      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false)
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, count: data.length })
    } else if (id) {
      // Belirli bir bildirimi okundu olarak işaretle
      const { data, error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id).select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(data[0])
    } else {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
