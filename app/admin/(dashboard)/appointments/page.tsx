import Link from "next/link"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { StatusBadge } from "@/lib/utils/status-helpers"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/types/database"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AppointmentsPage() {
  console.log("Randevular sayfası yükleniyor...")

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
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("Randevular:", appointments)

    if (error) {
      console.error("Randevular yüklenirken hata:", error)
      return <div>Randevular yüklenirken bir hata oluştu: {error.message}</div>
    }

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Randevular</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  İsim
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tarih
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Durum
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                      <div className="text-sm text-gray-500">{appointment.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(appointment.appointment_date), "d MMMM yyyy", { locale: tr })}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.appointment_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appointment.status} type="appointment" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/appointments/${appointment.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Görüntüle
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Henüz randevu bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Randevular sayfasında beklenmeyen hata:", error)
    return <div>Randevular yüklenirken beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>
  }
}
