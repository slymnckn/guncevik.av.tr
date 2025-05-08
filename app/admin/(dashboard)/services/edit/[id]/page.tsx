"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    icon: "briefcase",
    is_featured: false,
    order_index: 0,
  })

  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true)
        const supabase = createClientSupabaseClient()

        // Hizmeti getir
        const { data, error } = await supabase.from("services").select("*").eq("id", id).single()

        if (error) {
          console.error("Hizmet getirme hatası:", error)
          setError(`Hizmet getirilirken bir hata oluştu: ${error.message}`)
          return
        }

        if (!data) {
          setError("Hizmet bulunamadı.")
          return
        }

        setFormData(data)
      } catch (err) {
        console.error("Beklenmeyen hata:", err)
        setError("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_featured: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClientSupabaseClient()

      // Hizmeti güncelle
      const { data, error } = await supabase.from("services").update(formData).eq("id", id).select()

      if (error) {
        console.error("Hizmet güncelleme hatası:", error)
        setError(`Hizmet güncellenirken bir hata oluştu: ${error.message}`)
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
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Hizmet Düzenle</h1>
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
        <Card>
          <CardHeader>
            <div className="w-48 h-7 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-96 h-5 bg-gray-200 animate-pulse rounded-md"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-full h-12 bg-gray-200 animate-pulse rounded-md"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hizmet Düzenle</h1>
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
          <CardDescription>Hizmet bilgilerini düzenlemek için aşağıdaki formu kullanın.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-md">
              <p>Hizmet başarıyla güncellendi! Yönlendiriliyorsunuz...</p>
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
                <p className="text-sm text-muted-foreground mt-1">URL'de görünecek benzersiz tanımlayıcı.</p>
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

            <Button type="submit" disabled={saving}>
              {saving ? (
                <>Kaydediliyor...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Değişiklikleri Kaydet
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
