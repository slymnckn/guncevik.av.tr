"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hata loglaması yapılabilir
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Hata</h1>
        <h2 className="text-2xl font-semibold mb-4">Bir şeyler yanlış gitti</h2>
        <p className="text-gray-600 mb-8">
          Üzgünüz, bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={reset}>Yeniden Dene</Button>
          <Button asChild variant="outline">
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
