"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Trash, UserCheck, UserX } from "lucide-react"
import { deleteUser, updateUserStatus, updateUserRole } from "@/actions/user-actions"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  email: string
  role: string
  created_at: string
  last_sign_in_at: string | null
  is_active: boolean
}

type UserListProps = {
  users: User[]
}

export function UserList({ users }: UserListProps) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [userToUpdateStatus, setUserToUpdateStatus] = useState<User | null>(null)
  const [newStatus, setNewStatus] = useState(false)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [userToUpdateRole, setUserToUpdateRole] = useState<User | null>(null)
  const [newRole, setNewRole] = useState("")

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    const result = await deleteUser(userToDelete.id)

    if (result.success) {
      toast({
        title: "Başarılı",
        description: result.message,
      })
    } else {
      toast({
        title: "Hata",
        description: result.message,
        variant: "destructive",
      })
    }

    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const handleUpdateStatus = async () => {
    if (!userToUpdateStatus) return

    const result = await updateUserStatus(userToUpdateStatus.id, newStatus)

    if (result.success) {
      toast({
        title: "Başarılı",
        description: `Kullanıcı ${newStatus ? "aktifleştirildi" : "devre dışı bırakıldı"}.`,
      })
    } else {
      toast({
        title: "Hata",
        description: result.message,
        variant: "destructive",
      })
    }

    setIsStatusDialogOpen(false)
    setUserToUpdateStatus(null)
  }

  const handleUpdateRole = async () => {
    if (!userToUpdateRole || !newRole) return

    const result = await updateUserRole(userToUpdateRole.id, newRole)

    if (result.success) {
      toast({
        title: "Başarılı",
        description: result.message,
      })
    } else {
      toast({
        title: "Hata",
        description: result.message,
        variant: "destructive",
      })
    }

    setIsRoleDialogOpen(false)
    setUserToUpdateRole(null)
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-8 rounded-md text-center">
        <p className="text-gray-500">Henüz hiç kullanıcı bulunmuyor.</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>E-posta</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Oluşturulma Tarihi</TableHead>
            <TableHead>Son Giriş</TableHead>
            <TableHead className="text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                  {user.role === "admin" ? "Yönetici" : "Editör"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.is_active ? "success" : "destructive"}>
                  {user.is_active ? "Aktif" : "Devre Dışı"}
                </Badge>
              </TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString("tr-TR")}</TableCell>
              <TableCell>
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString("tr-TR")
                  : "Hiç giriş yapmadı"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menüyü aç</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setUserToUpdateRole(user)
                        setNewRole(user.role === "admin" ? "editor" : "admin")
                        setIsRoleDialogOpen(true)
                      }}
                    >
                      Rolü {user.role === "admin" ? "Editör" : "Yönetici"} Yap
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setUserToUpdateStatus(user)
                        setNewStatus(!user.is_active)
                        setIsStatusDialogOpen(true)
                      }}
                    >
                      {user.is_active ? (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Devre Dışı Bırak
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Aktifleştir
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setUserToDelete(user)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Silme Onay Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu kullanıcı kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Durum Güncelleme Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Kullanıcıyı {newStatus ? "aktifleştirmek" : "devre dışı bırakmak"} istediğinize emin misiniz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {newStatus ? "Kullanıcı sisteme giriş yapabilecek." : "Kullanıcı sisteme giriş yapamayacak."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateStatus}>Onayla</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rol Güncelleme Dialog */}
      <AlertDialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcı rolünü değiştirmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              {newRole === "admin"
                ? "Kullanıcı yönetici yetkilerine sahip olacak."
                : "Kullanıcı editör yetkilerine sahip olacak."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateRole}>Onayla</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
