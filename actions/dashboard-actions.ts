"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { ContactSubmission, AppointmentRequest, Activity } from "@/lib/types"

// Dashboard için gerekli verileri çeken fonksiyon
export async function getDashboardData() {
  // Tüm verileri paralel olarak çek
  const [stats, recentContacts, recentAppointments, recentActivities] = await Promise.all([
    getDashboardStats(),
    getRecentContactSubmissions(5),
    getRecentAppointments(5),
    getRecentActivities(10),
  ])

  return {
    stats,
    recentContacts,
    recentAppointments,
    recentActivities,
  }
}

// Dashboard istatistiklerini çeken fonksiyon
async function getDashboardStats() {
  const supabase = await createServerSupabaseClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const dateFilter = sevenDaysAgo.toISOString()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const monthDateFilter = thirtyDaysAgo.toISOString()

  // Tüm sorguları paralel olarak çalıştır
  const [
    { count: totalContacts },
    { count: totalAppointments },
    { count: totalBlogPosts },
    { count: totalUsers },
    { count: newContacts },
    { count: newAppointments },
    { count: newBlogPosts },
    { count: newUsers },
  ] = await Promise.all([
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("appointments").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("admin_profiles").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }).gt("created_at", dateFilter),
    supabase.from("appointments").select("*", { count: "exact", head: true }).gt("created_at", dateFilter),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).gt("created_at", monthDateFilter),
    supabase.from("admin_profiles").select("*", { count: "exact", head: true }).gt("created_at", monthDateFilter),
  ])

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
  const supabase = await createServerSupabaseClient()

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
  const supabase = await createServerSupabaseClient()

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
  const supabase = await createServerSupabaseClient()
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
