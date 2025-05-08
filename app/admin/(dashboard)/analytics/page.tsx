"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { getVercelAnalytics, type VercelAnalyticsData } from "@/actions/vercel-analytics-actions"
import { Skeleton } from "@/components/ui/skeleton"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")
  const [analyticsData, setAnalyticsData] = useState<VercelAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const data = await getVercelAnalytics(timeRange)
        setAnalyticsData(data)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
        // Don't set analyticsData to null to avoid breaking the UI
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  // Combine pageviews and visitors for the chart
  const combinedTimeseriesData = analyticsData
    ? analyticsData.timeseriesPageviews.map((item, index) => ({
        date: item.date,
        views: item.value,
        visitors: analyticsData.timeseriesVisitors[index]?.value || 0,
      }))
    : []

  // Calculate bounce rate data
  const bounceRateData = analyticsData
    ? analyticsData.timeseriesPageviews.map((item, index) => ({
        date: item.date,
        rate: analyticsData.bounceRate.value || 0,
      }))
    : []

  // Format device data for pie chart
  const deviceData =
    analyticsData?.devices.map((item) => ({
      name: translateDeviceType(item.device),
      value: item.visitors,
    })) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analitik</h1>
          <p className="text-muted-foreground">Web sitenizin performans metrikleri.</p>
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

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Sayfa Görüntülenmeleri"
          value={analyticsData?.pageviews.value || 0}
          change={analyticsData?.pageviews.change || 0}
          loading={loading}
        />
        <MetricCard
          title="Ziyaretçiler"
          value={analyticsData?.visitors.value || 0}
          change={analyticsData?.visitors.change || 0}
          loading={loading}
        />
        <MetricCard
          title="Hemen Çıkma Oranı"
          value={analyticsData?.bounceRate.value || 0}
          change={analyticsData?.bounceRate.change || 0}
          format="%"
          loading={loading}
          invertChange={true}
        />
        <MetricCard
          title="Ortalama Süre"
          value={analyticsData?.duration.value || 0}
          change={analyticsData?.duration.change || 0}
          format="sn"
          loading={loading}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="pages">Sayfalar</TabsTrigger>
          <TabsTrigger value="visitors">Ziyaretçiler</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Sayfa Görüntülenmeleri ve Ziyaretçiler Grafiği */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Sayfa Görüntülenmeleri ve Ziyaretçiler</CardTitle>
                <CardDescription>
                  {timeRange === "day"
                    ? "Bugün"
                    : timeRange === "week"
                      ? "Bu hafta"
                      : timeRange === "month"
                        ? "Bu ay"
                        : "Bu yıl"}{" "}
                  web sitenizin trafik analizi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="w-full h-[280px]" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={combinedTimeseriesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="views"
                          name="Sayfa Görüntülenmeleri"
                          stroke="#0ea5e9"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="visitors" name="Ziyaretçiler" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hemen Çıkma Oranı Grafiği */}
            <Card>
              <CardHeader>
                <CardTitle>Hemen Çıkma Oranı</CardTitle>
                <CardDescription>Ziyaretçilerin sitede kalma oranı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  {loading ? (
                    <Skeleton className="w-full h-[230px]" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bounceRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rate" name="Hemen Çıkma Oranı (%)" fill="#f43f5e" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cihaz Dağılımı */}
            <Card>
              <CardHeader>
                <CardTitle>Cihaz Dağılımı</CardTitle>
                <CardDescription>Ziyaretçilerin kullandığı cihazlar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center">
                  {loading ? (
                    <Skeleton className="w-full h-[230px]" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} ziyaretçi`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>En Çok Ziyaret Edilen Sayfalar</CardTitle>
              <CardDescription>Sitenizin en popüler sayfaları</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-12" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {analyticsData?.topPages.map((page, index) => {
                    const totalPageviews = analyticsData.topPages.reduce((sum, p) => sum + p.pageviews, 0)
                    const percentage = totalPageviews > 0 ? Math.round((page.pageviews / totalPageviews) * 100) : 0

                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-9 text-center font-medium">{index + 1}</div>
                        <div className="flex-1 ml-2">
                          <div className="font-medium">{formatPagePath(page.page)}</div>
                          <div className="text-sm text-muted-foreground">
                            {page.pageviews.toLocaleString()} görüntülenme
                          </div>
                        </div>
                        <div className="w-16 text-right font-medium">{percentage}%</div>
                        <div className="w-[30%] ml-4">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Tarayıcı Dağılımı */}
            <Card>
              <CardHeader>
                <CardTitle>Tarayıcı Dağılımı</CardTitle>
                <CardDescription>Ziyaretçilerin kullandığı tarayıcılar</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="w-full h-[250px]" />
                ) : (
                  <div className="space-y-4">
                    {analyticsData?.browsers.map((browser, index) => {
                      const totalVisitors = analyticsData.browsers.reduce((sum, b) => sum + b.visitors, 0)
                      const percentage = totalVisitors > 0 ? Math.round((browser.visitors / totalVisitors) * 100) : 0

                      return (
                        <div key={index} className="flex items-center">
                          <div className="flex-1">
                            <div className="font-medium">{browser.browser}</div>
                            <div className="text-sm text-muted-foreground">
                              {browser.visitors.toLocaleString()} ziyaretçi
                            </div>
                          </div>
                          <div className="w-16 text-right font-medium">{percentage}%</div>
                          <div className="w-[30%] ml-4">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ülke Dağılımı */}
            <Card>
              <CardHeader>
                <CardTitle>Ülke Dağılımı</CardTitle>
                <CardDescription>Ziyaretçilerin konumları</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="w-full h-[250px]" />
                ) : (
                  <div className="space-y-4">
                    {analyticsData?.countries.map((country, index) => {
                      const totalVisitors = analyticsData.countries.reduce((sum, c) => sum + c.visitors, 0)
                      const percentage = totalVisitors > 0 ? Math.round((country.visitors / totalVisitors) * 100) : 0

                      return (
                        <div key={index} className="flex items-center">
                          <div className="flex-1">
                            <div className="font-medium">{country.country}</div>
                            <div className="text-sm text-muted-foreground">
                              {country.visitors.toLocaleString()} ziyaretçi
                            </div>
                          </div>
                          <div className="w-16 text-right font-medium">{percentage}%</div>
                          <div className="w-[30%] ml-4">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper component for metric cards
function MetricCard({
  title,
  value,
  change,
  format = "",
  loading = false,
  invertChange = false,
}: {
  title: string
  value: number
  change: number
  format?: string
  loading?: boolean
  invertChange?: boolean
}) {
  const formattedValue =
    format === "%"
      ? `${value.toFixed(1)}${format}`
      : format === "sn"
        ? `${value.toFixed(1)}${format}`
        : value.toLocaleString()

  const displayChange = invertChange ? -change : change

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{formattedValue}</div>
            {change !== 0 && (
              <p className={`text-xs ${displayChange > 0 ? "text-green-600" : "text-red-600"}`}>
                {displayChange > 0 ? "↑" : "↓"} {Math.abs(displayChange).toFixed(1)}%
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Helper function to translate device types
function translateDeviceType(device: string): string {
  const deviceMap: Record<string, string> = {
    desktop: "Masaüstü",
    mobile: "Mobil",
    tablet: "Tablet",
    console: "Konsol",
    tv: "TV",
    unknown: "Bilinmeyen",
  }

  return deviceMap[device.toLowerCase()] || device
}

// Helper function to format page paths
function formatPagePath(path: string): string {
  if (!path) return "Bilinmeyen Sayfa"
  if (path === "/") return "Ana Sayfa"

  // Remove leading slash and replace hyphens with spaces
  const formatted = path.replace(/^\//, "")

  // Map common paths to Turkish names
  const pathMap: Record<string, string> = {
    hizmetlerimiz: "Hizmetlerimiz",
    hakkimizda: "Hakkımızda",
    iletisim: "İletişim",
    makaleler: "Makaleler",
    randevu: "Randevu",
    sss: "SSS",
    arama: "Arama",
    admin: "Admin",
  }

  // Check if the path is in our map
  for (const [key, value] of Object.entries(pathMap)) {
    if (formatted.startsWith(key)) {
      if (formatted === key) return value
      return `${value} - ${formatted.replace(`${key}/`, "")}`
    }
  }

  return formatted
}
