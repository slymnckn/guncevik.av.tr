import { ProfileForm } from "@/components/admin/profile/profile-form"
import { getCurrentUser } from "@/actions/auth-actions"
import { getUserProfile } from "@/actions/profile-actions"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  try {
    console.log("Profil sayfası yükleniyor...")
    const user = await getCurrentUser()

    console.log("Kullanıcı bilgisi:", user ? "Mevcut" : "Bulunamadı")

    if (!user) {
      console.log("Kullanıcı bulunamadı, login sayfasına yönlendiriliyor")
      redirect("/admin/login")
    }

    console.log("Kullanıcı ID:", user.id)
    const profile = await getUserProfile(user.id)
    console.log("Profil bilgisi:", profile ? "Mevcut" : "Bulunamadı")

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          <p className="text-muted-foreground">Profil bilgilerinizi ve ayarlarınızı yönetin.</p>
        </div>

        <ProfileForm user={user} profile={profile} />
      </div>
    )
  } catch (error) {
    console.error("Profil sayfası yüklenirken hata:", error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
          <p className="text-red-500">
            Profil bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </p>
        </div>
      </div>
    )
  }
}
