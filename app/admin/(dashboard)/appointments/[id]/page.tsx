import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import AppointmentActions from "./actions"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  console.log("Randevu detay sayfası yükleniyor, ID:", id)

  try {
    // Admin yetkilerine sahip Supabase client kullanıyoruz
    const supabase = createAdminSupabaseClient()

    // Randevu verilerini getir
    const { data: appointment, error } = await supabase.from("appointments").select("*").eq("id", id).single()

    // Hata kontrolü
    if (error) {
      console.error("Randevu verisi getirilirken hata:", error)
      throw new Error(`Randevu verisi getirilirken hata: ${error.message}`)
    }

    if (!appointment) {
      console.error("Randevu bulunamadı, ID:", id)
      return notFound()
    }

    console.log("Randevu verisi başarıyla getirildi:", appointment)

    // Kullanıcı dostu görünüm
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
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : appointment.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {appointment.status === "pending"
                      ? "Beklemede"
                      : appointment.status === "confirmed"
                        ? "Onaylandı"
                        : appointment.status === "cancelled"
                          ? "İptal Edildi"
                          : appointment.status === "completed"
                            ? "Tamamlandı"
                            : appointment.status}
                  </span>
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
    console.error("Randevu detay sayfasında hata:", error)

    // Hata mesajını göster
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata: </strong>
          <span className="block sm:inline">
            {error instanceof Error ? error.message : "Randevu detayı yüklenirken beklenmeyen bir hata oluştu."}
          </span>
        </div>
      </div>
    )
  }
}
