"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { ContactSubmission, AppointmentRequest, Activity } from "@/lib/types"

// Dashboard için gerekli verileri çeken fonksiyon
export async function getDashboardData() {
  const supabase = createServerSupabaseClient()

  // İstatistikleri çek
  const stats = await getDashboardStats()

  // Son iletişim mesajlarını çek
  const recentContacts = await getRecentContactSubmissions(5)

  // Son randevuları çek
  const recentAppointments = await getRecentAppointments(5)

  // Son aktiviteleri çek
  const recentActivities = await getRecentActivities(10)

  return {
    stats,
    recentContacts,
    recentAppointments,
    recentActivities,
  }
}

// Dashboard istatistiklerini çeken fonksiyon
async function getDashboardStats() {
  const supabase = createServerSupabaseClient()

  // Toplam iletişim mesajı sayısı
  const { count: totalContacts } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })

  // Toplam randevu sayısı
  const { count: totalAppointments } = await supabase.from("appointments").select("*", { count: "exact", head: true })

  // Toplam blog yazısı sayısı
  const { count: totalBlogPosts } = await supabase.from("blog_posts").select("*", { count: "exact", head: true })

  // Toplam kullanıcı sayısı
  const { count: totalUsers } = await supabase.from("admin_profiles").select("*", { count: "exact", head: true })

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

  // Son 30 gündeki yeni kullanıcılar
  const { count: newUsers } = await supabase
    .from("admin_profiles")
    .select("*", { count: "exact", head: true })
    .gt("created_at", monthDateFilter)

  return {
    totalContacts: totalContacts || 0,
    totalAppointments: totalAppointments || 0,
    totalBlogPosts: totalBlogPosts || 0,
    totalUsers: totalUsers || 0,
    newContacts: newContacts || 0,
    newAppointments: newAppointments || 0,
    newBlogPosts: newBlogPosts || 0,
    newUsers: newUsers || 0,
  }
}

// Son iletişim mesajlarını çeken fonksiyon
async function getRecentContactSubmissions(limit = 5): Promise<ContactSubmission[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent contact submissions:", error)
    return []
  }

  return data as ContactSubmission[]
}

// Son randevuları çeken fonksiyon
async function getRecentAppointments(limit = 5): Promise<AppointmentRequest[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent appointments:", error)
    return []
  }

  return data as AppointmentRequest[]
}

// Son aktiviteleri çeken fonksiyon
async function getRecentActivities(limit = 10): Promise<Activity[]> {
  const supabase = createServerSupabaseClient()
  const activities: Activity[] = []

  // Son iletişim mesajlarını çek
  const { data: contacts, error: contactsError } = await supabase
    .from("contact_submissions")
    .select("id, name, created_at, subject")
    .order("created_at", { ascending: false })
    .limit(limit / 2)

  if (contactsError) {
    console.error("Error fetching contact activities:", contactsError)
  } else {
    contacts.forEach((contact) => {
      activities.push({
        id: `contact-${contact.id}`,
        type: "contact",
        title: "Yeni İletişim Mesajı",
        description: `${contact.name} tarafından gönderildi`,
        subject: contact.subject,
        created_at: contact.created_at,
        link: `/admin/messages/${contact.id}`,
      })
    })
  }

  // Son randevuları çek
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select("id, name, created_at, subject, service_area")
    .order("created_at", { ascending: false })
    .limit(limit / 2)

  if (appointmentsError) {
    console.error("Error fetching appointment activities:", appointmentsError)
  } else {
    appointments.forEach((appointment) => {
      activities.push({
        id: `appointment-${appointment.id}`,
        type: "appointment",
        title: "Yeni Randevu Talebi",
        description: `${appointment.name} tarafından talep edildi`,
        subject: appointment.subject,
        service_area: appointment.service_area,
        created_at: appointment.created_at,
        link: `/admin/appointments/${appointment.id}`,
      })
    })
  }

  // Aktiviteleri tarihe göre sırala
  activities.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  // Limit uygula
  return activities.slice(0, limit)
}
