"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export async function sendContactForm(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = (formData.get("phone") as string) || null
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Basic validation
    if (!name || !email || !subject || !message) {
      return {
        success: false,
        message: "Lütfen tüm zorunlu alanları doldurun.",
      }
    }

    // Initialize Supabase client
    const supabase = await createServerSupabaseClient()

    // Insert data into contact_submissions table
    const { error, data } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name,
          email,
          phone,
          subject,
          message,
          status: "new",
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return {
        success: false,
        message: "Mesajınız kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      }
    }

    // Create notification for admin
    try {
      const adminClient = createAdminSupabaseClient()
      await adminClient.from("notifications").insert([
        {
          title: "Yeni İletişim Mesajı",
          message: `${name} adlı kişiden yeni bir mesaj alındı: ${subject}`,
          type: "contact",
          reference_type: "contact_submission",
          reference_id: data[0].id,
          is_read: false,
          link: `/admin/messages/${data[0].id}`,
        },
      ])
    } catch (notifError) {
      console.error("Notification error:", notifError)
      // Continue even if notification fails
    }

    // Revalidate the contact page
    revalidatePath("/iletisim")
    revalidatePath("/admin/messages")
    revalidatePath("/admin/notifications")

    return {
      success: true,
      message: "Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
    }
  }
}

export async function updateMessageStatus(id: string, status: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .from("contact_submissions")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error("Status update error:", error)
      return {
        success: false,
        message: "Durum güncellenirken bir hata oluştu.",
      }
    }

    revalidatePath(`/admin/messages/${id}`)
    revalidatePath("/admin/messages")

    return {
      success: true,
      message: "Mesaj durumu başarıyla güncellendi.",
    }
  } catch (error) {
    console.error("Status update error:", error)
    return {
      success: false,
      message: "Durum güncellenirken bir hata oluştu.",
    }
  }
}

export async function deleteMessage(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    // First delete related notifications
    try {
      const adminClient = createAdminSupabaseClient()
      await adminClient.from("notifications").delete().eq("reference_type", "contact_submission").eq("reference_id", id)
    } catch (notifError) {
      console.error("Notification deletion error:", notifError)
      // Continue even if notification deletion fails
    }

    // Then delete the message
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id)

    if (error) {
      console.error("Message deletion error:", error)
      return {
        success: false,
        message: "Mesaj silinirken bir hata oluştu.",
      }
    }

    revalidatePath("/admin/messages")

    return {
      success: true,
      message: "Mesaj başarıyla silindi.",
    }
  } catch (error) {
    console.error("Message deletion error:", error)
    return {
      success: false,
      message: "Mesaj silinirken bir hata oluştu.",
    }
  }
}
