"use client"

import { useState } from "react"
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

// Örnek veri - gerçek uygulamada API'den gelecek
const pageViewsData = [
  { date: "1 May", views: 400, visitors: 200 },
  { date: "2 May", views: 300, visitors: 150 },
  { date: "3 May", views: 500, visitors: 300 },
  { date: "4 May", views: 350, visitors: 200 },
  { date: "5 May", views: 450, visitors: 250 },
  { date: "6 May", views: 500, visitors: 300 },
  { date: "7 May", views: 550, visitors: 350 },
  { date: "8 May", views: 600, visitors: 400 },
]

const bounceRateData = [
  { date: "1 May", rate: 45 },
  { date: "2 May", rate: 48 },
  { date: "3 May", rate: 47 },
  { date: "4 May", rate: 44 },
  { date: "5 May", rate: 45 },
  { date: "6 May", rate: 43 },
  { date: "7 May", rate: 42 },
  { date: "8 May", rate: 40 },
]

const topPagesData = [
  { name: "Ana Sayfa", views: 1200, percentage: 35 },
  { name: "Hizmetlerimiz", views: 800, percentage: 25 },
  { name: "Hakkımızda", views: 600, percentage: 18 },
  { name: "Blog", views: 400, percentage: 12 },
  { name: "İletişim", views: 300, percentage: 10 },
]

const deviceData = [
  { name: "Mobil", value: 65 },
  { name: "Masaüstü", value: 30 },
  { name: "Tablet", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")

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
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pageViewsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bounceRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" name="Hemen Çıkma Oranı (%)" fill="#f43f5e" />
                    </BarChart>
                  </ResponsiveContainer>
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
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
              <div className="space-y-4">
                {topPagesData.map((page, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-9 text-center font-medium">{index + 1}</div>
                    <div className="flex-1 ml-2">
                      <div className="font-medium">{page.name}</div>
                      <div className="text-sm text-muted-foreground">{page.views.toLocaleString()} görüntülenme</div>
                    </div>
                    <div className="w-16 text-right font-medium">{page.percentage}%</div>
                    <div className="w-[30%] ml-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${page.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitors" className="space-y-4">
          {/* Ziyaretçi analizleri buraya gelecek */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
