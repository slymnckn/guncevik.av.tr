import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Sayfa numaralarını oluştur
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Toplam sayfa sayısı az ise tüm sayfaları göster
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // İlk sayfayı her zaman göster
      pages.push(1)

      // Mevcut sayfa etrafındaki sayfaları göster
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      // Başlangıçta boşluk varsa "..." ekle
      if (startPage > 2) {
        pages.push("ellipsis-start")
      } else if (startPage === 2) {
        pages.push(2)
      }

      // Orta sayfaları ekle
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      // Sonda boşluk varsa "..." ekle
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end")
      } else if (endPage === totalPages - 1) {
        pages.push(totalPages - 1)
      }

      // Son sayfayı her zaman göster
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex justify-center" aria-label="Sayfalama">
      <ul className="flex items-center gap-1">
        {/* Önceki sayfa butonu */}
        <li>
          <Button
            asChild={currentPage > 1}
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={currentPage <= 1}
          >
            {currentPage > 1 ? (
              <Link href={`${baseUrl}&page=${currentPage - 1}`} aria-label="Önceki sayfa">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}
          </Button>
        </li>

        {/* Sayfa numaraları */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === "ellipsis-start" || page === "ellipsis-end" ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <Button
                asChild={page !== currentPage}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
              >
                {page !== currentPage ? <Link href={`${baseUrl}&page=${page}`}>{page}</Link> : <span>{page}</span>}
              </Button>
            )}
          </li>
        ))}

        {/* Sonraki sayfa butonu */}
        <li>
          <Button
            asChild={currentPage < totalPages}
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={currentPage >= totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={`${baseUrl}&page=${currentPage + 1}`} aria-label="Sonraki sayfa">
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </li>
      </ul>
    </nav>
  )
}
