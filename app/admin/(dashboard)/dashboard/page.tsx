"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, FileText, Users, ArrowRight, Eye, Clock, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Örnek veri - gerçek uygulamada API'den gelecek
const analyticsData = {
  pageViews: {
    total: 1234,
    change: 12,
    data: [
      { date: "1 May", value: 400 },
      { date: "2 May", value: 300 },
      { date: "3 May", value: 500 },
      { date: "4 May", value: 350 },
      { date: "5 May", value: 450 },
      { date: "6 May", value: 500 },
      { date: "7 May", value: 550 },
      { date: "8 May", value: 600 },
    ],
  },
  visitors: {
    total: 567,
    change: 8,
    data: [
      { date: "1 May", value: 200 },
      { date: "2 May", value: 150 },
      { date: "3 May", value: 300 },
      { date: "4 May", value: 200 },
      { date: "5 May", value: 250 },
      { date: "6 May", value: 300 },
      { date: "7 May", value: 350 },
      { date: "8 May", value: 400 },
    ],
  },
  bounceRate: {
    total: 42.5,
    change: -2.3,
    data: [
      { date: "1 May", value: 45 },
      { date: "2 May", value: 48 },
      { date: "3 May", value: 47 },
      { date: "4 May", value: 44 },
      { date: "5 May", value: 45 },
      { date: "6 May", value: 43 },
      { date: "7 May", value: 42 },
      { date: "8 May", value: 40 },
    ],
  },
  sessionDuration: {
    total: 3.7,
    change: 8,
    data: [
      { date: "1 May", value: 3.2 },
      { date: "2 May", value: 3.0 },
      { date: "3 May", value: 3.5 },
      { date: "4 May", value: 3.3 },
      { date: "5 May", value: 3.6 },
      { date: "6 May", value: 3.8 },
      { date: "7 May", value: 3.9 },
      { date: "8 May", value: 4.0 },
    ],
  },
}

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
  const [timeRange, setTimeRange] = useState("week")
  const [stats, setStats] = useState(siteStats)
  const [analytics, setAnalytics] = useState(analyticsData)
  const [isLoading, setIsLoading] = useState(false)

  // Zaman aralığı değiştiğinde verileri güncelle
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Gerçek uygulamada burada API çağrısı yapılacak
        // const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
        // const data = await response.json()
        // setAnalytics(data)

        // Şimdilik sadece yükleme efekti gösteriyoruz
        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsLoading(false)
      } catch (error) {
        console.error("Analytics verisi yüklenirken hata:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Hoş geldiniz! İşte site istatistikleriniz.</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Zaman Aralığı" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Bugün</SelectItem>
            <SelectItem value="week">Bu Hafta</SelectItem>
            <SelectItem value="month">Bu Ay</SelectItem>
            <SelectItem value="year">Bu Yıl</SelectItem>
          </SelectContent>
        </Select>
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

      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Sayfa Görüntülenmeleri */}
            <Card className={isLoading ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sayfa Görüntülenmeleri</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.pageViews.total.toLocaleString()}</div>
                <div className="flex items-center mt-1">
                  <span className={`text-xs ${analytics.pageViews.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {analytics.pageViews.change > 0 ? "+" : ""}
                    {analytics.pageViews.change}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    geçen{" "}
                    {timeRange === "day"
                      ? "güne"
                      : timeRange === "week"
                        ? "haftaya"
                        : timeRange === "month"
                          ? "aya"
                          : "yıla"}{" "}
                    göre
                  </span>
                </div>

                <div className="h-[80px] mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.pageViews.data}>
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-md shadow-sm p-2 text-xs">
                                <p className="font-medium">{payload[0].payload.date}</p>
                                <p>{payload[0].value.toLocaleString()} görüntülenme</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Ziyaretçiler */}
            <Card className={isLoading ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ziyaretçiler</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.visitors.total.toLocaleString()}</div>
                <div className="flex items-center mt-1">
                  <span className={`text-xs ${analytics.visitors.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {analytics.visitors.change > 0 ? "+" : ""}
                    {analytics.visitors.change}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    geçen{" "}
                    {timeRange === "day"
                      ? "güne"
                      : timeRange === "week"
                        ? "haftaya"
                        : timeRange === "month"
                          ? "aya"
                          : "yıla"}{" "}
                    göre
                  </span>
                </div>

                <div className="h-[80px] mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.visitors.data}>
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-md shadow-sm p-2 text-xs">
                                <p className="font-medium">{payload[0].payload.date}</p>
                                <p>{payload[0].value.toLocaleString()} ziyaretçi</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Hemen Çıkma Oranı */}
            <Card className={isLoading ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hemen Çıkma Oranı</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.bounceRate.total}%</div>
                <div className="flex items-center mt-1">
                  <span className={`text-xs ${analytics.bounceRate.change < 0 ? "text-green-500" : "text-red-500"}`}>
                    {analytics.bounceRate.change > 0 ? "+" : ""}
                    {analytics.bounceRate.change}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    geçen{" "}
                    {timeRange === "day"
                      ? "güne"
                      : timeRange === "week"
                        ? "haftaya"
                        : timeRange === "month"
                          ? "aya"
                          : "yıla"}{" "}
                    göre
                  </span>
                </div>

                <div className="h-[80px] mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.bounceRate.data}>
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-md shadow-sm p-2 text-xs">
                                <p className="font-medium">{payload[0].payload.date}</p>
                                <p>{payload[0].value}% hemen çıkma oranı</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Ortalama Oturum Süresi */}
            <Card className={isLoading ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ortalama Oturum Süresi</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.sessionDuration.total} dk</div>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-xs ${analytics.sessionDuration.change > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {analytics.sessionDuration.change > 0 ? "+" : ""}
                    {analytics.sessionDuration.change}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    geçen{" "}
                    {timeRange === "day"
                      ? "güne"
                      : timeRange === "week"
                        ? "haftaya"
                        : timeRange === "month"
                          ? "aya"
                          : "yıla"}{" "}
                    göre
                  </span>
                </div>

                <div className="h-[80px] mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.sessionDuration.data}>
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-md shadow-sm p-2 text-xs">
                                <p className="font-medium">{payload[0].payload.date}</p>
                                <p>{payload[0].value} dk ortalama süre</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 flex justify-center">
            <Link href="/admin/analytics">
              <Button variant="outline" size="sm" className="gap-1">
                Detaylı Analitik Raporları
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          {/* Genel bakış içeriği buraya gelecek */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
