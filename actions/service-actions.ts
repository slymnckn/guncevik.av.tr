"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"

// Hizmet oluşturma
export async function createService(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const title = formData.get("title") as string
  const slug = (formData.get("slug") as string) || slugify(title)
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const icon = (formData.get("icon") as string) || "briefcase"
  const orderIndex = Number.parseInt(formData.get("order_index") as string) || 0
  const isFeatured = formData.get("is_featured") === "on"

  if (!title) {
    return { success: false, message: "Başlık alanı zorunludur." }
  }

  try {
    const { data, error } = await supabase
      .from("services")
      .insert([
        {
          title,
          slug: slug || slugify(title),
          description,
          content,
          icon,
          order_index: orderIndex,
          is_featured: isFeatured,
        },
      ])
      .select()

    if (error) {
      console.error("Hizmet oluşturma hatası:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/services")
    revalidatePath("/hizmetlerimiz")
    redirect("/admin/services")
  } catch (error) {
    console.error("Hizmet oluşturma hatası:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    }
  }
}

// Hizmet güncelleme
export async function updateService(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const slug = (formData.get("slug") as string) || slugify(title)
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const icon = (formData.get("icon") as string) || "briefcase"
  const orderIndex = Number.parseInt(formData.get("order_index") as string) || 0
  const isFeatured = formData.get("is_featured") === "on"

  if (!id || !title) {
    return { success: false, message: "ID ve başlık alanları zorunludur." }
  }

  try {
    // Önce mevcut hizmeti alalım (eski slug için)
    const { data: existingService } = await supabase.from("services").select("slug").eq("id", id).single()

    const { data, error } = await supabase
      .from("services")
      .update({
        title,
        slug: slug || slugify(title),
        description,
        content,
        icon,
        order_index: orderIndex,
        is_featured: isFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Hizmet güncelleme hatası:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/services")
    revalidatePath("/hizmetlerimiz")

    // Eski ve yeni slug'ları revalidate et
    if (existingService?.slug) {
      revalidatePath(`/hizmetlerimiz/${existingService.slug}`)
    }
    revalidatePath(`/hizmetlerimiz/${slug}`)

    redirect("/admin/services")
  } catch (error) {
    console.error("Hizmet güncelleme hatası:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    }
  }
}

// Hizmet silme
export async function deleteService(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const id = formData.get("id") as string

  if (!id) {
    return { success: false, message: "ID alanı zorunludur." }
  }

  try {
    // Önce hizmetin slug'ını alalım (revalidatePath için)
    const { data: service, error: fetchError } = await supabase.from("services").select("slug").eq("id", id).single()

    if (fetchError) {
      console.error("Hizmet getirme hatası:", fetchError)
      return { success: false, message: fetchError.message }
    }

    // Hizmeti silelim
    const { error } = await supabase.from("services").delete().eq("id", id)

    if (error) {
      console.error("Hizmet silme hatası:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/services")
    revalidatePath("/hizmetlerimiz")
    if (service?.slug) {
      revalidatePath(`/hizmetlerimiz/${service.slug}`)
    }
    redirect("/admin/services")
  } catch (error) {
    console.error("Hizmet silme hatası:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    }
  }
}

// Hizmetleri getir
export async function getServices() {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("services").select("*").order("order_index", { ascending: true })

    if (error) {
      console.error("Hizmetleri getirme hatası:", error)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Hizmetleri getirme hatası:", error)
    throw error
  }
}

// Hizmet detayını getir
export async function getServiceById(id: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("services").select("*").eq("id", id).single()

    if (error) {
      console.error("Hizmet getirme hatası:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Hizmet getirme hatası:", error)
    throw error
  }
}

// Hizmet detayını slug ile getir
export async function getServiceBySlug(slug: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("services").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Hizmet getirme hatası:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Hizmet getirme hatası:", error)
    throw error
  }
}
