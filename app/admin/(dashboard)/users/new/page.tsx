import { UserForm } from "@/components/admin/users/user-form"

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Kullanıcı</h1>
        <p className="text-muted-foreground">Sisteme yeni bir kullanıcı ekleyin.</p>
      </div>

      <UserForm />
    </div>
  )
}
