"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createCategory, updateCategory } from "@/actions/blog-actions"
import type { BlogCategory } from "@/lib/types/admin"
import { Loader2, Save } from "lucide-react"
import { slugify } from "@/lib/utils"

interface CategoryFormProps {
  category?: BlogCategory
  isEdit?: boolean
}

export function CategoryForm({ category, isEdit = false }: CategoryFormProps) {
  const router = useRouter()
  const [name, setName] = useState(category?.name || "")
  const [slug, setSlug] = useState(category?.slug || "")
  const [description, setDescription] = useState(category?.description || "")
  const [metaTitle, setMetaTitle] = useState(category?.meta_title || "")
  const [metaDescription, setMetaDescription] = useState(category?.meta_description || "")
  const [isActive, setIsActive] = useState(category?.is_active !== false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Başlık değiştiğinde slug otomatik oluştur (sadece yeni kategori oluşturulurken)
  useEffect(() => {
    if (!isEdit && name) {
      setSlug(slugify(name))
    }
  }, [name, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("slug", slug)
      formData.append("description", description)
      formData.append("meta_title", metaTitle)
      formData.append("meta_description", metaDescription)
      if (isActive) formData.append("is_active", "true")

      let result

      if (isEdit && category) {
        result = await updateCategory(category.id, formData)
      } else {
        result = await createCategory(formData)
      }

      if (!result.success) {
        throw new Error(result.message || "Bir hata oluştu")
      }

      router.push("/admin/blog/categories")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      console.error("Kategori form hatası:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Kategori Adı
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Açıklama
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="metaTitle" className="block text-sm font-medium mb-1">
            Meta Başlık
          </label>
          <input
            type="text"
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium mb-1">
            Meta Açıklama
          </label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-primary border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm">
          Aktif
        </label>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-md">{error}</div>}

      <div className="flex justify-end">
        <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()} disabled={isSubmitting}>
          İptal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Kaydet
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
