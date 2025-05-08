"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, ExternalLink, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils/formatting"
import { Badge } from "@/components/ui/badge"

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        const supabase = createClientSupabaseClient()

        // Hizmetleri getir
        const { data, error } = await supabase.from("services").select("*").order("order_index", { ascending: true })

        if (error) {
          console.error("Hizmetleri getirme hatası:", error)
          setError(`Hizmetleri getirme hatası: ${error.message}`)
          return
        }

        setServices(data || [])
      } catch (err) {
        console.error("Beklenmeyen hata:", err)
        setError("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Hizmetler</h1>
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
        <Card>
          <CardHeader>
            <div className="w-48 h-7 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-96 h-5 bg-gray-200 animate-pulse rounded-md"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-full h-12 bg-gray-200 animate-pulse rounded-md"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hizmetler</h1>
        <Link href="/admin/services/new" passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Hizmet
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Hizmetler</CardTitle>
          <CardDescription>
            Hukuk bürosunun sunduğu tüm hizmetlerin listesi. Toplam: {services?.length || 0} hizmet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
              <p>{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Yeniden Dene
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Başlık</th>
                    <th className="text-left py-3 px-4">Slug</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-left py-3 px-4">Oluşturulma</th>
                    <th className="text-left py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {services && services.length > 0 ? (
                    services.map((service) => (
                      <tr key={service.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{service.title}</td>
                        <td className="py-3 px-4">{service.slug}</td>
                        <td className="py-3 px-4">
                          <Badge variant={service.is_featured ? "default" : "outline"}>
                            {service.is_featured ? "Öne Çıkan" : "Normal"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{formatDate(service.created_at)}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Link href={`/admin/services/edit/${service.id}`} passHref>
                              <Button variant="outline" size="sm">
                                <Pencil className="mr-2 h-4 w-4" />
                                Düzenle
                              </Button>
                            </Link>
                            <Link href={`/hizmetlerimiz/${service.slug}`} passHref target="_blank">
                              <Button variant="outline" size="sm">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Görüntüle
                              </Button>
                            </Link>
                            <Link href={`/admin/services/delete/${service.id}`} passHref>
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Sil
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted-foreground">
                        Henüz hizmet bulunmuyor.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
