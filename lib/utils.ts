import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  if (!date) return ""
  return format(new Date(date), "d MMMM yyyy", { locale: tr })
}

export function formatDateTime(date: string | Date) {
  if (!date) return ""
  return format(new Date(date), "d MMMM yyyy HH:mm", { locale: tr })
}

export function getStatusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "Bekliyor"
    case "confirmed":
      return "Onaylandı"
    case "cancelled":
      return "İptal Edildi"
    case "completed":
      return "Tamamlandı"
    default:
      return status
  }
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

// Hatalı export kaldırıldı: export * from "./utils/index"
