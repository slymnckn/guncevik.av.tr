import { SiteSettingsForm } from "@/components/admin/site-settings/site-settings-form"

export default function SiteSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Ayarları</h1>
        <p className="text-muted-foreground">Sitenizin genel ayarlarını ve görünümünü buradan yönetebilirsiniz.</p>
      </div>

      <SiteSettingsForm />
    </div>
  )
}
