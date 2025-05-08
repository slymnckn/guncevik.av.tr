import { format, formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

export function formatDate(date: string | Date): string {
  if (!date) return ""
  return format(new Date(date), "d MMMM yyyy", { locale: tr })
}

export function formatDateTime(date: string | Date): string {
  if (!date) return ""
  return format(new Date(date), "d MMMM yyyy, HH:mm", { locale: tr })
}

export function formatRelativeTime(date: string | Date): string {
  if (!date) return ""
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(amount)
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return ""

  // Telefon numarasını temizle (sadece rakamları al)
  const cleaned = phone.replace(/\D/g, "")

  // Türk telefon numarası formatı: 0(555) 123 45 67
  if (cleaned.length === 10) {
    return `0(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`
  }

  // Diğer durumlarda olduğu gibi döndür
  return phone
}

// Tarih aralığı formatlama fonksiyonu
export function formatDateRange(date: Date, format: "day" | "month" | "year" = "day"): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: format === "day" ? "numeric" : undefined,
  }

  return new Intl.DateTimeFormat("tr-TR", options).format(date)
}
