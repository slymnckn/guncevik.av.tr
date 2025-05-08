"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from "@/actions/auth-actions"
import { getUserProfile } from "@/actions/profile-actions"

// Header bileşeninde hata ayıklama ekleyelim
export default function Header({ userId }: { userId: string }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        if (userId) {
          console.log("Profil yükleniyor, userId:", userId)
          const data = await getUserProfile(userId)
          console.log("Alınan profil verisi:", data)
          setProfile(data)
        }
      } catch (error) {
        console.error("Profil yüklenirken hata:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2 lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                  GÇ
                </span>
                <span>Admin Panel</span>
              </Link>
              <Link
                href="/admin/dashboard"
                className={`rounded-md px-3 py-2 hover:bg-accent ${pathname === "/admin/dashboard" ? "bg-accent" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/messages"
                className={`rounded-md px-3 py-2 hover:bg-accent ${pathname === "/admin/messages" ? "bg-accent" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mesajlar
              </Link>
              <Link
                href="/admin/appointments"
                className={`rounded-md px-3 py-2 hover:bg-accent ${
                  pathname === "/admin/appointments" ? "bg-accent" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Randevular
              </Link>
              <Link
                href="/admin/blog"
                className={`rounded-md px-3 py-2 hover:bg-accent ${
                  pathname?.startsWith("/admin/blog") ? "bg-accent" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/admin/users"
                className={`rounded-md px-3 py-2 hover:bg-accent ${pathname === "/admin/users" ? "bg-accent" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kullanıcılar
              </Link>
              <Link
                href="/admin/settings"
                className={`rounded-md px-3 py-2 hover:bg-accent ${pathname === "/admin/settings" ? "bg-accent" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ayarlar
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="search" placeholder="Ara..." className="h-9 md:w-[300px] lg:w-[400px]" />
        <Button type="submit" size="icon" className="h-9 w-9">
          <Search className="h-4 w-4" />
          <span className="sr-only">Ara</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Bildirimler</span>
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            5
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              {!isLoading && (
                <>
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt="Profil fotoğrafı"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-medium text-muted-foreground">
                        {profile?.name ? profile.name.charAt(0).toUpperCase() : "K"}
                      </span>
                    </div>
                  )}
                </>
              )}
              <span className="sr-only">Profil menüsü</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">Ayarlar</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signOut}>
                <button type="submit" className="w-full text-left">
                  Çıkış Yap
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
