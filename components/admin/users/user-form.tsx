"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createUser, updateUser } from "@/actions/user-actions"
import type { AdminProfile } from "@/lib/types/admin"

interface UserFormProps {
  user?: AdminProfile
  isEditing?: boolean
}

export function UserForm({ user, isEditing = false }: UserFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState(user?.role || "viewer")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)

      // Rol değerini formData'ya ekle
      formData.set("role", role)

      console.log("Form gönderiliyor:", {
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
      })

      let result
      if (isEditing && user) {
        result = await updateUser(user.id, formData)
      } else {
        result = await createUser(formData)
      }

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
        console.error("Form hatası:", result.error)
      } else {
        toast({
          title: "Başarılı",
          description: isEditing ? "Kullanıcı başarıyla güncellendi." : "Kullanıcı başarıyla oluşturuldu.",
        })

        // Yönlendirme öncesi kısa bir gecikme ekleyelim
        setTimeout(() => {
          router.push("/admin/users")
          router.refresh()
        }, 1000)
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
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Kullanıcı bilgilerini güncelleyin. Şifreyi boş bırakırsanız değiştirilmeyecektir."
              : "Sisteme yeni bir kullanıcı ekleyin."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">İsim</Label>
            <Input id="name" name="name" placeholder="Kullanıcı adı" defaultValue={user?.name || ""} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@guncevik.av.tr"
              defaultValue={user?.email || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre {isEditing && "(Değiştirmek için doldurun)"}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={isEditing ? "••••••••" : "Şifre"}
              required={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger id="role">
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editör</SelectItem>
                <SelectItem value="viewer">Görüntüleyici</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/users")}>
            İptal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "İşleniyor..." : isEditing ? "Güncelle" : "Oluştur"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
