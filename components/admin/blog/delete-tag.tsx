"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteTag } from "@/actions/tag-actions"

interface DeleteTagProps {
  tag: {
    id: string
    name: string
  }
  postCount: number
}

export function DeleteTag({ tag, postCount }: DeleteTagProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("id", tag.id)

      const result = await deleteTag(formData)

      if (result.error) {
        setError(result.error)
        return
      }

      router.push("/admin/blog/tags")
      router.refresh()
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
        <p className="text-amber-800">
          <strong>{tag.name}</strong> etiketini silmek istediğinize emin misiniz?
        </p>
        {postCount > 0 && (
          <p className="text-amber-700 mt-2 text-sm">
            Bu etiket {postCount} blog yazısında kullanılıyor. Etiketi sildiğinizde, bu yazılardan etiket
            kaldırılacaktır.
          </p>
        )}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

      <div className="flex items-center gap-4">
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? "Siliniyor..." : "Evet, Sil"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog/tags")}>
          İptal
        </Button>
      </div>
    </div>
  )
}
