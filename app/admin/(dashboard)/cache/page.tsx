import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw, Database } from "lucide-react"
import Link from "next/link"

export default function CacheManagementPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Önbellek Yönetimi</h1>
      <p className="text-gray-500 mb-8">
        Önbellek, web sitenizin performansını artırmak için kullanılır. Ancak, içerik güncellemelerinin hemen görünmesi
        için bazen önbelleği temizlemeniz gerekebilir.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="h-5 w-5 mr-2" />
              Tüm Önbelleği Temizle
            </CardTitle>
            <CardDescription>Sitedeki tüm önbelleği temizler. Değişiklikler hemen görünür olacaktır.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/admin/cache/clear" method="POST">
              <input type="hidden" name="type" value="all" />
              <Button type="submit" className="w-full">
                Tüm Önbelleği Temizle
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Blog Önbelleğini Temizle
            </CardTitle>
            <CardDescription>Tüm blog yazıları, kategoriler ve etiketler için önbelleği temizler.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/admin/cache/clear" method="POST">
              <input type="hidden" name="type" value="blog" />
              <Button type="submit" className="w-full">
                Blog Önbelleğini Temizle
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Hizmet Önbelleğini Temizle
            </CardTitle>
            <CardDescription>Tüm hizmetler için önbelleği temizler.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/admin/cache/clear" method="POST">
              <input type="hidden" name="type" value="service" />
              <Button type="submit" className="w-full">
                Hizmet Önbelleğini Temizle
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Link href="/admin/dashboard">
          <Button variant="outline">Gösterge Paneline Dön</Button>
        </Link>
      </div>
    </div>
  )
}
