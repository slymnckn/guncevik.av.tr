import { AppointmentForm } from "@/components/appointment-form"
import { SectionHeader } from "@/components/section-header"

export const metadata = {
  title: "Randevu Talebi | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu'ndan randevu talep edin. Hukuki danışmanlık için uygun bir zaman belirleyin.",
}

export default function AppointmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader
        title="Randevu Talebi"
        subtitle="Hukuki danışmanlık için randevu talebinde bulunabilirsiniz. Aşağıdaki formu doldurarak size uygun bir tarih ve saatte görüşme ayarlayabiliriz."
      />

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Randevu Bilgileri</h2>
          <p className="mb-6">
            Randevu talebinizi aldıktan sonra, en kısa sürede sizinle iletişime geçerek randevunuzu onaylayacağız. Acil
            durumlarda lütfen doğrudan telefonla iletişime geçiniz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Çalışma Saatlerimiz</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="font-medium w-32">Pazartesi - Cuma:</span>
                  <span>09:00 - 18:00</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium w-32">Cumartesi:</span>
                  <span>10:00 - 14:00 (Randevu ile)</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium w-32">Pazar:</span>
                  <span>Kapalı</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">İletişim Bilgilerimiz</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="font-medium w-32">Telefon:</span>
                  <span>+90 553 667 16 58</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium w-32">E-posta:</span>
                  <span>guncevikhukuk@gmail.com</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium w-32">Adres:</span>
                  <span>Konak, İzmir</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <AppointmentForm />
      </div>
    </div>
  )
}
