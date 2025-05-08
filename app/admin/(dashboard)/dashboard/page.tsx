import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Calendar, FileText, Users, ArrowRight, TrendingUp, Eye, Clock } from "lucide-react"
import Link from "next/link"
import { getDashboardData } from "@/actions/dashboard-actions"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { StatusBadge } from "@/lib/utils/status-helpers"

export default async function DashboardPage() {
  const { stats, recentContacts, recentAppointments, recentActivities } = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Hoş geldiniz! İşte bugünkü istatistikleriniz.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Mesajlar</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
            <p className="text-xs text-muted-foreground">+{stats.newContacts} yeni mesaj</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Randevular</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">+{stats.newAppointments} bu hafta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Yazıları</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">+{stats.newBlogPosts} bu ay</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+{stats.newUsers} bu ay</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
              <CardDescription>Son aktiviteler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="mr-4 rounded-full bg-primary/10 p-2">
                      {activity.type === "contact" && <MessageSquare className="h-4 w-4 text-primary" />}
                      {activity.type === "appointment" && <Calendar className="h-4 w-4 text-primary" />}
                      {activity.type === "blog" && <FileText className="h-4 w-4 text-primary" />}
                      {activity.type === "user" && <Users className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: tr })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Link href="/admin/reports">
                  <Button variant="outline" size="sm" className="gap-1">
                    Tüm Aktiviteleri Gör
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Son İletişim Mesajları */}
            <Card>
              <CardHeader>
                <CardTitle>Son İletişim Mesajları</CardTitle>
                <CardDescription>Son gelen iletişim mesajları</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContacts.map((contact) => (
                    <div key={contact.id} className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{contact.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true, locale: tr })}
                        </p>
                      </div>
                      <StatusBadge status={contact.status} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Link href="/admin/messages">
                    <Button variant="outline" size="sm" className="gap-1">
                      Tüm Mesajları Gör
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Son Randevular */}
            <Card>
              <CardHeader>
                <CardTitle>Son Randevular</CardTitle>
                <CardDescription>Son gelen randevu talepleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{appointment.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{appointment.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(appointment.created_at), { addSuffix: true, locale: tr })}
                        </p>
                      </div>
                      <StatusBadge status={appointment.status} type="appointment" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Link href="/admin/appointments">
                    <Button variant="outline" size="sm" className="gap-1">
                      Tüm Randevuları Gör
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sayfa Görüntülenmeleri</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% geçen haftaya göre</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ortalama Oturum Süresi</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3m 42s</div>
                <p className="text-xs text-muted-foreground">+8% geçen haftaya göre</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dönüşüm Oranı</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">+0.5% geçen haftaya göre</p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/admin/reports">
              <Button variant="outline" size="sm" className="gap-1">
                Detaylı Analitik Raporları
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
