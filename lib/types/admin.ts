// Admin panel için tip tanımlamaları

import type { User } from "@supabase/auth-helpers-nextjs"

export type AdminRole = "admin" | "editor" | "viewer"

export interface AdminProfile {
  id: string
  email: string
  name: string
  role: string
  created_at: string
  updated_at: string
  avatar_url?: string
  last_sign_in_at?: string
  is_active: boolean
}

export interface AdminUser extends User {
  profile?: AdminProfile
}

export interface BlogPost {
  id: string
  created_at: string
  updated_at: string | null
  title: string
  slug: string
  excerpt: string | null
  content: string
  image_path: string | null
  category: string
  author_id: string
  published: boolean
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
}

export interface BlogCategory {
  id: string
  created_at: string
  name: string
  slug: string
  description: string | null
}

export interface Service {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  icon?: string
  image_path?: string
  order_index: number
  is_featured: boolean
  created_at: string
  updated_at?: string
}

export interface Appointment {
  id: string
  created_at: string
  updated_at: string | null
  name: string
  email: string
  phone: string
  appointment_date: string
  appointment_time: string
  subject: string | null
  message: string | null
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes: string | null
}

export interface Testimonial {
  id: string
  created_at: string
  updated_at: string | null
  name: string
  role: string | null
  image_path: string | null
  rating: number
  testimonial: string
  is_approved: boolean
  is_featured: boolean
  order_index: number
}

export interface FAQ {
  id: string
  created_at: string
  updated_at: string | null
  question: string
  answer: string
  category: string
  order_index: number
  is_published: boolean
}

export interface SiteSetting {
  id: string
  created_at: string
  updated_at: string | null
  setting_key: string
  setting_value: string | null
  setting_type: "text" | "number" | "boolean" | "json" | "image"
}

export interface TeamMember {
  id: string
  created_at: string
  updated_at: string | null
  name: string
  title: string
  bio: string | null
  image_path: string | null
  email: string | null
  phone: string | null
  order_index: number
  is_published: boolean
}

export interface Page {
  id: string
  created_at: string
  updated_at: string | null
  title: string
  slug: string
  content: string
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: string
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  meta_title?: string
  meta_description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image_path?: string
  category_id?: string
  author_id: string
  published: boolean
  published_at?: string
  meta_title?: string
  meta_description?: string
  view_count: number
  created_at: string
  updated_at: string
  category?: BlogCategory
  author?: AdminProfile
  tags?: BlogTag[]
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface BlogPostTag {
  id: string
  post_id: string
  tag_id: string
  created_at: string
}
