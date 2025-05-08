import type { Metadata } from "next"
import { SectionHeader } from "@/components/section-header"
import Image from "next/image"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getIconComponent } from "@/lib/utils/icon-helper"

export const metadata: Metadata = {
  title: "Hizmetlerimiz | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu olarak sunduğumuz hukuki hizmetler ve uzmanlık alanlarımız.",
}

// Dinamik sayfa oluşturma için config
export const dynamic = "force-dynamic" // Veritabanından güncel verileri almak için dynamic yapıldı
export const revalidate = 3600 // 1 saat

export default async function ServicesPage() {
  const supabase = createServerSupabaseClient()

  // Hizmetleri doğrudan Supabase'den getir
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Hizmetleri getirme hatası:", error)
  }

  // Eğer hizmetler yoksa veya hata oluştuysa, varsayılan hizmetleri göster
  const defaultServices = [
    {
      id: "1",
      title: "TİCARET VE ŞİRKETLER HUKUKU",
      description:
        "Şirket kuruluşları, birleşme ve devralma işlemleri, konkordato, ticari sözleşmeler, ticari alım-satım uyuşmazlıkları, kıymetli evrak hukuku konusunda hukuki hizmet vermekteyiz.",
      icon: "briefcase",
      slug: "ticaret-ve-sirketler-hukuku",
    },
    {
      id: "2",
      title: "SİGORTA HUKUKU",
      description:
        "Sigorta poliçelerinden doğan tazminat rücu davaları ve diğer sigorta hukuku uyuşmazlıkları konusunda hukuki hizmet vermekteyiz.",
      icon: "shield",
      slug: "sigorta-hukuku",
    },
    {
      id: "3",
      title: "İŞ VE SOSYAL GÜVENLİK HUKUKU",
      description:
        "İşçi-işveren ilişkilerinden doğan uyuşmazlıklar, iş sözleşmeleri, toplu iş sözleşmeleri ve sendikal haklardan doğan uyuşmazlıklar, iş kazası ve meslek hastalığından doğan uyuşmazlıklar konusunda hukuki hizmet vermekteyiz.",
      icon: "users",
      slug: "is-ve-sosyal-guvenlik-hukuku",
    },
    {
      id: "4",
      title: "CEZA HUKUKU",
      description:
        "Şikayet, soruşturma ve kovuşturma aşamalarında ceza davalarının takibi konusunda hukuki hizmet vermekteyiz.",
      icon: "scale",
      slug: "ceza-hukuku",
    },
    {
      id: "5",
      title: "İCRA İFLAS HUKUKU",
      description:
        "Müvekkillerimizin alacaklarının tahsil edilmesi amacıyla icra takibi sürecinin hızlı ve etkin bir şekilde yürütülmesi için hukuki destek sunuyoruz.",
      icon: "dollar-sign",
      slug: "icra-iflas-hukuku",
    },
    {
      id: "6",
      title: "İDARE VE VERGİ HUKUKU",
      description:
        "İdari eylem ve işlemlerden kaynaklanan iptal ve tam yargı davaları, yürütmenin durdurulması talepleri, vergi cezalarına itiraz, uzlaşma görüşmeleri, vergi cezalarının iptali davaları konusunda hukuki hizmet vermekteyiz.",
      icon: "file-text",
      slug: "idare-ve-vergi-hukuku",
    },
    {
      id: "7",
      title: "GAYRİMENKUL VE İNŞAAT HUKUKU",
      description:
        "Kira sözleşmeleri ile kira hukukundan kaynaklanan uyuşmazlıklar, tapu kaydının düzeltilmesi, tapu iptal ve tescili, haksız işgal ve ecrimisil davaları, imar uygulamasından kaynaklanan uyuşmazlıklar, kat karşılığı inşaat sözleşmeleri, taşınmaz satış vaadi sözleşmeleri, kamulaştırma uyuşmazlıklarında konularında hukuki hizmet vermekteyiz.",
      icon: "home",
      slug: "gayrimenkul-ve-insaat-hukuku",
    },
    {
      id: "8",
      title: "AİLE HUKUKU",
      description:
        "Boşanma, velayet, nafaka, mal paylaşımı, maddi ve manevi tazminat gibi aile hukukunu ilgilendiren konularda hukuki hizmet vermekteyiz.",
      icon: "heart",
      slug: "aile-hukuku",
    },
    {
      id: "9",
      title: "MİRAS HUKUKU",
      description:
        "Vasiyetname ve miras sözleşmelerinin düzenlenmesi, mirasın reddi, veraset ve intikal işlemlerinin yürütülmesi, ortaklığın giderilmesi, tenkis, denkleştirme davaları konusunda hukuki hizmet vermekteyiz.",
      icon: "file",
      slug: "miras-hukuku",
    },
    {
      id: "10",
      title: "TAZMİNAT HUKUKU",
      description:
        "Trafik kazaları, iş kazaları, hatalı tıbbi uygulamalardan kaynaklanan uyuşmazlıklar ve haksız fiillerden kaynaklanan maddi ve manevi tazminat talepleri konusunda hukuki hizmet vermekteyiz.",
      icon: "award",
      slug: "tazminat-hukuku",
    },
  ]

  // Supabase'den gelen hizmetleri veya varsayılan hizmetleri kullan
  const displayServices = services && services.length > 0 ? services : defaultServices

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 text-white rounded-lg p-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Hizmetlerimiz</h1>
          <p className="text-lg text-gray-300">
            GÜN ÇEVİK Hukuk Bürosu olarak, geniş bir yelpazede hukuki hizmet sunmaktayız.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <SectionHeader
            title="Hukuki Hizmetlerimiz"
            subtitle="Uzman avukatlarımızla birlikte, müvekkillerimize kapsamlı hukuki destek sunuyoruz."
          />
          <div className="prose dark:prose-invert max-w-none mt-6">
            <p>
              GÜN ÇEVİK Hukuk Bürosu olarak, müvekkillerimizin hukuki ihtiyaçlarını en iyi şekilde karşılamak için
              çeşitli alanlarda uzmanlaşmış avukatlarımızla hizmet vermekteyiz. Her bir davaya özel yaklaşım
              geliştirerek, müvekkillerimizin haklarını en iyi şekilde korumayı hedefliyoruz.
            </p>
            <p>
              Aşağıda sunduğumuz hukuki hizmetlerin detaylarını bulabilirsiniz. Her bir alanda, güncel mevzuat ve
              içtihatları takip ederek, müvekkillerimize en doğru hukuki danışmanlığı sunmaktayız.
            </p>
          </div>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/legal-books-scales.png"
            alt="Hukuk Kitapları ve Adalet Terazisi"
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {displayServices.map((service) => (
          <div key={service.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <div className="text-primary mb-4">{getIconComponent(service.icon || "Briefcase")}</div>
            <h3 className="font-bold text-lg mb-2">{service.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 flex-grow">{service.description}</p>
            {service.slug && (
              <div className="mt-4">
                <Link
                  href={`/hizmetlerimiz/${service.slug}`}
                  className="text-primary hover:underline flex items-center"
                >
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
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg mb-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Hukuki Danışmanlık İçin Bize Ulaşın</h2>
          <p className="mb-6">
            Hukuki sorunlarınız için profesyonel destek almak ister misiniz? Deneyimli ekibimiz yanınızda.
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
