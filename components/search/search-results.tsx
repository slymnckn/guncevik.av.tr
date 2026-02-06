import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { FileText, Briefcase, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Pagination } from "@/components/ui/pagination"

interface SearchResultsProps {
  query: string
  type?: string
  page?: number
}

export async function SearchResults({ query, type = "all", page = 1 }: SearchResultsProps) {
  const supabase = await createServerSupabaseClient()
  const limit = 10

  // API'den arama sonuçlarını getir
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}&limit=${limit}`,
    { cache: "no-store" },
  )

  if (!response.ok) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Arama sonuçları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    )
  }

  const { results, total, totalPages } = await response.json()

  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Sonuç bulunamadı</h3>
        <p className="text-gray-600 mb-4">
          "{query}" için arama sonucu bulunamadı. Lütfen farklı anahtar kelimelerle tekrar deneyin.
        </p>
        <Button asChild variant="outline">
          <Link href="/arama">Aramayı Sıfırla</Link>
        </Button>
      </div>
    )
  }

  // Görsellerin URL'lerini oluştur
  const resultsWithImages = await Promise.all(
    results.map(async (result: any) => {
      if (result.type === "blog" && result.image_path) {
        const { data } = await supabase.storage.from("blog-images").getPublicUrl(result.image_path)
        return { ...result, imageUrl: data.publicUrl }
      }
      return result
    }),
  )

  return (
    <div>
      <p className="text-gray-600 mb-6">Toplam {total} sonuç bulundu</p>

      <div className="space-y-6">
        {resultsWithImages.map((result: any) => (
          <div key={`${result.type}-${result.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {result.type === "blog" && result.imageUrl ? (
                <div className="md:w-1/4 h-48 md:h-auto relative">
                  <Image src={result.imageUrl || "/placeholder.svg"} alt={result.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="md:w-1/4 bg-gray-100 flex items-center justify-center p-6">
                  {result.type === "blog" && <FileText size={48} className="text-primary/60" />}
                  {result.type === "service" && <Briefcase size={48} className="text-primary/60" />}
                  {result.type === "faq" && <HelpCircle size={48} className="text-primary/60" />}
                </div>
              )}

              <div className="p-6 md:w-3/4">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mr-2">
                    {result.type === "blog" ? "Makale" : result.type === "service" ? "Hizmet" : "SSS"}
                  </span>
                  {result.category && <span className="text-sm text-gray-600">{result.category}</span>}
                  {result.date && (
                    <>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-600">{formatDate(result.date)}</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">
                  <Link href={result.url} className="hover:text-primary transition-colors">
                    {result.title}
                  </Link>
                </h3>

                {result.excerpt && <p className="text-gray-600 mb-4 line-clamp-2">{result.excerpt}</p>}

                <Button asChild variant="link" className="p-0">
                  <Link href={result.url}>
                    {result.type === "blog"
                      ? "Makaleyi Oku"
                      : result.type === "service"
                        ? "Hizmeti İncele"
                        : "Cevabı Gör"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/arama?q=${encodeURIComponent(query)}&type=${type}`}
          />
        </div>
      )}
    </div>
  )
}
