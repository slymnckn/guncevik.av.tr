import { DeleteUserForm } from "@/components/admin/users/delete-user-form"
import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface DeleteUserPageProps {
  params: {
    id: string
  }
}

export default async function DeleteUserPage({ params }: DeleteUserPageProps) {
  const { id } = params
  const supabase = createAdminSupabaseClient()

  // Kullanıcı bilgilerini çek
  const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(id)

  if (authError || !authUser.user) {
    console.error("Kullanıcı bulunamadı:", authError)
    notFound()
  }

  // Profil bilgilerini çek
  const { data: profile, error: profileError } = await supabase.from("admin_profiles").select("*").eq("id", id).single()

  if (profileError) {
    console.error("Profil bulunamadı:", profileError)
    notFound()
  }

  const user = {
    id: authUser.user.id,
    email: authUser.user.email || "",
    name: profile.name || "",
    role: profile.role || "viewer",
    created_at: authUser.user.created_at,
    updated_at: profile.updated_at,
    is_active: !authUser.user.banned_until,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Sil</h1>
        <p className="text-muted-foreground">Bu işlem geri alınamaz.</p>
      </div>

      <DeleteUserForm user={user} />
    </div>
  )
}
