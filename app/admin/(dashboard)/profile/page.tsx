import { getUserProfile } from "@/actions/profile-actions"
import { ProfileForm } from "@/components/admin/profile/profile-form"
import { getCurrentUser } from "@/actions/auth-actions"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { profile, error } = await getUserProfile(user.id)

  if (error) {
    console.error("Profil bilgileri alınırken hata:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">
          Profil bilgilerinizi ve ayarlarınızı buradan güncelleyebilirsiniz.
        </p>
      </div>
      <div className="border-t border-b py-6">
        <ProfileForm userId={user.id} profile={profile} />
      </div>
    </div>
  )
}
