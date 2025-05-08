"use server"
import { revalidatePath } from "next/cache"
import { slugify } from "@/lib/utils"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"

export async function createTag(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) {
    return { error: "Etiket adı zorunludur" }
  }

  const slug = slugify(name)

  try {
    // Admin Supabase istemcisini kullan (RLS'yi bypass eder)
    const supabase = createAdminSupabaseClient()

    // Slug'ın benzersiz olup olmadığını kontrol et
    const { data: existingTag } = await supabase.from("blog_tags").select("id").eq("slug", slug).maybeSingle()

    if (existingTag) {
      return { error: "Bu isimde bir etiket zaten var" }
    }

    const { data, error } = await supabase
      .from("blog_tags")
      .insert({
        name,
        slug,
        description,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/admin/blog/tags")
    return { success: true, data }
  } catch (error) {
    console.error("Etiket oluşturulurken hata oluştu:", error)
    return { error: "Etiket oluşturulurken bir hata oluştu" }
  }
}

export async function updateTag(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!id || !name) {
    return { error: "Etiket ID ve adı zorunludur" }
  }

  const slug = slugify(name)

  try {
    // Admin Supabase istemcisini kullan (RLS'yi bypass eder)
    const supabase = createAdminSupabaseClient()

    // Slug'ın benzersiz olup olmadığını kontrol et (kendi ID'si hariç)
    const { data: existingTag } = await supabase
      .from("blog_tags")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle()

    if (existingTag) {
      return { error: "Bu isimde bir etiket zaten var" }
    }

    const { data, error } = await supabase
      .from("blog_tags")
      .update({
        name,
        slug,
        description,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/admin/blog/tags")
    return { success: true, data }
  } catch (error) {
    console.error("Etiket güncellenirken hata oluştu:", error)
    return { error: "Etiket güncellenirken bir hata oluştu" }
  }
}

export async function deleteTag(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) {
    return { error: "Etiket ID'si zorunludur" }
  }

  try {
    // Admin Supabase istemcisini kullan (RLS'yi bypass eder)
    const supabase = createAdminSupabaseClient()

    // Önce ilişkili kayıtları sil
    await supabase.from("blog_post_tags").delete().eq("tag_id", id)

    // Sonra etiketi sil
    const { error } = await supabase.from("blog_tags").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/blog/tags")
    return { success: true }
  } catch (error) {
    console.error("Etiket silinirken hata oluştu:", error)
    return { error: "Etiket silinirken bir hata oluştu" }
  }
}

export async function getTags() {
  try {
    // Admin Supabase istemcisini kullan (RLS'yi bypass eder)
    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase.from("blog_tags").select("*").order("name")

    if (error) throw error

    return { data }
  } catch (error) {
    console.error("Etiketler getirilirken hata oluştu:", error)
    return { error: "Etiketler getirilirken bir hata oluştu" }
  }
}

export async function getTagById(id: string) {
  try {
    // Admin Supabase istemcisini kullan (RLS'yi bypass eder)
    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase.from("blog_tags").select("*").eq("id", id).single()

    if (error) throw error

    return { data }
  } catch (error) {
    console.error("Etiket getirilirken hata oluştu:", error)
    return { error: "Etiket getirilirken bir hata oluştu" }
  }
}
