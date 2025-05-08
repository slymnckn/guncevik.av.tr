"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Sidebar from "@/components/admin/sidebar"
import { Loader2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const supabase = createClientComponentClient()

  // Ekran genişliğini takip etmek için
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      // Masaüstü genişliğinde sidebar'ı otomatik aç
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    // İlk yükleme
    checkMobile()

    // Ekran boyutu değiştiğinde kontrol et
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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

  // Mobil cihazlarda sidebar'ı kapatmak için
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  // Mobil cihazlarda sayfa değiştiğinde sidebar'ı kapat
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobil menü butonu */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center p-4 border-b bg-white shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Menüyü kapat" : "Menüyü aç"}
          className="mr-2"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="font-semibold">Admin Panel</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0
            fixed lg:relative top-0 left-0 z-40 h-full w-[280px] 
            transition-transform duration-300 ease-in-out
            bg-white border-r border-gray-200 overflow-y-auto
            lg:block
          `}
        >
          <Sidebar onLinkClick={closeSidebar} />
        </div>

        {/* Overlay - Mobil görünümde sidebar açıkken arka planı karartır */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Ana içerik */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="container mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
