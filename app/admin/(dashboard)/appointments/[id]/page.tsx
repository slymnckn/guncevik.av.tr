import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

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

    // Basit bir görünüm döndür
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Randevu Detayı</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <pre className="whitespace-pre-wrap overflow-auto">{JSON.stringify(appointment, null, 2)}</pre>
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
