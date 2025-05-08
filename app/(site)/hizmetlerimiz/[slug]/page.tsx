import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getIconComponent } from "@/lib/utils/icon-helper"

interface ServicePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data: service } = await supabase.from("services").select("*").eq("slug", params.slug).single()

  if (!service) {
    return {
      title: "Hizmet Bulunamadı | GÜN ÇEVİK Hukuk Bürosu",
      description: "Aradığınız hizmet bulunamadı.",
    }
  }

  return {
    title: `${service.title} | GÜN ÇEVİK Hukuk Bürosu`,
    description: service.description || `${service.title} alanında uzman hukuki danışmanlık hizmetleri.`,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const supabase = createServerSupabaseClient()
  const { data: service, error } = await supabase.from("services").select("*").eq("slug", params.slug).single()

  if (error || !service) {
    notFound()
  }

  // Diğer hizmetleri getir (önerilen hizmetler için)
  const { data: otherServices } = await supabase
    .from("services")
    .select("id, title, slug, description, icon")
    .neq("id", service.id)
    .order("order_index", { ascending: true })
    .limit(3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/hizmetlerimiz" className="text-primary hover:underline flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tüm Hizmetlerimiz
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-16">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="text-primary mr-4">{getIconComponent(service.icon || "Briefcase")}</div>
            <h1 className="text-3xl font-bold">{service.title}</h1>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            {service.content ? (
              <div dangerouslySetInnerHTML={{ __html: service.content }} />
            ) : (
              <>
                <p>{service.description}</p>
                <p>
                  GÜN ÇEVİK Hukuk Bürosu olarak, {service.title.toLowerCase()} alanında uzman avukatlarımızla
                  müvekkillerimize kapsamlı hukuki destek sunmaktayız. Her davanın kendine özgü koşullarını
                  değerlendirerek, müvekkillerimizin haklarını en iyi şekilde korumak için çalışıyoruz.
                </p>
                <p>
                  Bu alanda sunduğumuz hizmetler hakkında daha detaylı bilgi almak için lütfen bizimle iletişime geçin.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {otherServices && otherServices.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Diğer Hizmetlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherServices.map((otherService) => (
              <div key={otherService.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="text-primary mb-4">{getIconComponent(otherService.icon)}</div>
                <h3 className="font-bold text-lg mb-2">{otherService.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{otherService.description}</p>
                <Link
                  href={`/hizmetlerimiz/${otherService.slug}`}
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
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Hukuki Danışmanlık İçin Bize Ulaşın</h2>
          <p className="mb-6">
            {service.title} ile ilgili sorularınız mı var? Deneyimli avukatlarımız size yardımcı olmak için hazır.
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
