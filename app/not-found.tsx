import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Sayfa Bulunamadı</h2>
        <p className="text-gray-600 mb-8">
          Aradığınız sayfa bulunamadı veya taşınmış olabilir. Ana sayfaya dönmek için aşağıdaki butona
          tıklayabilirsiniz.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/iletisim">Bize Ulaşın</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
