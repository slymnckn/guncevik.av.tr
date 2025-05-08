import Image from "next/image"

export const metadata = {
  title: "Müvekkil Referanslarımız | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu müvekkillerinin değerli yorumları ve referansları.",
}

export default function ReferencesPage() {
  const references = [
    {
      name: "ABC Holding",
      logo: "/abstract-abc-logo.png",
      testimonial:
        "GÜN ÇEVİK Hukuk Bürosu ile 5 yıldır çalışıyoruz. Ticari davalarımızda gösterdikleri profesyonel yaklaşım ve uzmanlık sayesinde birçok zorlu süreçten başarıyla çıktık.",
      person: "Ahmet Yılmaz",
      title: "Genel Müdür",
    },
    {
      name: "XYZ Teknoloji A.Ş.",
      logo: "/abstract-tech-logo.png",
      testimonial:
        "Şirketimizin karşılaştığı karmaşık fikri mülkiyet davalarında GÜN ÇEVİK Hukuk Bürosu'nun stratejik yaklaşımı ve derin bilgisi sayesinde haklarımızı korumayı başardık.",
      person: "Zeynep Kaya",
      title: "Hukuk Müşaviri",
    },
    {
      name: "123 İnşaat",
      logo: "/abstract-construction-logo.png",
      testimonial:
        "Büyük bir inşaat projemizde karşılaştığımız hukuki sorunlarda GÜN ÇEVİK Hukuk Bürosu'nun çözüm odaklı yaklaşımı ve hızlı müdahalesi sayesinde projemiz aksamadan ilerleyebildi.",
      person: "Mehmet Demir",
      title: "Proje Müdürü",
    },
    {
      name: "Global Sigorta",
      logo: "/abstract-global-insurance.png",
      testimonial:
        "Sigorta hukuku alanındaki uzmanlıkları ve detaylı analizleri sayesinde, karmaşık hasar tazminat süreçlerimizi başarıyla yönettiler. Kendileriyle çalışmak büyük bir ayrıcalık.",
      person: "Ayşe Yıldız",
      title: "Hasar Departmanı Müdürü",
    },
    {
      name: "Mega Market Zinciri",
      logo: "/vibrant-marketplace.png",
      testimonial:
        "50'den fazla şubemizin tüm hukuki süreçlerini yöneten GÜN ÇEVİK Hukuk Bürosu, özellikle iş hukuku ve gayrimenkul hukuku alanlarında sunduğu kapsamlı hizmetlerle bizi hiç yanıltmadı.",
      person: "Ali Kara",
      title: "İK Direktörü",
    },
    {
      name: "Öncü Otomotiv",
      logo: "/abstract-automotive-logo.png",
      testimonial:
        "Distribütörlük sözleşmelerimizin hazırlanması ve uyuşmazlıkların çözümünde gösterdikleri profesyonel yaklaşım için GÜN ÇEVİK Hukuk Bürosu'na teşekkür ederiz.",
      person: "Hakan Şahin",
      title: "Satış Direktörü",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Referanslarımız</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center">
          Yıllar içinde birlikte çalıştığımız değerli müvekkillerimizin bazıları ve görüşleri
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {references.map((ref, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="relative h-16 w-40">
                  <Image
                    src={ref.logo || "/placeholder.svg"}
                    alt={`${ref.name} Logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 opacity-20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">{ref.testimonial}</p>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500">
                    {ref.person.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{ref.person}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ref.title}, {ref.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Çalıştığımız Kurumlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center"
              >
                <div className="relative h-16 w-full">
                  <Image
                    src={`/abstract-kurum.png?height=60&width=180&query=Kurum%20${item}%20Logo`}
                    alt={`Kurum ${item}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Siz de Referanslarımız Arasında Yer Alın</h2>
            <p className="mb-6">
              Hukuki sorunlarınız için profesyonel destek almak ister misiniz? Deneyimli ekibimiz yanınızda.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/iletisim"
                className="bg-white text-blue-800 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                İletişime Geçin
              </a>
              <a
                href="/randevu"
                className="bg-transparent border border-white text-white px-6 py-2 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Randevu Alın
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
