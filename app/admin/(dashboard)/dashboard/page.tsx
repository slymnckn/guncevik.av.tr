"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, FileText, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

// Örnek site istatistikleri - gerçek uygulamada API'den gelecek
const siteStats = {
  totalMessages: 5,
  newMessages: 5,
  totalAppointments: 5,
  newAppointments: 2,
  totalBlogPosts: 8,
  newBlogPosts: 8,
  totalUsers: 3,
  newUsers: 3,
}

export default function DashboardPage() {
  const [stats, setStats] = useState(siteStats)
  const [isLoading, setIsLoading] = useState(false)

  // Verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Gerçek uygulamada burada API çağrısı yapılacak
        // const response = await fetch(`/api/dashboard/stats`)
        // const data = await response.json()
        // setStats(data)

        // Şimdilik sadece yükleme efekti gösteriyoruz
        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsLoading(false)
      } catch (error) {
        console.error("Dashboard verisi yüklenirken hata:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Hoş geldiniz! İşte site istatistikleriniz.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Mesajlar</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">+{stats.newMessages} yeni mesaj</p>
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Son İletişim Mesajları */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Son İletişim Mesajları</CardTitle>
              <Link href="/admin/messages" className="text-primary hover:text-primary/80 text-sm flex items-center">
                Tümünü Görüntüle <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Son iletişim mesajlarınızı burada görebilirsiniz.</p>
              {/* Mesaj listesi buraya gelecek */}
            </div>
          </CardContent>
        </Card>

        {/* Son Randevular */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Son Randevular</CardTitle>
              <Link href="/admin/appointments" className="text-primary hover:text-primary/80 text-sm flex items-center">
                Tümünü Görüntüle <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Son randevu taleplerini burada görebilirsiniz.</p>
              {/* Randevu listesi buraya gelecek */}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Son Blog Yazıları */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Son Blog Yazıları</CardTitle>
              <Link href="/admin/blog" className="text-primary hover:text-primary/80 text-sm flex items-center">
                Tümünü Görüntüle <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Son yayınlanan blog yazılarınızı burada görebilirsiniz.</p>
              {/* Blog yazıları listesi buraya gelecek */}
            </div>
          </CardContent>
        </Card>

        {/* Hızlı İşlemler */}
        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="/admin/blog/new">Yeni Blog Yazısı</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/services/new">Yeni Hizmet</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/users/new">Yeni Kullanıcı</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/settings">Ayarlar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
