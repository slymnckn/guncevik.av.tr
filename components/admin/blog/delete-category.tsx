"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/actions/blog-actions"
import type { BlogCategory } from "@/lib/types/admin"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteCategoryProps {
  category: BlogCategory
}

export function DeleteCategory({ category }: DeleteCategoryProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteCategory(category.id)

      if (!result.success) {
        throw new Error(result.message || "Bir hata oluştu")
      }

      router.push("/admin/blog/categories")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      console.error("Kategori silme hatası:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Dikkat:</strong> Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
        <h3 className="font-medium">Kategori Bilgileri</h3>
        <p className="mt-2">
          <strong>Ad:</strong> {category.name}
        </p>
        <p>
          <strong>Slug:</strong> {category.slug}
        </p>
        {category.description && (
          <p>
            <strong>Açıklama:</strong> {category.description}
          </p>
        )}
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-md">{error}</div>}

      <div className="flex justify-end">
        <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()} disabled={isDeleting}>
          İptal
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Siliniyor...
            </>
          ) : (
            "Kategoriyi Sil"
          )}
        </Button>
      </div>
    </div>
  )
}
