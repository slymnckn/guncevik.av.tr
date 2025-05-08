"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getReportData } from "@/actions/report-actions"
import type { ReportData, TimeRange } from "@/lib/types/reports"
import { useEffect } from "react"

// Grafik renkleri
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
]

export function AnalyticsCharts({ initialData }: { initialData: ReportData }) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30days")
  const [data, setData] = useState<ReportData>(initialData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const newData = await getReportData(timeRange)
        setData(newData)
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error)
      } finally {
        setLoading(false)
      }
    }

    if (timeRange !== "30days" || !initialData) {
      fetchData()
    }
  }, [timeRange, initialData])

  return (
    <div className="space-y-8">
      {/* Zaman aralığı seçimi */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Zaman İçinde Gelen Talepler</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange("7days")}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === "7days" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={loading}
            >
              Son 7 Gün
            </button>
            <button
              onClick={() => setTimeRange("30days")}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === "30days" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={loading}
            >
              Son 30 Gün
            </button>
            <button
              onClick={() => setTimeRange("90days")}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === "90days" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={loading}
            >
              Son 90 Gün
            </button>
            <button
              onClick={() => setTimeRange("all")}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={loading}
            >
              Tümü
            </button>
          </div>
        </div>

        <div className="h-80">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Veriler yükleniyor...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mergeTimeSeriesData(data.contactStats, data.appointmentStats)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="İletişim Formları" stroke="#0088FE" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Randevular" stroke="#00C49F" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="status">Durum Dağılımı</TabsTrigger>
          <TabsTrigger value="services">Hizmet Alanları</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Özet istatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Toplam İletişim Formu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalContacts}</div>
                <p className="text-xs text-muted-foreground">Son 7 günde +{data.newContacts} yeni form</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Toplam Randevu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalAppointments}</div>
                <p className="text-xs text-muted-foreground">Son 7 günde +{data.newAppointments} yeni randevu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ortalama Günlük İletişim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateDailyAverage(data.contactStats)}</div>
                <p className="text-xs text-muted-foreground">Seçilen zaman aralığında</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ortalama Günlük Randevu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculateDailyAverage(data.appointmentStats)}</div>
                <p className="text-xs text-muted-foreground">Seçilen zaman aralığında</p>
              </CardContent>
            </Card>
          </div>

          {/* Zaman içinde değişim grafiği */}
          <Card>
            <CardHeader>
              <CardTitle>Zaman İçinde Değişim</CardTitle>
              <CardDescription>İletişim formları ve randevuların zaman içindeki dağılımı</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Veriler yükleniyor...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mergeTimeSeriesData(data.contactStats, data.appointmentStats)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="İletişim Formları" fill="#0088FE" />
                    <Bar dataKey="Randevular" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* İletişim formları durum dağılımı */}
            <Card>
              <CardHeader>
                <CardTitle>İletişim Formları Durum Dağılımı</CardTitle>
                <CardDescription>İletişim formlarının durum bazında dağılımı</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Veriler yükleniyor...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.contactStatusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                        label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.contactStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} adet`, props.payload.status]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Randevu durum dağılımı */}
            <Card>
              <CardHeader>
                <CardTitle>Randevu Durum Dağılımı</CardTitle>
                <CardDescription>Randevuların durum bazında dağılımı</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Veriler yükleniyor...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.appointmentStatusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                        label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.appointmentStatusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} adet`, props.payload.status]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          {/* Hizmet alanı dağılımı */}
          <Card>
            <CardHeader>
              <CardTitle>Hizmet Alanı Dağılımı</CardTitle>
              <CardDescription>Randevuların hizmet alanlarına göre dağılımı</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Veriler yükleniyor...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.serviceAreaDistribution}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="service_area" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Randevu Sayısı" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Zaman serisi verilerini birleştirme
function mergeTimeSeriesData(
  contactStats: { date: string; count: number }[],
  appointmentStats: { date: string; count: number }[],
) {
  const dateMap: Record<string, { date: string; "İletişim Formları": number; Randevular: number }> = {}

  // İletişim formları verilerini ekle
  contactStats.forEach((item) => {
    dateMap[item.date] = {
      date: item.date,
      "İletişim Formları": item.count,
      Randevular: 0,
    }
  })

  // Randevu verilerini ekle
  appointmentStats.forEach((item) => {
    if (dateMap[item.date]) {
      dateMap[item.date].Randevular = item.count
    } else {
      dateMap[item.date] = {
        date: item.date,
        "İletişim Formları": 0,
        Randevular: item.count,
      }
    }
  })

  // Tarihe göre sırala
  return Object.values(dateMap).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
}

// Günlük ortalama hesaplama
function calculateDailyAverage(stats: { date: string; count: number }[]): string {
  if (!stats || stats.length === 0) return "0"

  const totalCount = stats.reduce((sum, item) => sum + item.count, 0)
  const average = totalCount / stats.length

  return average.toFixed(1)
}
