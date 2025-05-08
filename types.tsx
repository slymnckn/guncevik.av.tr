export interface AdminUser {
  id: string
  email: string
  role: "admin" | "editor" | "viewer"
  name?: string
}
