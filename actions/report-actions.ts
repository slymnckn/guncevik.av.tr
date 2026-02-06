"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatDateRange } from "@/lib/utils/formatting"
import { type ReportData, type TimeRange, statusLabels, serviceAreaLabels } from "@/lib/types/reports"

export async function getReportData(timeRange: TimeRange): Promise<ReportData> {
  const supabase = await createServerSupabaseClient()

  // Zaman aralığı için tarih hesaplama
  const { startDate, endDate } = getDateRangeFromTimeRange(timeRange)

  // İletişim formları istatistikleri
  const { data: contactData } = await supabase
    .from("contact_submissions")
    .select("created_at, status")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true })

  // Randevu istatistikleri
  const { data: appointmentData } = await supabase
    .from("appointments")
    .select("created_at, status, service_area")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .order("created_at", { ascending: true })

  // Son 7 gün için yeni iletişim ve randevu sayıları
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { count: newContacts } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString())

  const { count: newAppointments } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString())

  // Verileri işle
  const contactStats = processTimeSeriesData(contactData || [])
  const appointmentStats = processTimeSeriesData(appointmentData || [])
  const contactStatusDistribution = processStatusDistribution(contactData || [])
  const appointmentStatusDistribution = processStatusDistribution(appointmentData || [])
  const serviceAreaDistribution = processServiceAreaDistribution(appointmentData || [])

  return {
    contactStats,
    appointmentStats,
    contactStatusDistribution,
    appointmentStatusDistribution,
    serviceAreaDistribution,
    totalContacts: contactData?.length || 0,
    totalAppointments: appointmentData?.length || 0,
    newContacts: newContacts || 0,
    newAppointments: newAppointments || 0,
  }
}

// Zaman aralığı için tarih hesaplama yardımcı fonksiyonu
function getDateRangeFromTimeRange(timeRange: TimeRange): { startDate: Date; endDate: Date } {
  const endDate = new Date()
  let startDate = new Date()

  switch (timeRange) {
    case "7days":
      startDate.setDate(endDate.getDate() - 7)
      break
    case "30days":
      startDate.setDate(endDate.getDate() - 30)
      break
    case "90days":
      startDate.setDate(endDate.getDate() - 90)
      break
    case "all":
      startDate = new Date(2020, 0, 1) // Varsayılan olarak 2020 başlangıcı
      break
  }

  return { startDate, endDate }
}

// Zaman serisi verilerini işleme
function processTimeSeriesData(data: any[]): { date: string; count: number }[] {
  const dateCountMap: Record<string, number> = {}

  data.forEach((item) => {
    const date = new Date(item.created_at)
    const dateStr = formatDateRange(date, "day")

    dateCountMap[dateStr] = (dateCountMap[dateStr] || 0) + 1
  })

  return Object.keys(dateCountMap).map((date) => ({
    date,
    count: dateCountMap[date],
  }))
}

// Durum dağılımını işleme
function processStatusDistribution(data: any[]): { status: string; count: number }[] {
  const statusCountMap: Record<string, number> = {}

  data.forEach((item) => {
    const status = item.status || "new"
    statusCountMap[status] = (statusCountMap[status] || 0) + 1
  })

  return Object.keys(statusCountMap).map((status) => ({
    status: statusLabels[status] || status,
    count: statusCountMap[status],
  }))
}

// Servis alanı dağılımını işleme
function processServiceAreaDistribution(data: any[]): { service_area: string; count: number }[] {
  const areaCountMap: Record<string, number> = {}

  data.forEach((item) => {
    if (item.service_area) {
      const area = item.service_area
      areaCountMap[area] = (areaCountMap[area] || 0) + 1
    }
  })

  return Object.keys(areaCountMap).map((area) => ({
    service_area: serviceAreaLabels[area] || area,
    count: areaCountMap[area],
  }))
}
