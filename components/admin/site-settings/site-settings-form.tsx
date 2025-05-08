"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { updateSetting, getSettings } from "@/actions/settings-actions"

export function SiteSettingsForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings()
        if (data) {
          setSettings(data)
        }
      } catch (error) {
        console.error("Ayarlar yüklenirken hata:", error)
        toast({
          title: "Hata",
          description: "Ayarlar yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [toast])

  async function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(key: string) {
    setIsSaving(true)
    try {
      await updateSetting(key, settings[key] || "")
      toast({
        title: "Başarılı",
        description: "Ayar başarıyla güncellendi.",
      })
      router.refresh()
    } catch (error) {
      console.error("Ayar güncellenirken hata:", error)
      toast({
        title: "Hata",
        description: "Ayar güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
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
              <div className="flex gap-2">
                <Input
                  id="site_title"
                  value={settings.site_title || ""}
                  onChange={(e) => handleChange("site_title", e.target.value)}
                  placeholder="Günçevik Hukuk Bürosu"
                />
                <Button onClick={() => handleSave("site_title")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_description">Site Açıklaması</Label>
              <div className="flex gap-2">
                <Textarea
                  id="site_description"
                  value={settings.site_description || ""}
                  onChange={(e) => handleChange("site_description", e.target.value)}
                  placeholder="Hukuki danışmanlık ve avukatlık hizmetleri..."
                  rows={3}
                />
                <Button onClick={() => handleSave("site_description")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
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
              <div className="flex gap-2 items-center">
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: settings.primary_color || "#3b82f6" }}
                />
                <Input
                  id="primary_color"
                  type="text"
                  value={settings.primary_color || "#3b82f6"}
                  onChange={(e) => handleChange("primary_color", e.target.value)}
                  className="w-32"
                />
                <Input
                  type="color"
                  value={settings.primary_color || "#3b82f6"}
                  onChange={(e) => handleChange("primary_color", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Button onClick={() => handleSave("primary_color")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">İkincil Renk</Label>
              <div className="flex gap-2 items-center">
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: settings.secondary_color || "#10b981" }}
                />
                <Input
                  id="secondary_color"
                  type="text"
                  value={settings.secondary_color || "#10b981"}
                  onChange={(e) => handleChange("secondary_color", e.target.value)}
                  className="w-32"
                />
                <Input
                  type="color"
                  value={settings.secondary_color || "#10b981"}
                  onChange={(e) => handleChange("secondary_color", e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Button onClick={() => handleSave("secondary_color")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font_family">Font</Label>
              <div className="flex gap-2">
                <select
                  id="font_family"
                  value={settings.font_family || "Inter"}
                  onChange={(e) => handleChange("font_family", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
                <Button onClick={() => handleSave("font_family")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
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
              <div className="flex gap-2">
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email || ""}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  placeholder="info@guncevik.av.tr"
                />
                <Button onClick={() => handleSave("contact_email")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Telefon</Label>
              <div className="flex gap-2">
                <Input
                  id="contact_phone"
                  value={settings.contact_phone || ""}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                  placeholder="+90 212 123 45 67"
                />
                <Button onClick={() => handleSave("contact_phone")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_address">Adres</Label>
              <div className="flex gap-2">
                <Textarea
                  id="contact_address"
                  value={settings.contact_address || ""}
                  onChange={(e) => handleChange("contact_address", e.target.value)}
                  placeholder="İstanbul, Türkiye"
                  rows={3}
                />
                <Button onClick={() => handleSave("contact_address")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="seo">
        <Card>
          <CardHeader>
            <CardTitle>SEO Ayarları</CardTitle>
            <CardDescription>Arama motoru optimizasyonu için gerekli ayarları buradan yapabilirsiniz.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Başlık</Label>
              <div className="flex gap-2">
                <Input
                  id="meta_title"
                  value={settings.meta_title || ""}
                  onChange={(e) => handleChange("meta_title", e.target.value)}
                  placeholder="Günçevik Hukuk Bürosu | Avukatlık Hizmetleri"
                />
                <Button onClick={() => handleSave("meta_title")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Açıklama</Label>
              <div className="flex gap-2">
                <Textarea
                  id="meta_description"
                  value={settings.meta_description || ""}
                  onChange={(e) => handleChange("meta_description", e.target.value)}
                  placeholder="Hukuki danışmanlık ve avukatlık hizmetleri..."
                  rows={3}
                />
                <Button onClick={() => handleSave("meta_description")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
              <div className="flex gap-2">
                <Input
                  id="google_analytics_id"
                  value={settings.google_analytics_id || ""}
                  onChange={(e) => handleChange("google_analytics_id", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
                <Button onClick={() => handleSave("google_analytics_id")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Kaydet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
