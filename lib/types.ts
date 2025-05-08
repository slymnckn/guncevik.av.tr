export interface AdminUser {
  id: string
  email: string
  role: "admin" | "editor" | "viewer"
  name?: string
}

export interface ContactSubmission {
  id: string
  created_at: string
  updated_at: string | null
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: "new" | "in_progress" | "completed" | "archived"
}

export interface AppointmentRequest {
  id: string
  created_at: string
  updated_at: string | null
  name: string
  email: string
  phone: string
  service_area: string
  subject: string
  message: string
  preferred_date: string
  preferred_time: string
  status: "new" | "confirmed" | "completed" | "cancelled"
}

export interface FileAttachment {
  id: string
  created_at: string
  consultation_request_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
}

export interface DashboardStats {
  totalContacts: number
  totalConsultations: number
  newContacts: number
  newConsultations: number
  totalAppointments?: number
  totalBlogPosts?: number
  totalUsers?: number
  newAppointments?: number
  newBlogPosts?: number
  newUsers?: number
}

export interface BlogCategory {
  id: string
  created_at: string
  name: string
  slug: string
  description: string | null
}

export interface Activity {
  id: string
  type: "contact" | "appointment" | "blog" | "user"
  title: string
  description: string
  subject?: string
  service_area?: string
  created_at: string
  link: string
}
