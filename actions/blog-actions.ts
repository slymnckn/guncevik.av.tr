"use server"

import { revalidatePath } from "next/cache"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { slugify } from "@/lib/utils"

export async function deleteBlogPost(id: string) {
  try {
    const supabase = createAdminSupabaseClient()

    // Önce ilişkili kayıtları sil
    await supabase.from("blog_post_tags").delete().eq("post_id", id)

    // Sonra blog yazısını sil
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) {
      console.error("Blog yazısı silinirken hata oluştu:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/blog")
    revalidatePath("/makaleler")

    return { success: true }
  } catch (error) {
    console.error("Blog yazısı silinirken hata oluştu:", error)
    return { success: false, message: "Blog yazısı silinirken bir hata oluştu" }
  }
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const meta_title = formData.get("meta_title") as string
  const meta_description = formData.get("meta_description") as string
  const is_active = formData.get("is_active") === "true"

  if (!name) {
    return { success: false, message: "Kategori adı zorunludur" }
  }

  const slug = slugify(name)

  try {
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase
      .from("blog_categories")
      .insert({
        name,
        slug,
        description,
        meta_title,
        meta_description,
        is_active,
      })
      .select()

    if (error) {
      console.error("Kategori oluşturulurken hata oluştu:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/blog/categories")
    return { success: true }
  } catch (error) {
    console.error("Kategori oluşturulurken hata oluştu:", error)
    return { success: false, message: "Kategori oluşturulurken bir hata oluştu" }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const meta_title = formData.get("meta_title") as string
  const meta_description = formData.get("meta_description") as string
  const is_active = formData.get("is_active") === "true"

  if (!name) {
    return { success: false, message: "Kategori adı zorunludur" }
  }

  const slug = slugify(name)

  try {
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase
      .from("blog_categories")
      .update({
        name,
        slug,
        description,
        meta_title,
        meta_description,
        is_active,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Kategori güncellenirken hata oluştu:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/blog/categories")
    return { success: true }
  } catch (error) {
    console.error("Kategori güncellenirken hata oluştu:", error)
    return { success: false, message: "Kategori güncellenirken bir hata oluştu" }
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = createAdminSupabaseClient()

    // Önce ilişkili blog_posts'ları güncelle
    const { error: updateError } = await supabase.from("blog_posts").update({ category_id: null }).eq("category_id", id)

    if (updateError) {
      console.error("İlişkili blog yazıları güncellenirken hata oluştu:", updateError)
      return { success: false, message: "İlişkili blog yazıları güncellenirken bir hata oluştu" }
    }

    // Sonra kategoriyi sil
    const { error } = await supabase.from("blog_categories").delete().eq("id", id)

    if (error) {
      console.error("Kategori silinirken hata oluştu:", error)
      return { success: false, message: error.message }
    }

    revalidatePath("/admin/blog/categories")
    return { success: true }
  } catch (error) {
    console.error("Kategori silinirken hata oluştu:", error)
    return { success: false, message: "Kategori silinirken bir hata oluştu" }
  }
}
