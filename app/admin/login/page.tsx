"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("Giriş denemesi:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      console.log("Kullanıcı girişi başarılı, admin kontrolü yapılıyor...")

      // Admin kontrolü
      const { data: profile, error: profileError } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile) {
        throw new Error("Admin yetkisi bulunamadı")
      }

      console.log("Admin girişi başarılı, yönlendiriliyor...")
      router.push("/admin/dashboard")
    } catch (error: any) {
      console.error("Giriş hatası:", error.message)
      setError(error.message || "Giriş yapılırken bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex items-center justify-center">
            <Image src="/gc-law-logo-transparent.png" alt="Günçevik Hukuk Bürosu" width={150} height={150} priority />
          </div>
          <h1 className="text-2xl font-bold">Günçevik Hukuk Bürosu</h1>
          <p className="text-gray-600">Admin Paneli</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifreniz"
                required
              />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Giriş Yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
