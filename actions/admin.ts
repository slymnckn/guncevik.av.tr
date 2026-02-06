"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function updateMessageStatus(messageId: string, status: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from("contact_submissions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", messageId)

    if (error) {
      console.error("Error updating message status:", error)
      return {
        success: false,
        message: "Status güncellenirken bir hata oluştu.",
      }
    }

    revalidatePath(`/admin/messages/${messageId}`)
    revalidatePath("/admin/messages")

    return {
      success: true,
      message: "Status başarıyla güncellendi.",
    }
  } catch (error) {
    console.error("Error in updateMessageStatus:", error)
    return {
      success: false,
      message: "Status güncellenirken bir hata oluştu.",
    }
  }
}

export async function updateConsultationStatus(consultationId: string, status: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from("consultation_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", consultationId)

    if (error) {
      console.error("Error updating consultation status:", error)
      return {
        success: false,
        message: "Status güncellenirken bir hata oluştu.",
      }
    }

    revalidatePath(`/admin/consultations/${consultationId}`)
    revalidatePath("/admin/consultations")

    return {
      success: true,
      message: "Status başarıyla güncellendi.",
    }
  } catch (error) {
    console.error("Error in updateConsultationStatus:", error)
    return {
      success: false,
      message: "Status güncellenirken bir hata oluştu.",
    }
  }
}
