"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createTag, updateTag } from "@/actions/tag-actions"

interface TagFormProps {
  initialData?: {
    id: string
    name: string
    slug: string
    description: string
  }
}

export function TagForm({ initialData }: TagFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = initialData ? await updateTag(formData) : await createTag(formData)

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {initialData && <input type="hidden" name="id" value={initialData.id} />}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Etiket Adı
        </label>
        <Input id="name" name="name" defaultValue={initialData?.name || ""} required />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Açıklama
        </label>
        <Textarea id="description" name="description" defaultValue={initialData?.description || ""} rows={3} />
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog/tags")}>
          İptal
        </Button>
      </div>
    </form>
  )
}
