import type { AdminUser } from "./types"

// Belirli bir izin için yetki kontrolü
export function checkPermission(user: AdminUser | null, permission: string): boolean {
  if (!user) return false

  const permissionMap: Record<string, Array<"admin" | "editor" | "viewer">> = {
    view_dashboard: ["admin", "editor", "viewer"],
    view_contacts: ["admin", "editor", "viewer"],
    edit_contacts: ["admin", "editor"],
    delete_contacts: ["admin"],
    view_consultations: ["admin", "editor", "viewer"],
    edit_consultations: ["admin", "editor"],
    delete_consultations: ["admin"],
    view_reports: ["admin", "editor"],
    manage_users: ["admin"],
  }

  const allowedRoles = permissionMap[permission] || []
  return allowedRoles.includes(user.role)
}
