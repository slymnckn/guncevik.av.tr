"use server"

import { revalidatePath } from "next/cache"

// Tüm önbelleği temizle
export async function clearAllCache() {
  try {
    // Tüm sayfaları yeniden doğrula
    revalidatePath("/", "layout")

    return { success: true, message: "Tüm önbellek başarıyla temizlendi." }
  } catch (error) {
    console.error("Önbellek temizleme hatası:", error)

    return { success: false, message: "Önbellek temizlenirken bir hata oluştu." }
  }
}

// Blog önbelleğini temizle
export async function clearBlogCache() {
  try {
    // Blog sayfalarını yeniden doğrula
    revalidatePath("/makaleler")
    revalidatePath("/makaleler/[slug]", "page")
    revalidatePath("/makaleler/kategori/[slug]", "page")
    revalidatePath("/makaleler/etiket/[slug]", "page")

    return { success: true, message: "Blog önbelleği başarıyla temizlendi." }
  } catch (error) {
    console.error("Blog önbelleği temizleme hatası:", error)
    return { success: false, message: "Blog önbelleği temizlenirken bir hata oluştu." }
  }
}

// Hizmet önbelleğini temizle
export async function clearServiceCache() {
  try {
    // Hizmetler sayfasını yeniden doğrula
    revalidatePath("/hizmetlerimiz")

    return { success: true, message: "Hizmet önbelleği başarıyla temizlendi." }
  } catch (error) {
    console.error("Hizmet önbelleği temizleme hatası:", error)
    return { success: false, message: "Hizmet önbelleği temizlenirken bir hata oluştu." }
  }
}
