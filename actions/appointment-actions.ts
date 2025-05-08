"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/types/database"
import { createAdminSupabaseClient } from "@/lib/supabase/server"

export async function updateAppointmentStatus(id: string, status: string, notes?: string) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
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
            // Cookies can't be set in middleware
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // Cookies can't be removed in middleware
          }
        },
      },
    },
  )

  const { error } = await supabase
    .from("appointments")
    .update({
      status,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Randevu durumu güncellenirken hata:", error)
    throw new Error("Randevu durumu güncellenirken bir hata oluştu.")
  }

  revalidatePath("/admin/appointments")
  revalidatePath(`/admin/appointments/${id}`)
  return { success: true }
}

export async function deleteAppointment(id: string) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
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
            // Cookies can't be set in middleware
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // Cookies can't be removed in middleware
          }
        },
      },
    },
  )

  const { error } = await supabase.from("appointments").delete().eq("id", id)

  if (error) {
    console.error("Randevu silinirken hata:", error)
    throw new Error("Randevu silinirken bir hata oluştu.")
  }

  revalidatePath("/admin/appointments")
  return { success: true }
}

export async function createAppointment(formData: FormData) {
  console.log("Randevu oluşturma başladı")

  // Admin yetkilerine sahip Supabase client kullanıyoruz
  const supabase = createAdminSupabaseClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const appointmentDate = formData.get("appointmentDate") as string
  const appointmentTime = formData.get("appointmentTime") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  console.log("Randevu verileri:", {
    name,
    email,
    phone,
    appointmentDate,
    appointmentTime,
    subject,
    message,
  })

  if (!name || !email || !phone || !appointmentDate || !appointmentTime) {
    console.error("Eksik alanlar:", { name, email, phone, appointmentDate, appointmentTime })
    throw new Error("Lütfen tüm zorunlu alanları doldurun.")
  }

  try {
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
      console.error("Randevu oluşturulurken hata:", error)
      throw new Error("Randevu oluşturulurken bir hata oluştu: " + error.message)
    }

    console.log("Randevu başarıyla oluşturuldu:", data)

    // Bildirim oluşturma işlemi devre dışı bırakıldı
    // Bildirim sistemi düzgün çalıştığında tekrar etkinleştirilebilir

    revalidatePath("/admin/appointments")
    return { success: true, data }
  } catch (error) {
    console.error("Randevu oluşturma exception:", error)
    throw new Error(
      "Randevu oluşturulurken bir hata oluştu: " + (error instanceof Error ? error.message : String(error)),
    )
  }
}
