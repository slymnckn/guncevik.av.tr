import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const { name, email, phone, appointmentDate, appointmentTime, subject, message } = formData

    // Veri doğrulama
    if (!name || !email || !phone || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doldurun." }, { status: 400 })
    }

    // Admin yetkilerine sahip Supabase client kullanıyoruz
    const supabase = createAdminSupabaseClient()

    // Randevu verilerini ekleyelim
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        name,
        email,
        phone,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        subject: subject || null,
        message: message || null,
        status: "pending",
      })
      .select()

    if (error) {
      console.error("Randevu oluşturulurken hata:", error)
      return NextResponse.json({ error: "Randevu oluşturulurken bir hata oluştu: " + error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Randevu API hatası:", error)
    return NextResponse.json({ error: "Randevu oluşturulurken bir hata oluştu." }, { status: 500 })
  }
}
