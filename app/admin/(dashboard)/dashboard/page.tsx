"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  Calendar,
  FileText,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  BriefcaseBusiness,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/types/database"
import type { ContactSubmission, AppointmentRequest } from "@/lib/types"

// Örnek site istatistikleri - gerçek uygulamada API'den gelecek
const initialStats = {
  totalMessages: 0,
  newMessages: 0,
  totalAppointments: 0,
  newAppointments: 0,
  totalBlogPosts: 0,
  newBlogPosts: 0,
  totalServices: 0,
}

export default function DashboardPage() {
  const [stats, setStats] = useState(initialStats)
  const [isLoading, setIsLoading] = useState(true)
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([])
  const [recentAppointments, setRecentAppointments] = useState<AppointmentRequest[]>([])
  const [recentBlogPosts, setRecentBlogPosts] = useState<any[]>([])

  const supabase = createClientComponentClient<Database>()

  // Verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // İstatistikleri çek
        const fetchStats = async () => {
          // Toplam iletişim mesajı sayısı
          const { count: totalContacts } = await supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true })

          // Toplam randevu sayısı
          const { count: totalAppointments } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })

          // Toplam blog yazısı sayısı
          const { count: totalBlogPosts } = await supabase
            .from("blog_posts")
            .select("*", { count: "exact", head: true })

          // Toplam aktif hizmet sayısı
          const { count: totalServices } = await supabase
            .from("services")
            .select("*", { count: "exact", head: true })
            .eq("active", true)

          // Son 7 gündeki yeni iletişim mesajları
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          const dateFilter = sevenDaysAgo.toISOString()

          const { count: newContacts } = await supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true })
            .gt("created_at", dateFilter)

          // Son 7 gündeki yeni randevular
          const { count: newAppointments } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gt("created_at", dateFilter)

          // Son 30 gündeki yeni blog yazıları
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          const monthDateFilter = thirtyDaysAgo.toISOString()

          const { count: newBlogPosts } = await supabase
            .from("blog_posts")
            .select("*", { count: "exact", head: true })
            .gt("created_at", monthDateFilter)

          return {
            totalMessages: totalContacts || 0,
            newMessages: newContacts || 0,
            totalAppointments: totalAppointments || 0,
            newAppointments: newAppointments || 0,
            totalBlogPosts: totalBlogPosts || 0,
            newBlogPosts: newBlogPosts || 0,
            totalServices: totalServices || 0,
          }
        }

        // Son iletişim mesajlarını çek
        const fetchRecentContacts = async () => {
          const { data, error } = await supabase
            .from("contact_submissions")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(3)

          if (error) {
            console.error("Error fetching recent contacts:", error)
            return []
          }
          return data
        }

        // Son randevuları çek
        const fetchRecentAppointments = async () => {
          const { data, error } = await supabase
            .from("appointments")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(3)

          if (error) {
            console.error("Error fetching recent appointments:", error)
            return []
          }
          return data
        }

        // Son blog yazılarını çek
        const fetchRecentBlogPosts = async () => {
          const { data, error } = await supabase
            .from("blog_posts")
            .select("id, title, slug, created_at, published")
            .order("created_at", { ascending: false })
            .limit(3)

          if (error) {
            console.error("Error fetching recent blog posts:", error)
            return []
          }
          return data
        }

        // Tüm verileri paralel olarak çek
        const [statsData, contactsData, appointmentsData, blogPostsData] = await Promise.all([
          fetchStats(),
          fetchRecentContacts(),
          fetchRecentAppointments(),
          fetchRecentBlogPosts(),
        ])

        setStats(statsData)
        setRecentContacts(contactsData)
        setRecentAppointments(appointmentsData)
        setRecentBlogPosts(blogPostsData)
      } catch (error) {
        console.error("Dashboard verisi yüklenirken hata:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Hoş geldiniz! İşte site istatistikleriniz.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={isLoading ? "opacity-60" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Mesajlar</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">+{stats.newMessages} yeni mesaj</p>
          </CardContent>
        </Card>
        <Card className={isLoading ? "opacity-60" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Randevular</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">+{stats.newAppointments} bu hafta</p>
          </CardContent>
        </Card>
        <Card className={isLoading ? "opacity-60" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Yazıları</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">+{stats.newBlogPosts} bu ay</p>
          </CardContent>
        </Card>
        <Card className={isLoading ? "opacity-60" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Hizmetler</CardTitle>
            <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">Aktif hizmet sayısı</p>
          </CardContent>
        </Card>
      </div>

      {/* Diğer içerikler aynı kalacak */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Son İletişim Mesajları */}
        <Card className={isLoading ? "opacity-60" : ""}>
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
              {recentContacts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentContacts.map((contact) => (
                    <div key={contact.id} className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-500">{contact.email}</p>
                        </div>
                        <StatusBadge status={contact.status} />
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-1">{contact.subject}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true, locale: tr })}
                        </span>
                        <Link
                          href={`/admin/messages/${contact.id}`}
                          className="text-primary hover:text-primary/80 text-xs"
                        >
                          Detaylar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Henüz iletişim mesajı bulunmamaktadır.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Son Randevular */}
        <Card className={isLoading ? "opacity-60" : ""}>
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
              {recentAppointments.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.name}</h3>
                          <p className="text-sm text-gray-500">{appointment.email}</p>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-1">{appointment.subject}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(appointment.created_at), { addSuffix: true, locale: tr })}
                        </span>
                        <Link
                          href={`/admin/appointments/${appointment.id}`}
                          className="text-primary hover:text-primary/80 text-xs"
                        >
                          Detaylar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Henüz randevu talebi bulunmamaktadır.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Son Blog Yazıları */}
        <Card className={isLoading ? "opacity-60" : ""}>
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
              {recentBlogPosts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentBlogPosts.map((post) => (
                    <div key={post.id} className="py-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{post.title}</h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {post.published ? "Yayında" : "Taslak"}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: tr })}
                        </span>
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/blog/edit/${post.id}`}
                            className="text-primary hover:text-primary/80 text-xs"
                          >
                            Düzenle
                          </Link>
                          <Link href={`/makaleler/${post.slug}`} className="text-primary hover:text-primary/80 text-xs">
                            Görüntüle
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Henüz blog yazısı bulunmamaktadır.</p>
              )}
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
                <Link href="/admin/blog/categories/new">Yeni Kategori</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/blog/tags/new">Yeni Etiket</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let bgColor = ""
  let textColor = ""
  let icon = null
  let label = ""

  switch (status) {
    case "new":
      bgColor = "bg-blue-100"
      textColor = "text-blue-800"
      icon = <AlertCircle className="h-3 w-3 mr-1" />
      label = "Yeni"
      break
    case "in_progress":
      bgColor = "bg-yellow-100"
      textColor = "text-yellow-800"
      icon = <Clock className="h-3 w-3 mr-1" />
      label = "İşleme Alındı"
      break
    case "completed":
      bgColor = "bg-green-100"
      textColor = "text-green-800"
      icon = <CheckCircle className="h-3 w-3 mr-1" />
      label = "Tamamlandı"
      break
    default:
      bgColor = "bg-gray-100"
      textColor = "text-gray-800"
      label = status
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  )
}
