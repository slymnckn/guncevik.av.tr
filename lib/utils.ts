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
  if (!text) return ""

  // Türkçe karakterleri değiştir
  const turkishChars = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    İ: "i",
    Ç: "c",
    Ğ: "g",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  }

  let newText = text.toString().toLowerCase()

  // Türkçe karakterleri değiştir
  for (const [key, value] of Object.entries(turkishChars)) {
    newText = newText.replace(new RegExp(key, "g"), value)
  }

  return newText
    .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
    .replace(/[^\w-]+/g, "") // Alfanümerik ve tire dışındaki karakterleri kaldır
    .replace(/--+/g, "-") // Birden fazla tireyi tek tire ile değiştir
    .replace(/^-+/, "") // Baştaki tireleri kaldır
    .replace(/-+$/, "") // Sondaki tireleri kaldır
}

// Hatalı export kaldırıldı: export * from "./utils/index"
