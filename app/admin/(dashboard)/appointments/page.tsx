import { createAdminSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AppointmentsPage() {
  try {
    // Admin yetkilerine sahip Supabase client kullanıyoruz
    const supabase = createAdminSupabaseClient()

    // Randevuları getir
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false })

    // Hata kontrolü
    if (error) {
      console.error("Randevular getirilirken hata:", error)
      throw new Error(`Randevular getirilirken hata: ${error.message}`)
    }

    console.log("Randevular başarıyla getirildi:", appointments?.length || 0)

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Randevular</h1>

        {appointments && appointments.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İsim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                      <div className="text-sm text-gray-500">{appointment.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.appointment_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.appointment_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.status === "pending"
                          ? "Bekliyor"
                          : appointment.status === "confirmed"
                            ? "Onaylandı"
                            : appointment.status === "cancelled"
                              ? "İptal Edildi"
                              : appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        href={`/admin/appointments/${appointment.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">Henüz randevu bulunmuyor.</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Randevular sayfasında hata:", error)

    // Hata mesajını göster
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata: </strong>
          <span className="block sm:inline">
            {error instanceof Error ? error.message : "Randevular yüklenirken beklenmeyen bir hata oluştu."}
          </span>
        </div>
      </div>
    )
  }
}
