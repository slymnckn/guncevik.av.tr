"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

export async function updateAppointmentStatus(id: string, status: string, notes?: string) {
  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase
    .from("appointments")
    .update({
      status,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating appointment status:", error)
    throw new Error("Randevu durumu güncellenirken bir hata oluştu.")
  }

  revalidatePath("/admin/appointments")
  revalidatePath(`/admin/appointments/${id}`)
  return { success: true }
}

export async function deleteAppointment(id: string) {
  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.from("appointments").delete().eq("id", id)

  if (error) {
    console.error("Error deleting appointment:", error)
    throw new Error("Randevu silinirken bir hata oluştu.")
  }

  revalidatePath("/admin/appointments")
  return { success: true }
}

export async function createAppointment(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const appointmentDate = formData.get("appointmentDate") as string
  const appointmentTime = formData.get("appointmentTime") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  if (!name || !email || !phone || !appointmentDate || !appointmentTime) {
    throw new Error("Lütfen tüm zorunlu alanları doldurun.")
  }

  const { error } = await supabase.from("appointments").insert({
    name,
    email,
    phone,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    subject,
    message,
    status: "pending",
  })

  if (error) {
    console.error("Error creating appointment:", error)
    throw new Error("Randevu oluşturulurken bir hata oluştu.")
  }

  revalidatePath("/admin/appointments")
  return { success: true }
}
