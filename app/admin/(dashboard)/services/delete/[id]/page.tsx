"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DeleteServicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [service, setService] = useState<any>(null)

  useEffect(() => {
    async function fetchService() {
      try {
        setLoading(true)
        const supabase = createClientSupabaseClient()

        // Hizmeti getir
        const { data, error } = await supabase.from("services").select("*").eq("id", id).single()

        if (error) {
          console.error("Hizmet getirme hatası:", error)
          setError(`Hizmet getirilirken bir hata oluştu: ${error.message}`)
          return
        }

        if (!data) {
          setError("Hizmet bulunamadı.")
          return
        }

        setService(data)
      } catch (err) {
        console.error("Beklenmeyen hata:", err)
        setError("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [id])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      setError(null)
      setSuccess(false)

      const supabase = createClientSupabaseClient()

      // Hizmeti sil
      const { error } = await supabase.from("services").delete().eq("id", id)

      if (error) {
        console.error("Hizmet silme hatası:", error)
        setError(`Hizmet silinirken bir hata oluştu: ${error.message}`)
        return
      }

      setSuccess(true)

      // Başarılı olduktan sonra hizmetler sayfasına yönlendir
      setTimeout(() => {
        router.push("/admin/services")
      }, 1500)
    } catch (err) {
      console.error("Beklenmeyen hata:", err)
      setError("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Hizmet Sil</h1>
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
        <Card>
          <CardHeader>
            <div className="w-48 h-7 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-96 h-5 bg-gray-200 animate-pulse rounded-md"></div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-24 bg-gray-200 animate-pulse rounded-md"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hizmet Sil</h1>
        <Link href="/admin/services" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Hizmetlere Dön
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Hizmet Silme Onayı
          </CardTitle>
          <CardDescription>Bu işlem geri alınamaz. Lütfen silme işlemini onaylayın.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-md">
              <p>Hizmet başarıyla silindi! Yönlendiriliyorsunuz...</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="font-medium text-lg">{service?.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Slug: {service?.slug}</p>
              <p className="mt-2">{service?.description}</p>
            </div>

            <div className="bg-amber-50 border-amber-200 border p-4 rounded-md">
              <p className="text-amber-800 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Bu hizmeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin/services" passHref>
            <Button variant="outline">İptal</Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>Siliniyor...</>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hizmeti Sil
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
