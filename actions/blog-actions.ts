"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createAdminSupabaseClient } from "@/lib/supabase/admin"
import { slugify } from "@/lib/utils"
import type { BlogPost } from "@/lib/types/admin"

// Bucket adı - Supabase'de oluşturduğunuz bucket adı
const BUCKET_NAME = "blog-images"

// Blog yazısı getir
export async function getBlogPost(slug: string) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        blog_categories(*),
        blog_post_tags(blog_tags(*))
      `)
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error) {
      console.error("Blog yazısı getirme hatası:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Blog yazısı getirme hatası:", error)
    return null
  }
}

// Blog yazılarını getir
export async function getBlogPosts(page = 1, limit = 10) {
  const supabase = createServerSupabaseClient()
  const offset = (page - 1) * limit

  try {
    const { data, error, count } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        blog_categories(*),
        blog_post_tags(blog_tags(*))
      `,
        { count: "exact" },
      )
      .eq("published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Blog yazıları getirme hatası:", error)
      return { posts: [], count: 0 }
    }

    return { posts: data || [], count: count || 0 }
  } catch (error) {
    console.error("Blog yazıları getirme hatası:", error)
    return { posts: [], count: 0 }
  }
}

// Blog yazısı ekleme
export async function createBlogPost(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()
    // Admin client'ı oluştur (servis rolü ile)
    const adminClient = createAdminSupabaseClient()

    // Form verilerini al
    const title = formData.get("title") as string
    const slug = (formData.get("slug") as string) || slugify(title)
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const categoryId = formData.get("category_id") as string
    const metaTitle = formData.get("meta_title") as string
    const metaDescription = formData.get("meta_description") as string
    const published = formData.has("published")
    const image = formData.get("image") as File

    // Kullanıcı bilgilerini al
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "Kullanıcı oturumu bulunamadı." }
    }

    // Resim yükleme işlemi
    let imagePath = null

    if (image && image.size > 0) {
      try {
        const fileExt = image.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `blog/${fileName}`

        // Admin client ile resmi yükle (RLS bypass)
        const { error: uploadError } = await adminClient.storage.from(BUCKET_NAME).upload(filePath, image)

        if (uploadError) {
          console.error(`Resim yükleme hatası: ${uploadError.message}`)
          return { success: false, message: "Resim yüklenemedi: " + uploadError.message }
        } else {
          imagePath = filePath
        }
      } catch (uploadErr: any) {
        console.error("Resim yükleme hatası:", uploadErr)
        return { success: false, message: "Resim yükleme hatası: " + uploadErr.message }
      }
    }

    // Blog yazısını ekle
    const { data, error } = await supabase.from("blog_posts").insert([
      {
        title,
        slug,
        excerpt,
        content,
        category_id: categoryId || null,
        author_id: user.id,
        meta_title: metaTitle,
        meta_description: metaDescription,
        published,
        published_at: published ? new Date().toISOString() : null,
        image_path: imagePath,
      },
    ])

    if (error) {
      throw new Error(`Blog yazısı eklenirken hata oluştu: ${error.message}`)
    }

    revalidatePath("/admin/blog")
    revalidatePath("/makaleler")

    return { success: true, data }
  } catch (error: any) {
    console.error("Blog yazısı eklenirken hata:", error)
    return { success: false, message: error.message }
  }
}

// Blog yazısı güncelleme
export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()
    // Admin client'ı oluştur (servis rolü ile)
    const adminClient = createAdminSupabaseClient()

    // Form verilerini al
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const categoryId = formData.get("category_id") as string
    const metaTitle = formData.get("meta_title") as string
    const metaDescription = formData.get("meta_description") as string
    const published = formData.has("published")
    const image = formData.get("image") as File

    // Mevcut blog yazısını al
    const { data: existingPost, error: fetchError } = await supabase
      .from("blog_posts")
      .select("published, image_path")
      .eq("id", id)
      .single()

    if (fetchError) {
      throw new Error(`Blog yazısı bulunamadı: ${fetchError.message}`)
    }

    // Resim yükleme işlemi
    let imagePath = existingPost.image_path

    if (image && image.size > 0) {
      try {
        const fileExt = image.name.split(".").pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `blog/${fileName}`

        // Admin client ile resmi yükle (RLS bypass)
        const { error: uploadError } = await adminClient.storage.from(BUCKET_NAME).upload(filePath, image)

        if (uploadError) {
          console.error(`Resim yükleme hatası: ${uploadError.message}`)
          return { success: false, message: "Resim yüklenemedi: " + uploadError.message }
        } else {
          // Eski resmi sil
          if (existingPost.image_path) {
            await adminClient.storage.from(BUCKET_NAME).remove([existingPost.image_path])
          }

          imagePath = filePath
        }
      } catch (uploadErr: any) {
        console.error("Resim yükleme hatası:", uploadErr)
        return { success: false, message: "Resim yükleme hatası: " + uploadErr.message }
      }
    }

    // Blog yazısını güncelle
    const updateData: Partial<BlogPost> = {
      title,
      slug,
      excerpt,
      content,
      category_id: categoryId || null,
      meta_title: metaTitle,
      meta_description: metaDescription,
      published,
      image_path: imagePath,
    }

    // Eğer yazı yayınlanmamışken yayınlanıyorsa, yayınlanma tarihini ekle
    if (published && !existingPost.published) {
      updateData.published_at = new Date().toISOString()
    }

    const { error } = await supabase.from("blog_posts").update(updateData).eq("id", id)

    if (error) {
      throw new Error(`Blog yazısı güncellenirken hata oluştu: ${error.message}`)
    }

    revalidatePath(`/admin/blog/edit/${id}`)
    revalidatePath("/admin/blog")
    revalidatePath("/makaleler")
    revalidatePath(`/makaleler/${slug}`)

    return { success: true }
  } catch (error: any) {
    console.error("Blog yazısı güncellenirken hata:", error)
    return { success: false, message: error.message }
  }
}

