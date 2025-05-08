import { notFound } from "next/navigation"
import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { UserForm } from "@/components/admin/users/user-form"
import type { AdminProfile } from "@/lib/types/admin"

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params
  const supabase = createAdminSupabaseClient()

  // Kullanıcı bilgilerini çek
  const { data: profile, error } = await supabase.from("admin_profiles").select("*").eq("id", id).single()

  if (error || !profile) {
    console.error("Kullanıcı bulunamadı:", error)
    notFound()
  }

  const user: AdminProfile = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role: profile.role,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    is_active: true,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Düzenle</h1>
        <p className="text-muted-foreground">Kullanıcı bilgilerini güncelleyin.</p>
      </div>

      <UserForm user={user} isEditing />
    </div>
  )
}
