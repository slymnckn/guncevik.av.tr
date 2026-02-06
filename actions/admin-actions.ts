"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function updateContactStatus(id: string, status: string) {
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
      console.error("Error updating contact status:", error)
      return { success: false, message: error.message }
    }

    revalidatePath(`/admin/messages/${id}`)
    revalidatePath("/admin/messages")
    revalidatePath("/admin") // Revalidate dashboard

    return { success: true }
  } catch (error) {
    console.error("Error in updateContactStatus:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function deleteContactSubmission(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.from("contact_submissions").delete().eq("id", id)

    if (error) {
      console.error("Error deleting contact submission:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/messages")
    revalidatePath("/admin") // Revalidate dashboard

    return { success: true }
  } catch (error) {
    console.error("Error in deleteContactSubmission:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Simple authentication for admin panel
export async function adminLogin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  // In a real application, you would use Supabase Auth or another authentication system
  // This is a simple example for demonstration purposes only
  if (username === "admin" && password === "password") {
    // Set a cookie or session to indicate the user is logged in
    // For a real application, use a proper authentication system

    redirect("/admin")
  }

  return { success: false, message: "Invalid username or password" }
}
