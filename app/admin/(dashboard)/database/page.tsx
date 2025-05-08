"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Database, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"

export default function DatabasePage() {
  const [loading, setLoading] = useState(false)
  const [lastBackup, setLastBackup] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const handleBackup = async () => {
    try {
      setLoading(true)

      // Burada gerçek bir yedekleme işlemi yapılabilir
      // Örnek olarak, bir API endpoint'e istek gönderilebilir

      // Simüle edilmiş yedekleme işlemi
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const now = new Date().toLocaleString("tr-TR")
      setLastBackup(now)

      toast({
        title: "Başarılı",
        description: "Veritabanı yedeklemesi başarıyla tamamlandı",
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: `Veritabanı yedeklenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOptimize = async () => {
    try {
      setLoading(true)

      // Burada gerçek bir optimizasyon işlemi yapılabilir
      // Örnek olarak, bir API endpoint'e istek gönderilebilir

      // Simüle edilmiş optimizasyon işlemi
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Başarılı",
        description: "Veritabanı optimizasyonu başarıyla tamamlandı",
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: `Veritabanı optimize edilirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Veritabanı Yönetimi</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Veritabanı Yedekleme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Veritabanınızın yedeğini alın ve güvenli bir şekilde saklayın.</p>

            {lastBackup && (
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Son yedekleme: {lastBackup}
              </div>
            )}

            <Button onClick={handleBackup} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Yedekleniyor...
                </>
              ) : (
                "Veritabanını Yedekle"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="mr-2 h-5 w-5" />
              Veritabanı Optimizasyonu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Veritabanı performansını artırmak için optimizasyon işlemi gerçekleştirin.
            </p>

            <div className="flex items-center text-sm text-amber-500 mb-4">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Bu işlem birkaç dakika sürebilir.
            </div>

            <Button onClick={handleOptimize} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Optimize Ediliyor...
                </>
              ) : (
                "Veritabanını Optimize Et"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
