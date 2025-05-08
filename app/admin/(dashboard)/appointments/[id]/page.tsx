import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: appointment, error } = await supabase.from("appointments").select("*").eq("id", params.id).single()

  if (error || !appointment) {
    console.error("Error fetching appointment:", error)
    notFound()
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Randevu Detayı</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Randevu Bilgileri</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Tarih:</span>
                <span className="ml-2">{appointment.appointment_date}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Saat:</span>
                <span className="ml-2">{appointment.appointment_time}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Durum:</span>
                <span className="ml-2">{appointment.status}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Konu:</span>
                <span className="ml-2">{appointment.subject || "-"}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Kişi Bilgileri</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">İsim:</span>
                <span className="ml-2">{appointment.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">E-posta:</span>
                <span className="ml-2">{appointment.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Telefon:</span>
                <span className="ml-2">{appointment.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Mesaj</h2>
          <p className="whitespace-pre-wrap">{appointment.message || "Mesaj bulunmuyor."}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Notlar</h2>
          <p className="whitespace-pre-wrap">{appointment.notes || "Not bulunmuyor."}</p>
        </div>
      </div>
    </div>
  )
}
