"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"

// Doğrudan Supabase bağlantısı oluştur
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export async function updateAppointmentStatus(id: string, status: string, notes?: string) {
  try {
    console.log(`Server: Randevu durumu güncelleniyor - ID: ${id}, Status: ${status}`)

    // Doğrudan Supabase bağlantısı kullan
    const { error } = await supabase
      .from("appointments")
      .update({
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Server: Randevu durumu güncellenirken hata:", error)
      throw new Error(`Randevu durumu güncellenirken hata: ${error.message}`)
    }

    console.log("Server: Randevu durumu başarıyla güncellendi")

    // Sayfaları yenile
    revalidatePath("/admin/appointments")
    revalidatePath(`/admin/appointments/${id}`)

    return { success: true }
  } catch (error) {
    console.error("Server: Randevu durumu güncelleme exception:", error)
    throw new Error(
      `Randevu durumu güncellenirken bir hata oluştu: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function deleteAppointment(id: string) {
  try {
    console.log(`Server: Randevu siliniyor - ID: ${id}`)

    // Doğrudan Supabase bağlantısı kullan
    const { error } = await supabase.from("appointments").delete().eq("id", id)

    if (error) {
      console.error("Server: Randevu silinirken hata:", error)
      throw new Error(`Randevu silinirken hata: ${error.message}`)
    }

    console.log("Server: Randevu başarıyla silindi")

    // Sayfaları yenile
    revalidatePath("/admin/appointments")

    return { success: true }
  } catch (error) {
    console.error("Server: Randevu silme exception:", error)
    throw new Error(`Randevu silinirken bir hata oluştu: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function createAppointment(formData: FormData) {
  try {
    console.log("Server: Randevu oluşturma başladı")

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const appointmentDate = formData.get("appointmentDate") as string
    const appointmentTime = formData.get("appointmentTime") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    console.log("Server: Randevu verileri:", {
      name,
      email,
      phone,
      appointmentDate,
      appointmentTime,
      subject,
      message,
    })

    if (!name || !email || !phone || !appointmentDate || !appointmentTime) {
      console.error("Server: Eksik alanlar:", { name, email, phone, appointmentDate, appointmentTime })
      throw new Error("Lütfen tüm zorunlu alanları doldurun.")
    }

    // Randevu oluştur
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        name,
        email,
        phone,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        subject,
        message,
        status: "pending",
      })
      .select()

    if (error) {
      console.error("Server: Randevu oluşturulurken hata:", error)
      throw new Error(`Randevu oluşturulurken hata: ${error.message}`)
    }

    console.log("Server: Randevu başarıyla oluşturuldu:", data)

    // Sayfaları yenile
    revalidatePath("/admin/appointments")

    return { success: true, data }
  } catch (error) {
    console.error("Server: Randevu oluşturma exception:", error)
    throw new Error(`Randevu oluşturulurken bir hata oluştu: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getAppointmentById(id: string) {
  try {
    console.log(`Server: Randevu getiriliyor - ID: ${id}`)

    const { data, error } = await supabase.from("appointments").select("*").eq("id", id).single()

    if (error) {
      console.error("Server: Randevu getirilirken hata:", error)
      throw new Error(`Randevu getirilirken hata: ${error.message}`)
    }

    if (!data) {
      console.error("Server: Randevu bulunamadı - ID:", id)
      throw new Error("Randevu bulunamadı")
    }

    console.log("Server: Randevu başarıyla getirildi")

    return data
  } catch (error) {
    console.error("Server: Randevu getirme exception:", error)
    throw new Error(`Randevu getirilirken bir hata oluştu: ${error instanceof Error ? error.message : String(error)}`)
  }
}
