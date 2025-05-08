export type TimeRange = "7days" | "30days" | "90days" | "all"

export interface ContactStats {
  date: string
  count: number
}

export interface AppointmentStats {
  date: string
  count: number
}

export interface StatusDistribution {
  status: string
  count: number
}

export interface ServiceAreaDistribution {
  service_area: string
  count: number
}

export interface ReportData {
  contactStats: ContactStats[]
  appointmentStats: AppointmentStats[]
  contactStatusDistribution: StatusDistribution[]
  appointmentStatusDistribution: StatusDistribution[]
  serviceAreaDistribution: ServiceAreaDistribution[]
  totalContacts: number
  totalAppointments: number
  newContacts: number
  newAppointments: number
}

// Durum etiketleri
export const statusLabels: Record<string, string> = {
  new: "Yeni",
  in_progress: "İşleme Alındı",
  completed: "Tamamlandı",
  archived: "Arşivlendi",
}

// Servis alanları için etiketler
export const serviceAreaLabels: Record<string, string> = {
  "ticaret-ve-sirketler-hukuku": "Ticaret ve Şirketler Hukuku",
  "sigorta-hukuku": "Sigorta Hukuku",
  "is-ve-sosyal-guvenlik-hukuku": "İş ve Sosyal Güvenlik Hukuku",
  "ceza-hukuku": "Ceza Hukuku",
  "icra-ve-iflas-hukuku": "İcra ve İflas Hukuku",
  "idare-ve-vergi-hukuku": "İdare ve Vergi Hukuku",
  "gayrimenkul-ve-insaat-hukuku": "Gayrimenkul ve İnşaat Hukuku",
  "aile-hukuku": "Aile Hukuku",
  "miras-hukuku": "Miras Hukuku",
  "tazminat-hukuku": "Tazminat Hukuku",
  diger: "Diğer",
}
