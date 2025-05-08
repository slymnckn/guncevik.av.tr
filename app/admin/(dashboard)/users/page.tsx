import { getUsers } from "@/actions/user-actions"
import { UserList } from "@/components/admin/users/user-list"
import { NewUserForm } from "@/components/admin/users/new-user-form"

export default async function UsersPage() {
  // Hata yakalama ile kullanıcıları getir
  let users = []
  let error = null

  try {
    users = await getUsers()
  } catch (err: any) {
    console.error("Kullanıcılar getirilirken hata:", err)
    error = err.message || "Kullanıcılar getirilirken bir hata oluştu."
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kullanıcılar</h1>
        <p className="text-muted-foreground">Kullanıcıları yönetin ve yeni kullanıcılar ekleyin.</p>
      </div>

      <NewUserForm />

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-medium">Hata</p>
          <p>{error}</p>
        </div>
      ) : (
        <UserList users={users} />
      )}
    </div>
  )
}
