"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { deleteUser } from "@/actions/user-actions"
import type { AdminProfile } from "@/lib/types/admin"
import { AlertTriangle } from "lucide-react"

interface DeleteUserFormProps {
  user: AdminProfile
}

export function DeleteUserForm({ user }: DeleteUserFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onDelete() {
    setIsLoading(true)

    try {
      const result = await deleteUser(user.id)

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Başarılı",
          description: "Kullanıcı başarıyla silindi.",
        })
        router.push("/admin/users")
      }
    } catch (error) {
      console.error("Kullanıcı silinirken hata:", error)
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
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Kullanıcı Sil
        </CardTitle>
        <CardDescription>
          Bu işlem geri alınamaz. Kullanıcı ve ilişkili tüm veriler kalıcı olarak silinecektir.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Aşağıdaki kullanıcıyı silmek üzeresiniz:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>İsim:</strong> {user.name}
            </li>
            <li>
              <strong>E-posta:</strong> {user.email}
            </li>
            <li>
              <strong>Rol:</strong>{" "}
              {user.role === "admin" ? "Admin" : user.role === "editor" ? "Editör" : "Görüntüleyici"}
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => router.push("/admin/users")}>
          İptal
        </Button>
        <Button variant="destructive" onClick={onDelete} disabled={isLoading}>
          {isLoading ? "Siliniyor..." : "Kullanıcıyı Sil"}
        </Button>
      </CardFooter>
    </Card>
  )
}
