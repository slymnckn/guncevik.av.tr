"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Sidebar from "@/components/admin/sidebar"
import { Loader2 } from "lucide-react"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    setIsMounted(true)

    const checkSession = async () => {
      try {
        // Login sayfasındaysa session kontrolü yapmaya gerek yok
        if (pathname === "/admin/login") {
          setIsLoading(false)
          return
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Oturum kontrolü sırasında hata:", error)
          if (isMounted && pathname !== "/admin/login") {
            console.log("Oturum hatası, login sayfasına yönlendiriliyor...")
            router.push("/admin/login")
          }
          return
        }

        if (!session && isMounted && pathname !== "/admin/login") {
          console.log("Oturum bulunamadı, login sayfasına yönlendiriliyor...")
          router.push("/admin/login")
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Beklenmeyen hata:", error)
        if (isMounted && pathname !== "/admin/login") {
          router.push("/admin/login")
        }
      }
    }

    checkSession()

    return () => {
      setIsMounted(false)
    }
  }, [router, pathname, supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 h-screen fixed left-0 top-0 overflow-y-auto bg-white border-r border-gray-200">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1 p-6 overflow-auto">{children}</div>
    </div>
  )
}
