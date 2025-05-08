import Link from "next/link"
import { getServices } from "@/actions/service-actions"
import { getIconComponent } from "@/lib/utils/icon-helper"

export const metadata = {
  title: "Hizmetlerimiz | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu olarak sunduğumuz kapsamlı hukuki hizmetler hakkında bilgi alın.",
}

export default async function ServicesPage() {
  // Veritabanından tüm hizmetleri al
  let services = []

  try {
    services = await getServices()
  } catch (error) {
    console.error("Hizmetler yüklenirken hata oluştu:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hizmetlerimiz</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          GÜN ÇEVİK Hukuk Bürosu olarak, geniş bir yelpazede hukuki hizmetler sunuyoruz. Deneyimli avukatlarımızla
          müvekkillerimizin haklarını korumak ve hukuki sorunlarına çözüm üretmek için çalışıyoruz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all hover:shadow-lg"
            >
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                {getIconComponent(service.icon || "briefcase")}
              </div>
              <h2 className="text-xl font-bold mb-3">{service.title}</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">{service.description}</p>
              <Link href={`/hizmetlerimiz/${service.slug}`} className="text-primary hover:underline flex items-center">
                Detaylı Bilgi
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">
              Hizmet bilgileri yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Hukuki Danışmanlık İçin Bize Ulaşın</h2>
          <p className="mb-6">
            Hukuki sorunlarınız veya sorularınız için deneyimli avukatlarımız size yardımcı olmak için hazır.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/iletisim"
              className="bg-white text-gray-900 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              İletişime Geçin
            </Link>
            <Link
              href="/randevu"
              className="bg-primary border border-primary text-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-primary transition-colors"
            >
              Randevu Alın
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
