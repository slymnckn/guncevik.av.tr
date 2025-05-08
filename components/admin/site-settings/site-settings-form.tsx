"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ColorPicker } from "./color-picker"
import { ImageUploader } from "./image-uploader"
import { updateSiteSettings } from "@/actions/site-actions"

export function SiteSettingsForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)

      const result = await updateSiteSettings(formData)

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Site ayarları başarıyla güncellendi.",
        })
        router.refresh()
      }
    } catch (error) {
      console.error("Form gönderilirken hata:", error)
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="appearance">Görünüm</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
              <CardDescription>Sitenizin temel bilgilerini buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_title">Site Başlığı</Label>
                <Input id="site_title" name="site_title" placeholder="Günçevik Hukuk Bürosu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Site Açıklaması</Label>
                <Textarea
                  id="site_description"
                  name="site_description"
                  placeholder="Hukuki danışmanlık ve avukatlık hizmetleri..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Site Logosu</Label>
                <ImageUploader name="site_logo" />
              </div>
              <div className="space-y-2">
                <Label>Favicon</Label>
                <ImageUploader name="site_favicon" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Görünüm Ayarları</CardTitle>
              <CardDescription>Sitenizin renklerini ve görsel öğelerini buradan özelleştirebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Ana Renk</Label>
                <ColorPicker id="primary_color" name="primary_color" defaultValue="#3b82f6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">İkincil Renk</Label>
                <ColorPicker id="secondary_color" name="secondary_color" defaultValue="#10b981" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font_family">Font</Label>
                <select id="font_family" name="font_family" className="w-full p-2 border rounded-md">
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Hero Görseli</Label>
                <ImageUploader name="hero_image" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
              <CardDescription>İletişim bilgilerinizi buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">E-posta</Label>
                <Input id="contact_email" name="contact_email" type="email" placeholder="info@guncevik.av.tr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Telefon</Label>
                <Input id="contact_phone" name="contact_phone" placeholder="+90 212 123 45 67" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_address">Adres</Label>
                <Textarea id="contact_address" name="contact_address" placeholder="İstanbul, Türkiye" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_maps_url">Google Maps URL</Label>
                <Input id="google_maps_url" name="google_maps_url" placeholder="https://maps.google.com/..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Ayarları</CardTitle>
              <CardDescription>
                Arama motoru optimizasyonu için gerekli ayarları buradan yapabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Başlık</Label>
                <Input id="meta_title" name="meta_title" placeholder="Günçevik Hukuk Bürosu | Avukatlık Hizmetleri" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Açıklama</Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  placeholder="Hukuki danışmanlık ve avukatlık hizmetleri..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Anahtar Kelimeler</Label>
                <Input id="meta_keywords" name="meta_keywords" placeholder="avukat, hukuk bürosu, danışmanlık, dava" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                <Input id="google_analytics_id" name="google_analytics_id" placeholder="G-XXXXXXXXXX" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </form>
  )
}
