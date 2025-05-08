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
} from "recharts"

// Servis alanları için etiketler
const serviceAreaLabels: Record<string, string> = {
  "ticaret-ve-sirketler-hukuku": "Ticaret ve Şirketler Hukuku",
  "sigorta-hukuku": "Sigorta Hukuku",
  "is-ve-sosyal-guvenlik-hukuku": "İş ve Sosyal Güvenlik Hukuku",
  "ceza-hukuku": "Ceza Hukuku",
  "icra-ve-iflas-hukuku": "İcra ve İflas Hukuku",
  "idare-ve-vergi-hukuku": "İdare ve Vergi Hukuku",
  "gayrimenkul-ve-insaat-hukuku": "Gayrimenkul ve İnşaat Hukuku",
  "aile-hukuku": "Aile Hukuku",
  "miras-hukuku": "Miras Hukuku",
  "tazminat-hukuku": "Tazminat Hukuku",
  diger: "Diğer",
}

// Durum etiketleri
const statusLabels: Record<string, string> = {
  new: "Yeni",
  in_progress: "İşleme Alındı",
  completed: "Tamamlandı",
  archived: "Arşivlendi",
}

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

type AnalyticsData = {
  contactStats: Array<{ created_at: string }>
  consultationStats: Array<{ created_at: string }>
  serviceAreaStats: Array<{ service_area: string }>
  contactStatusStats: Array<{ status: string }>
  consultationStatusStats: Array<{ status: string }>
}

export function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  const [timeRange, setTimeRange] = useState<"6months" | "3months" | "30days">("6months")

  // Aylık istatistikleri hesapla
  const monthlyData = processMonthlyData(data.contactStats, data.consultationStats, timeRange)

  // Hizmet alanı dağılımını hesapla
  const serviceAreaData = processServiceAreaData(data.serviceAreaStats)

  // Durum dağılımını hesapla
  const contactStatusData = processStatusData(data.contactStatusStats)
  const consultationStatusData = processStatusData(data.consultationStatusStats)

  return (
    <div className="space-y-8">
      {/* Zaman aralığı seçimi */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Zaman İçinde Gelen Talepler</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange("30days")}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === "30days" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Son 30 Gün
            </button>
            <button
              onClick={() => setTimeRange("3months")}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === "3months" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Son 3 Ay
            </button>
            <button
              onClick={() => setTimeRange("6months")}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === "6months" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Son 6 Ay
            </button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="İletişim Formları" fill="#0088FE" />
              <Bar dataKey="Danışmanlık Talepleri" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hizmet alanı dağılımı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Hizmet Alanı Dağılımı</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceAreaData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceAreaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} talep`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Durum dağılımı */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Durum Dağılımı</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-center mb-2">İletişim Formları</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={contactStatusData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                      {contactStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} adet`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-center mb-2">Danışmanlık Talepleri</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={consultationStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {consultationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} adet`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Özet istatistikler */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Özet İstatistikler</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Toplam İletişim Formu</h3>
            <p className="text-2xl font-bold mt-1">{data.contactStats.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Toplam Danışmanlık Talebi</h3>
            <p className="text-2xl font-bold mt-1">{data.consultationStats.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Bekleyen İletişim Formları</h3>
            <p className="text-2xl font-bold mt-1">
              {data.contactStatusStats.filter((item) => item.status === "new").length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Bekleyen Danışmanlık Talepleri</h3>
            <p className="text-2xl font-bold mt-1">
              {data.consultationStatusStats.filter((item) => item.status === "new").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Aylık veri işleme fonksiyonu
function processMonthlyData(
  contactStats: Array<{ created_at: string }>,
  consultationStats: Array<{ created_at: string }>,
  timeRange: "6months" | "3months" | "30days",
) {
  const today = new Date()
  let startDate: Date

  switch (timeRange) {
    case "30days":
      startDate = new Date(today.setDate(today.getDate() - 30))
      break
    case "3months":
      startDate = new Date(today.setMonth(today.getMonth() - 3))
      break
    case "6months":
      startDate = new Date(today.setMonth(today.getMonth() - 6))
      break
  }

  const monthlyData: { name: string; "İletişim Formları": number; "Danışmanlık Talepleri": number }[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= new Date()) {
    const monthName = currentDate.toLocaleString("default", { month: "long" })
    const year = currentDate.getFullYear()
    const monthYear = `${monthName} ${year}`

    const contactCount = contactStats.filter((item) => {
      const itemDate = new Date(item.created_at)
      return itemDate.getFullYear() === year && itemDate.getMonth() === currentDate.getMonth() && itemDate >= startDate
    }).length

    const consultationCount = consultationStats.filter((item) => {
      const itemDate = new Date(item.created_at)
      return itemDate.getFullYear() === year && itemDate.getMonth() === currentDate.getMonth() && itemDate >= startDate
    }).length

    monthlyData.push({
      name: monthYear,
      "İletişim Formları": contactCount,
      "Danışmanlık Talepleri": consultationCount,
    })

    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return monthlyData
}

// Hizmet alanı verisini işleme fonksiyonu
function processServiceAreaData(serviceAreaStats: Array<{ service_area: string }>) {
  const serviceAreaCounts: Record<string, number> = {}

  serviceAreaStats.forEach((item) => {
    const serviceArea = item.service_area
    serviceAreaCounts[serviceArea] = (serviceAreaCounts[serviceArea] || 0) + 1
  })

  const serviceAreaData = Object.keys(serviceAreaCounts).map((key) => ({
    name: serviceAreaLabels[key] || key,
    value: serviceAreaCounts[key],
  }))

  return serviceAreaData
}

// Durum verisini işleme fonksiyonu
function processStatusData(statusStats: Array<{ status: string }>) {
  const statusCounts: Record<string, number> = {}

  statusStats.forEach((item) => {
    const status = item.status
    statusCounts[status] = (statusCounts[status] || 0) + 1
  })

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: statusLabels[key] || key,
    value: statusCounts[key],
  }))

  return statusData
}
