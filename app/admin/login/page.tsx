"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Kullanıcı zaten giriş yapmış, admin kontrolü yap
          const { data, error } = await supabase
            .from("admin_profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (!error && data?.role === "admin") {
            // Admin kullanıcısı, dashboard'a yönlendir
            router.push("/admin/dashboard")
            return
          }
        }
      } catch (error) {
        console.error("Session kontrolü sırasında hata:", error)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("Giriş denemesi:", email)
      const supabase = getSupabaseClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Giriş hatası:", error.message)
        setError("Giriş başarısız: " + error.message)
        return
      }

      console.log("Kullanıcı girişi başarılı, admin kontrolü yapılıyor...")

      // Admin kontrolü
      const { data: adminData, error: adminError } = await supabase
        .from("admin_profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (adminError || adminData?.role !== "admin") {
        console.error("Admin kontrolü başarısız:", adminError || "Kullanıcı admin değil")
        setError("Bu hesap admin yetkisine sahip değil.")
        await supabase.auth.signOut()
        return
      }

      console.log("Admin girişi başarılı, yönlendiriliyor...")
      router.push("/admin/dashboard")
    } catch (err: any) {
      console.error("Beklenmeyen hata:", err)
      setError("Beklenmeyen bir hata oluştu: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-auto bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/gc-law-logo.png" alt="Logo" width={150} height={50} className="mx-auto" />
          <h1 className="mt-4 text-2xl font-bold">Admin Girişi</h1>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