// Blog yazısı silme
export async function deleteBlogPost(id: string) {
  try {
    const supabase = createServerSupabaseClient()
    // Admin client'ı oluştur (servis rolü ile)
    const adminClient = createAdminSupabaseClient()

    // Önce blog yazısını al
    const { data: post, error: fetchError } = await supabase
      .from("blog_posts")
      .select("image_path")
      .eq("id", id)
      .single()

    if (fetchError) {
      throw new Error(`Blog yazısı bulunamadı: ${fetchError.message}`)
    }

    // Eğer resim varsa, resmi sil
    if (post.image_path) {
      try {
        // Admin client ile resmi sil (RLS bypass)
        await adminClient.storage.from(BUCKET_NAME).remove([post.image_path])
      } catch (error) {
        console.error("Resim silinirken hata:", error)
      }
    }

    // Blog yazısını sil
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) {
      throw new Error(`Blog yazısı silinirken hata oluştu: ${error.message}`)
    }

    revalidatePath("/admin/blog")
    revalidatePath("/makaleler")

    return { success: true }
  } catch (error: any) {
    console.error("Blog yazısı silinirken hata:", error)
    return { success: false, message: error.message }
  }
}

// Kategori ekleme
export async function createCategory(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()

    // Form verilerini al
    const name = formData.get("name") as string
    const slug = (formData.get("slug") as string) || slugify(name)
    const description = formData.get("description") as string
    const metaTitle = formData.get("meta_title") as string
    const metaDescription = formData.get("meta_description") as string
    const isActive = formData.has("is_active")

    // Kategoriyi ekle
    const { data, error } = await supabase.from("blog_categories").insert([
      {
        name,
        slug,
        description,
        meta_title: metaTitle,
        meta_description: metaDescription,
        is_active: isActive,
      },
    ])

    if (error) {
      throw new Error(`Kategori eklenirken hata oluştu: ${error.message}`)
    }

    revalidatePath("/admin/blog/categories")

    return { success: true, data }
  } catch (error: any) {
    console.error("Kategori eklenirken hata:", error)
    return { success: false, message: error.message }
  }
}

// Kategori güncelleme
export async function updateCategory(id: string, formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()

    // Form verilerini al
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const metaTitle = formData.get("meta_title") as string
    const metaDescription = formData.get("meta_description") as string
    const isActive = formData.has("is_active")

    // Kategoriyi güncelle
    const { error } = await supabase
      .from("blog_categories")
      .update({
        name,
        slug,
        description,
        meta_title: metaTitle,
        meta_description: metaDescription,
        is_active: isActive,
      })
      .eq("id", id)

    if (error) {
      throw new Error(`Kategori güncellenirken hata oluştu: ${error.message}`)
    }

    revalidatePath(`/admin/blog/categories/edit/${id}`)
    revalidatePath("/admin/blog/categories")

    return { success: true }
  } catch (error: any) {
    console.error("Kategori güncellenirken hata:", error)
    return { success: false, message: error.message }
  }
}

// Kategori silme
export async function deleteCategory(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Önce bu kategoriye ait blog yazılarını kontrol et
    const { count, error: countError } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id)

    if (countError) {
      throw new Error(`Kategori kontrol edilirken hata oluştu: ${countError.message}`)
    }

    if (count && count > 0) {
      throw new Error(
        `Bu kategoriye ait ${count} adet blog yazısı bulunmaktadır. Önce bu yazıları başka bir kategoriye taşıyın veya silin.`,
      )
    }

    // Kategoriyi sil
    const { error } = await supabase.from("blog_categories").delete().eq("id", id)

    if (error) {
      throw new Error(`Kategori silinirken hata oluştu: ${error.message}`)
    }

    revalidatePath("/admin/blog/categories")

    return { success: true }
  } catch (error: any) {
    console.error("Kategori silinirken hata:", error)
    return { success: false, message: error.message }
  }
}

// Tüm kategorileri getir
export async function getAllCategories() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("blog_categories").select("*").order("name")

    if (error) {
      throw new Error(`Kategoriler getirilirken hata oluştu: ${error.message}`)
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Kategoriler getirilirken hata:", error)
    return { success: false, message: error.message, data: [] }
  }
}
