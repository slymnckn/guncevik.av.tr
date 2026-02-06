"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getNotifications(limit = 20, offset = 0, isRead?: boolean) {
  const supabase = await createServerSupabaseClient()

  // Kullanıcının oturum açıp açmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  let query = supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1)

  if (isRead !== undefined) {
    query = query.eq("is_read", isRead)
  }

  const { data, error, count } = await query

  if (error) {
    throw new Error(error.message)
  }

  return { data, count }
}

export async function markNotificationAsRead(id: string) {
  const supabase = await createServerSupabaseClient()

  // Kullanıcının oturum açıp açmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id).select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/notifications")
  return data[0]
}

export async function markAllNotificationsAsRead() {
  const supabase = await createServerSupabaseClient()

  // Kullanıcının oturum açıp açmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase.from("notifications").update({ is_read: true }).eq("is_read", false).select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/notifications")
  return { success: true, count: data.length }
}

export async function createNotification(title: string, message: string, type: string, link?: string, userId?: string) {
  const supabase = await createServerSupabaseClient()

  // Kullanıcının admin olup olmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("notifications")
    .insert({ title, message, type, link, user_id: userId })
    .select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/notifications")
  return data[0]
}
