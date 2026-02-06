"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  const supabase = await createServerSupabaseClient()

  // Kullanıcının oturum açıp açmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Ayarları getir
  const { data, error } = await supabase.from("settings").select("*")

  if (error) {
    throw new Error(error.message)
  }

  // Ayarları key-value formatına dönüştür
  const settings = data.reduce((acc: Record<string, any>, item) => {
    acc[item.id] = item.value
    return acc
  }, {})

  return settings
}

export async function updateSettings(id: string, value: any) {
  const supabase = await createServerSupabaseClient()

  // Kullanıcının oturum açıp açmadığını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Ayarı güncelle
  const { data, error } = await supabase.from("settings").upsert({ id, value, updated_by: session.user.id }).select()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/admin/settings")
  return data[0]
}
