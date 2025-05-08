"use client"

import type React from "react"
import Link from "next/link"
import { MessageSquare, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { ContactSubmission, DashboardStats } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  color: string
}

export function StatCard({ title, value, icon, description, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}

interface DashboardStatsProps {
  stats: DashboardStats
}

export function DashboardStatsSection({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Toplam İletişim"
        value={stats.totalContacts}
        icon={<MessageSquare className="h-6 w-6 text-blue-600" />}
        description="Toplam iletişim formu gönderimi"
        color="bg-blue-100"
      />
      {/*
      <StatCard
        title="Toplam Danışmanlık"
        value={stats.totalConsultations}
        icon={<Users className="h-6 w-6 text-green-600" />}
        description="Toplam danışmanlık talebi"
        color="bg-green-100"
      />
      */}
      <StatCard
        title="Yeni İletişim"
        value={stats.newContacts}
        icon={<MessageSquare className="h-6 w-6 text-purple-600" />}
        description="Son 7 gündeki iletişim formları"
        color="bg-purple-100"
      />
      {/*
      <StatCard
        title="Yeni Danışmanlık"
        value={stats.newConsultations}
        icon={<Users className="h-6 w-6 text-amber-600" />}
        description="Son 7 gündeki danışmanlık talepleri"
        color="bg-amber-100"
      />
      */}
    </div>
  )
}

interface RecentContactsProps {
  contacts: ContactSubmission[]
}

export function RecentContactsSection({ contacts }: RecentContactsProps) {
  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Son İletişim Mesajları</h2>
          <Link href="/admin/messages" className="text-primary hover:text-primary/80 text-sm flex items-center">
            Tümünü Görüntüle <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                </div>
                <StatusBadge status={contact.status} />
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-1">{contact.subject}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true, locale: tr })}
                </span>
                <Link href={`/admin/messages/${contact.id}`} className="text-primary hover:text-primary/80 text-xs">
                  Detaylar
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">Henüz iletişim mesajı bulunmamaktadır.</div>
        )}
      </div>
    </div>
  )
}

/*
interface RecentConsultationsProps {
  consultations: ConsultationRequest[]
}

export function RecentConsultationsSection({ consultations }: RecentConsultationsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Son Danışmanlık Talepleri</h2>
          <Link href="/admin/consultations" className="text-primary hover:text-primary/80 text-sm flex items-center">
            Tümünü Görüntüle <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {consultations.length > 0 ? (
          consultations.map((consultation) => (
            <div key={consultation.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{consultation.name}</h3>
                  <p className="text-sm text-gray-500">{consultation.email}</p>
                </div>
                <StatusBadge status={consultation.status} />
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-1">{consultation.subject}</p>
              <div className="mt-1 text-xs text-gray-500">
                {getServiceAreaName(consultation.service_area)}
                {consultation.files && consultation.files.length > 0 && (
                  <span className="ml-2 inline-flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {consultation.files.length} dosya
                  </span>
                )}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(consultation.created_at), { addSuffix: true, locale: tr })}
                </span>
                <Link
                  href={`/admin/consultations/${consultation.id}`}
                  className="text-primary hover:text-primary/80 text-xs"
                >
                  Detaylar
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">Henüz danışmanlık talebi bulunmamaktadır.</div>
        )}
      </div>
    </div>
  )
}
*/

function StatusBadge({ status }: { status: string }) {
  let bgColor = ""
  let textColor = ""
  let icon = null
  let label = ""

  switch (status) {
    case "new":
      bgColor = "bg-blue-100"
      textColor = "text-blue-800"
      icon = <AlertCircle className="h-3 w-3 mr-1" />
      label = "Yeni"
      break
    case "in_progress":
      bgColor = "bg-yellow-100"
      textColor = "text-yellow-800"
      icon = <Clock className="h-3 w-3 mr-1" />
      label = "İşleme Alındı"
      break
    case "completed":
      bgColor = "bg-green-100"
      textColor = "text-green-800"
      icon = <CheckCircle className="h-3 w-3 mr-1" />
      label = "Tamamlandı"
      break
    default:
      bgColor = "bg-gray-100"
      textColor = "text-gray-800"
      label = status
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  )
}

// Map service area codes to readable names
/*
function getServiceAreaName(code: string): string {
  const serviceAreas: Record<string, string> = {
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

  return serviceAreas[code] || code
}
*/
