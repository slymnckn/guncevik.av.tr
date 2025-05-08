"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function AdminRedirect() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        // Oturum kontrolü
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          // Oturum varsa dashboard'a yönlendir
          router.push("/admin/dashboard")
        } else {
          // Oturum yoksa login sayfasına yönlendir
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Yönlendirme hatası:", error)
        router.push("/admin/login")
      }
    }

    checkAndRedirect()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Yönlendiriliyor...</p>
      </div>
    </div>
  )
}
