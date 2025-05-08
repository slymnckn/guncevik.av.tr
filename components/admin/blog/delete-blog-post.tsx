"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"
import { deleteBlogPost } from "@/actions/blog-actions"
import type { BlogPost } from "@/lib/types/admin"

interface DeleteBlogPostProps {
  post: BlogPost & {
    blog_categories?: {
      name: string
    }
  }
}

export function DeleteBlogPost({ post }: DeleteBlogPostProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteBlogPost(post.id)

      if (result.success) {
        router.push("/admin/blog")
        router.refresh()
      } else {
        setError(result.message || "Makale silinirken bir hata oluştu.")
      }
    } catch (err: any) {
      setError(err.message || "Beklenmeyen bir hata oluştu.")
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
              <strong>Dikkat:</strong> Bu makaleyi silmek üzeresiniz. Bu işlem geri alınamaz.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Kategori: {post.blog_categories?.name || "Kategorisiz"}
        </p>
        <p className="text-sm">{post.excerpt || post.content.substring(0, 150)}...</p>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-md">{error}</div>}

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isDeleting}>
          İptal
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700"
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Siliniyor...
            </>
          ) : (
            "Makaleyi Sil"
          )}
        </Button>
      </div>
    </div>
  )
}
