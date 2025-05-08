import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Kullanıcının admin olup olmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Ayarları getir
  const { data, error } = await supabase.from("settings").select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Ayarları key-value formatına dönüştür
  const settings = data.reduce((acc: Record<string, any>, item) => {
    acc[item.id] = item.value
    return acc
  }, {})

  return NextResponse.json(settings)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Kullanıcının admin olup olmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, value } = body

    if (!id || !value) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Ayarı güncelle
    const { data, error } = await supabase.from("settings").upsert({ id, value, updated_by: session.user.id }).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
