"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createService, updateService } from "@/actions/service-actions"
import { Loader2 } from "lucide-react"
// İkon seçici için import ekleyelim
import { IconPicker } from "@/components/admin/icon-picker"

interface ServiceFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    description: string
    content: string
    icon: string
    order_index: number
    is_featured: boolean
  }
  isEditing?: boolean
}

export function ServiceForm({ initialData, isEditing = false }: ServiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  // Ayrıca, component içinde state ekleyelim:
  // useState import'unun altına ekleyelim:
  const [icon, setIcon] = useState(initialData?.icon || "Briefcase")

  // Slug oluşturma yardımcı fonksiyonu
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Eğer slug manuel olarak değiştirilmediyse veya boşsa, otomatik slug oluştur
    if (!isEditing || !slug) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Uygun action'ı çağır
      const result = isEditing ? await updateService(formData) : await createService(formData)

      if (!result.success) {
        setError(result.message)
        setIsLoading(false)
        return
      }

      router.push("/admin/services")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={initialData?.id} />}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">{error}</div>}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Başlık</Label>
          <Input id="title" name="title" value={title} onChange={handleTitleChange} required />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <p className="text-sm text-muted-foreground mt-1">URL'de görünecek benzersiz tanımlayıcı</p>
        </div>

        <div>
          <Label htmlFor="description">Kısa Açıklama</Label>
          <Textarea id="description" name="description" defaultValue={initialData?.description || ""} rows={3} />
        </div>

        <div>
          <Label htmlFor="content">İçerik</Label>
          <Textarea id="content" name="content" defaultValue={initialData?.content || ""} rows={10} />
        </div>

        {/* İkon input alanını IconPicker ile değiştirelim */}
        {/* Aşağıdaki kodu: */}
        {/* <div>
          <Label htmlFor="icon">İkon (Lucide ikon adı)</Label>
          <Input
            id="icon"
            name="icon"
            defaultValue={initialData?.icon || ""}
            placeholder="Örn: FileText, Scale, Briefcase"
          />
          <p className="text-sm text-muted-foreground mt-1">Lucide ikonlarından birinin adını girin (isteğe bağlı)</p>
        </div> */}
        {/* Bu kod ile değiştirelim: */}
        <div>
          <Label htmlFor="icon">İkon Seçin</Label>
          <input type="hidden" name="icon" value={icon} />
          <IconPicker value={icon} onChange={setIcon} />
          <p className="text-sm text-muted-foreground mt-1">Hizmet için kullanılacak ikonu seçin</p>
        </div>

        <div>
          <Label htmlFor="order_index">Sıralama</Label>
          <Input id="order_index" name="order_index" type="number" defaultValue={initialData?.order_index || 0} />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="is_featured" name="is_featured" defaultChecked={initialData?.is_featured || false} />
          <Label htmlFor="is_featured">Öne Çıkan Hizmet</Label>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Güncelle" : "Oluştur"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/services")}>
          İptal
        </Button>
      </div>
    </form>
  )
}
