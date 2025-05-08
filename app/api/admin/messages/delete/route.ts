import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ success: false, message: "ID gerekli" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Oturum kontrolü
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ success: false, message: "Oturum açmanız gerekiyor" }, { status: 401 })
    }

    // Mesajı sil
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id)

    if (error) {
      console.error("Error deleting message:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete route:", error)
    return NextResponse.json({ success: false, message: "Bir hata oluştu" }, { status: 500 })
  }
}
