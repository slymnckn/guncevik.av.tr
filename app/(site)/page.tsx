import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/section-header"
import { CTASection } from "@/components/cta-section"
import { ArrowRight } from "lucide-react"
import { LawFirmSchema } from "@/components/seo/law-firm-schema"
import { getServices } from "@/actions/service-actions"
import { getIconComponent } from "@/lib/utils/icon-helper"

export const metadata = {
  title: "GÜN ÇEVİK Hukuk Bürosu | İzmir'de Uzman Avukatlık Hizmetleri",
  description:
    "İzmir'de uzman hukuk danışmanlığı ve avukatlık hizmetleri. Ticaret, sigorta, iş hukuku, ceza hukuku ve daha fazlası.",
}

export default async function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guncevik.av.tr"

  // Veritabanından hizmetleri al
  let services = []
  let featuredServices = []

  try {
    services = await getServices()
    // Öne çıkan hizmetleri filtrele ve en fazla 6 tane göster
    featuredServices = services.filter((service) => service.is_featured).slice(0, 6)
  } catch (error) {
    console.error("Hizmetler yüklenirken hata oluştu:", error)
    // Hata durumunda boş array kullan
    services = []
    featuredServices = []
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Schema.org yapısal veri */}
      <LawFirmSchema
        name="GÜN ÇEVİK Hukuk Bürosu"
        description="İzmir'de uzman hukuk danışmanlığı ve avukatlık hizmetleri."
        url={siteUrl}
        logo={`${siteUrl}/gc-law-logo.png`}
        address={{
          streetAddress: "Çınar, 5003/2 Sk. No:3 D:202 Gümüş Plaza Optimus",
          addressLocality: "Bornova",
          addressRegion: "İzmir",
          postalCode: "35090",
          addressCountry: "TR",
        }}
        telephone="+905536671658"
        email="guncevikhukuk@gmail.com"
        sameAs={["https://www.linkedin.com/company/guncevikhukuk"]}
        openingHours={["Mo-Fr 09:00-18:00"]}
        geo={{
          latitude: 38.46,
          longitude: 27.22,
        }}
      />

      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 mb-16">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between py-12">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">GÜN ÇEVİK Hukuk Bürosu</h1>
            <p className="text-xl mb-6 text-gray-100">
              İzmir'de uzman hukuk danışmanlığı ve avukatlık hizmetleri. Ticaret, sigorta, iş hukuku, ceza hukuku ve
              daha fazlası.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-white text-primary hover:bg-gray-100 font-medium text-base">
                <Link href="/hizmetlerimiz">Hizmetlerimiz</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-primary text-white hover:bg-white hover:text-primary border-primary border-2 transition-colors font-medium text-base shadow-sm"
              >
                <Link href="/iletisim">Bize Ulaşın</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/20 rounded-lg"></div>
              <Image
                src="/confident-legal-professional.png"
                alt="GÜN ÇEVİK Hukuk Bürosu - Profesyonel Hukuk Hizmetleri"
                width={500}
                height={350}
                className="rounded-lg shadow-lg relative z-10"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-12">
        <SectionHeader
          title="Hizmetlerimiz"
          subtitle="Geniş bir yelpazede hukuki hizmetler sunuyoruz. İhtiyacınıza uygun çözümler için yanınızdayız."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.length > 0 ? (
            featuredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all hover:shadow-lg"
              >
                <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {getIconComponent(service.icon || "briefcase")}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">{service.description}</p>
                <Button asChild variant="link" className="p-0">
                  <Link href={`/hizmetlerimiz/${service.slug}`} className="flex items-center">
                    Detaylı Bilgi <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
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
        <div className="text-center mt-8">
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/hizmetlerimiz">Tüm Hizmetlerimiz</Link>
          </Button>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2 mb-6 md:mb-0 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-3 -left-3 w-16 h-16 bg-primary/20 rounded-lg"></div>
                <Image
                  src="/hukuku-demokrasi.jpeg"
                  alt="Adalet Sembolleri - Hakim Tokmağı ve Adalet Heykeli"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-lg relative z-10 w-full"
                />
                <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-amber-500/20 rounded-lg"></div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-3">Hakkımızda</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                GÜN ÇEVİK Hukuk Bürosu, İzmir'de geniş bir yelpazede hukuki hizmetler sunan, müvekkillerinin haklarını
                korumak için özverili çalışan bir hukuk bürosudur. Deneyimli ekibimizle, karmaşık hukuki sorunlara
                pratik ve etkili çözümler sunuyoruz.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Profesyonel Yaklaşım</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Hızlı Çözümler</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm">Uzman Ekip</span>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/hakkimizda">Daha Fazla Bilgi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Sık Sorulan Sorular"
            subtitle="Hukuki süreçler hakkında merak ettiğiniz soruların yanıtları"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <h3 className="text-xl font-bold mb-3">Hukuki danışmanlık hizmetiniz nasıl işliyor?</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Hukuki danışmanlık hizmetimiz, müvekkillerimizin karşılaştıkları hukuki sorunlara çözüm bulmak amacıyla sunduğumuz profesyonel bir hizmettir. İlk görüşmede sorununuzu dinliyor, gerekli bilgi ve belgeleri inceliyor ve size en uygun hukuki stratejiyi sunuyoruz. Danışmanlık hizmetimiz kapsamında sözlü veya yazılı hukuki görüş sunabilir, gerekli hukuki belgeleri hazırlayabilir ve süreç boyunca size rehberlik edebiliriz.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
              <h3 className="text-xl font-bold mb-3">Dava süreçleri ne kadar sürer?</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Dava süreleri, davanın türüne, karmaşıklığına ve mahkemelerin iş yüküne göre değişiklik gösterir. Size
                özel durumunuz için detaylı bilgi verebiliriz.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/sss">Tüm Sorular</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  )
}
