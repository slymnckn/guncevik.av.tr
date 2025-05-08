import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">Sistem ayarlarını yapılandırın</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Bilgileri</CardTitle>
              <CardDescription>Temel site ayarlarını yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="site-name">Site Adı</Label>
                <Input id="site-name" defaultValue="GÜN ÇEVİK Hukuk Bürosu" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site-description">Site Açıklaması</Label>
                <Input id="site-description" defaultValue="Hukuki danışmanlık ve avukatlık hizmetleri" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">İletişim E-postası</Label>
                <Input id="contact-email" type="email" defaultValue="info@guncevik.av.tr" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">İletişim Telefonu</Label>
                <Input id="contact-phone" defaultValue="+90 212 123 45 67" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Değişiklikleri Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Güvenlik Ayarları</CardTitle>
              <CardDescription>Hesap ve site güvenlik ayarlarını yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="two-factor" />
                <Label htmlFor="two-factor">İki Faktörlü Kimlik Doğrulama (2FA)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="session-timeout" defaultChecked />
                <Label htmlFor="session-timeout">30 dakika hareketsizlik sonrası oturumu kapat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="login-notification" defaultChecked />
                <Label htmlFor="login-notification">Yeni oturum açma bildirimleri</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Değişiklikleri Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bildirim Ayarları</CardTitle>
              <CardDescription>E-posta ve sistem bildirim tercihlerini yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="email-new-message" defaultChecked />
                <Label htmlFor="email-new-message">Yeni mesaj e-posta bildirimleri</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="email-new-appointment" defaultChecked />
                <Label htmlFor="email-new-appointment">Yeni randevu e-posta bildirimleri</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="email-new-comment" />
                <Label htmlFor="email-new-comment">Yeni yorum e-posta bildirimleri</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="system-notifications" defaultChecked />
                <Label htmlFor="system-notifications">Sistem bildirimleri</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Değişiklikleri Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
