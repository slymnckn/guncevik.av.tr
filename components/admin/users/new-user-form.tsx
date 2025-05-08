"use client"

import { useState } from "react"
import { createUser } from "@/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function NewUserForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState("editor")

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      // Role değerini formData'ya ekle
      formData.append("role", role)

      const result = await createUser(formData)

      if (result.success) {
        toast({
          title: "Başarılı",
          description: result.message,
        })

        // Formu sıfırla
        const form = document.getElementById("new-user-form") as HTMLFormElement
        if (form) form.reset()
        setRole("editor")
      } else {
        toast({
          title: "Hata",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Kullanıcı oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni Kullanıcı Ekle</CardTitle>
        <CardDescription>
          Sisteme yeni bir kullanıcı ekleyin. Kullanıcı e-posta ve şifre ile giriş yapabilecek.
        </CardDescription>
      </CardHeader>
      <form id="new-user-form" action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" name="email" type="email" placeholder="ornek@guncevik.av.tr" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Yönetici</SelectItem>
                <SelectItem value="editor">Editör</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kullanıcı Ekle
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
