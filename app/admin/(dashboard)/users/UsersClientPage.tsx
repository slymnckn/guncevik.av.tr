"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { deleteUser } from "@/actions/user-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { AdminProfile } from "@/lib/types/admin"

interface UsersClientPageProps {
  users?: AdminProfile[]
}

export default function UsersClientPage({ users = [] }: UsersClientPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminProfile | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (user: AdminProfile) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteUser(userToDelete.id)
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
        router.refresh()
      }
    } catch (error) {
      console.error("Kullanıcı silinirken hata:", error)
      toast({
        title: "Hata",
        description: "Kullanıcı silinirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin"
      case "editor":
        return "Editör"
      case "viewer":
        return "Görüntüleyici"
      default:
        return role
    }
  }

  return (
    <div>
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <UserCircle className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Henüz kullanıcı yok</h3>
          <p className="text-muted-foreground">Yeni bir kullanıcı ekleyin.</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/users/new">Kullanıcı Ekle</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="grid grid-cols-4 border-b px-4 py-3 font-medium">
            <div>Kullanıcı</div>
            <div>E-posta</div>
            <div>Rol</div>
            <div className="text-right">İşlemler</div>
          </div>
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-4 items-center border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UserCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              </div>
              <div>{user.email}</div>
              <div>{getRoleLabel(user.role)}</div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/users/edit/${user.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Düzenle</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Sil</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Kullanıcı ve ilişkili tüm veriler kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Siliniyor..." : "Evet, sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
