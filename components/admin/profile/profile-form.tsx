"use client"

import type React from "react"

import { useState, useRef } from "react"
import { updateProfile } from "@/actions/profile-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
  userId: string
  profile?: any
}

export function ProfileForm({ userId, profile }: ProfileFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)

      // Mevcut avatar URL'ini formData'ya ekle
      if (avatarPreview && avatarPreview.startsWith("http")) {
        formData.set("avatar_url", avatarPreview)
      }

      console.log("Form gönderiliyor:", Object.fromEntries(formData.entries()))

      const result = await updateProfile(userId, formData)

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Profil bilgileriniz güncellendi.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Kullanıcı adının baş harflerini al
  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U"
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="avatar">Profil Fotoğrafı</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
            <AvatarImage src={avatarPreview || undefined} alt="Profil" />
            <AvatarFallback className="text-lg">{getInitials(profile?.name || "")}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" onClick={handleAvatarClick}>
              Fotoğraf Seç
            </Button>
            <p className="text-sm text-muted-foreground">JPG, PNG veya GIF. Maksimum 2MB.</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Ad Soyad</Label>
        <Input id="name" name="name" defaultValue={profile?.name || ""} placeholder="Ad Soyad" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={profile?.email || ""}
          disabled
          placeholder="E-posta adresiniz"
        />
        <p className="text-sm text-muted-foreground">E-posta adresi değiştirilemez.</p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Kaydet
      </Button>
    </form>
  )
}
