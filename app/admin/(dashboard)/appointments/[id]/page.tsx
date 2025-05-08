import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { notFound } from "next/navigation"
import { StatusBadge } from "@/lib/utils/status-helpers"
import AppointmentActions from "./actions"
import type { Database } from "@/lib/types/database"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  console.log("Randevu detay sayfası yükleniyor, ID:", id)

  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Cookies can't be set in middleware
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // Cookies can't be removed in middleware
          }
        },
      },
    },
  )

  try {
    const { data: appointment, error } = await supabase.from("appointments").select("*").eq("id", id).single()

    console.log("Randevu detayı:", appointment)

    if (error || !appointment) {
      console.error("Randevu detayı yüklenirken hata:", error)
      return notFound()
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Randevu Detayı</h1>
          <AppointmentActions appointment={appointment} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Kişisel Bilgiler</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 block text-sm">İsim:</span>
                  <span className="font-medium">{appointment.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-sm">E-posta:</span>
                  <span className="font-medium">{appointment.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-sm">Telefon:</span>
                  <span className="font-medium">{appointment.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Randevu Bilgileri</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 block text-sm">Tarih:</span>
                  <span className="font-medium">
                    {format(new Date(appointment.appointment_date), "d MMMM yyyy", { locale: tr })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-sm">Saat:</span>
                  <span className="font-medium">{appointment.appointment_time}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-sm">Konu:</span>
                  <span className="font-medium">{appointment.subject || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-sm">Durum:</span>
                  <StatusBadge status={appointment.status} type="appointment" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Mesaj</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="whitespace-pre-wrap">{appointment.message || "Mesaj yok"}</p>
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Notlar</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-wrap">{appointment.notes}</p>
              </div>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500">
            <p>Oluşturulma: {format(new Date(appointment.created_at), "d MMMM yyyy HH:mm", { locale: tr })}</p>
            {appointment.updated_at && (
              <p>Son Güncelleme: {format(new Date(appointment.updated_at), "d MMMM yyyy HH:mm", { locale: tr })}</p>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Randevu detay sayfasında beklenmeyen hata:", error)
    return <div>Randevu detayı yüklenirken beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>
  }
}
