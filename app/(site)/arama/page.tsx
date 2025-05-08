import { Suspense } from "react"
import { SiteWrapper } from "@/components/site-wrapper"
import { SearchResults } from "@/components/search/search-results"
import { SearchForm } from "@/components/search/search-form"
import { SearchSkeleton } from "@/components/skeletons/search-skeleton"

interface SearchPageProps {
  searchParams: { q?: string; type?: string; page?: string }
}

export const metadata = {
  title: "Arama | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu web sitesinde arama yapın.",
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const type = searchParams.type || "all"
  const page = Number.parseInt(searchParams.page || "1")

  return (
    <SiteWrapper>
      <div className="bg-gradient-to-r from-primary/90 to-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Arama</h1>
            <SearchForm initialQuery={query} initialType={type} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {query ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">"{query}" için arama sonuçları</h2>
                <p className="text-gray-600">
                  {type !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mr-2">
                      {type === "blog" ? "Makaleler" : type === "service" ? "Hizmetler" : "SSS"}
                    </span>
                  )}
                </p>
              </div>

              <Suspense fallback={<SearchSkeleton />}>
                <SearchResults query={query} type={type} page={page} />
              </Suspense>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Arama yapmak için bir kelime girin</h2>
              <p className="text-gray-600 mb-8">
                Makaleler, hizmetler ve sık sorulan sorular içerisinde arama yapabilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteWrapper>
  )
}
