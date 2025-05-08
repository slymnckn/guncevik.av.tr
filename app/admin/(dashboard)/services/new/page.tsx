"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

// İkon seçici için import ekleyelim
import { IconPicker } from "@/components/admin/icon-picker"

export default function NewServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    icon: "briefcase", // Default icon
    is_featured: false,
    order_index: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Başlık değiştiğinde otomatik slug oluştur
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")

      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_featured: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClientSupabaseClient()

      // Hizmeti ekle
      const { data, error } = await supabase.from("services").insert([formData]).select()

      if (error) {
        console.error("Hizmet ekleme hatası:", error)
        setError(`Hizmet eklenirken bir hata oluştu: ${error.message}`)
        return
      }

      setSuccess(true)

      // Başarılı olduktan sonra hizmetler sayfasına yönlendir
      setTimeout(() => {
        router.push("/admin/services")
      }, 1500)
    } catch (err) {
      console.error("Beklenmeyen hata:", err)
      setError("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Yeni Hizmet Ekle</h1>
        <Link href="/admin/services" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Hizmetlere Dön
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hizmet Bilgileri</CardTitle>
          <CardDescription>Yeni bir hizmet eklemek için aşağıdaki formu doldurun.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-md">
              <p>Hizmet başarıyla eklendi! Yönlendiriliyorsunuz...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
                <p className="text-sm text-muted-foreground mt-1">
                  URL'de görünecek benzersiz tanımlayıcı. Otomatik oluşturulur, gerekirse düzenleyebilirsiniz.
                </p>
              </div>

              <div>
                <Label htmlFor="description">Kısa Açıklama</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">İçerik</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={10}
                  required
                />
              </div>

              <div>
                <Label htmlFor="icon">İkon Seçin</Label>
                <IconPicker
                  value={formData.icon}
                  onChange={(iconName) => setFormData((prev) => ({ ...prev, icon: iconName }))}
                />
                <p className="text-sm text-muted-foreground mt-1">Hizmet için kullanılacak ikonu seçin</p>
              </div>

              <div>
                <Label htmlFor="order_index">Sıralama</Label>
                <Input
                  id="order_index"
                  name="order_index"
                  type="number"
                  value={formData.order_index.toString()}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Hizmetin görüntülenme sırası. Küçük sayılar önce gösterilir.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="is_featured" checked={formData.is_featured} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="is_featured">Öne Çıkan Hizmet</Label>
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>Kaydediliyor...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Hizmeti Kaydet
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
