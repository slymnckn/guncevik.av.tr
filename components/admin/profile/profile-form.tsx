"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload } from "lucide-react"
import { updateProfile, uploadAvatar } from "@/actions/profile-actions"

type ProfileFormProps = {
  user: {
    id: string
    email: string
  }
  profile: {
    name: string
    role: string
    avatar_url: string | null
  } | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [name, setName] = useState(profile?.name || "")
  const [isUploading, setIsUploading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateProfile({
        name,
        avatar_url: avatarUrl,
      })

      if (result.success) {
        toast({
          title: "Başarılı",
          description: "Profil bilgileriniz güncellendi.",
        })
        router.refresh()
      } else {
        toast({
          title: "Hata",
          description: result.error || "Profil güncellenirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const result = await uploadAvatar(formData)
      if (result.success && result.url) {
        setAvatarUrl(result.url)
        toast({
          title: "Başarılı",
          description: "Profil fotoğrafı yüklendi.",
        })
      } else {
        toast({
          title: "Hata",
          description: result.error || "Profil fotoğrafı yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Profil fotoğrafı yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Tabs defaultValue="profile">
      <TabsList className="mb-4">
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="password">Şifre</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
            <CardDescription>Profil bilgilerinizi güncelleyin.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl || "/placeholder.svg"}
                        alt="Profil fotoğrafı"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {name ? name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="avatar" className="text-sm font-medium">
                      Profil Fotoğrafı
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="avatar"
                        className="flex cursor-pointer items-center space-x-2 rounded-md border px-3 py-2 text-sm"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Fotoğraf Yükle</span>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                          disabled={isUploading}
                        />
                      </Label>
                      {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                    <p className="text-xs text-muted-foreground">JPG, PNG veya GIF. Maksimum 2MB.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" value={user.email} disabled />
                  <p className="text-xs text-muted-foreground">E-posta adresiniz değiştirilemez.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Input id="role" value={profile?.role || "Kullanıcı"} disabled />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kaydet
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Şifre Değiştir</CardTitle>
            <CardDescription>Hesap şifrenizi değiştirin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mevcut Şifre</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Yeni Şifre</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Şifreyi Değiştir</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
