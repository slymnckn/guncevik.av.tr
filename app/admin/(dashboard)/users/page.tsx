import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import UsersClientPage from "./UsersClientPage"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kullanıcılar</h1>
          <p className="text-muted-foreground">Sistem kullanıcılarını yönetin</p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Yeni Kullanıcı
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar</CardTitle>
          <CardDescription>Tüm sistem kullanıcıları</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<UsersTableSkeleton />}>
            <UsersClientPage />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-[250px]" />
      </div>
      <div className="rounded-md border">
        <div className="h-12 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-[250px]" />
          </div>
        </div>
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="h-16 border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
