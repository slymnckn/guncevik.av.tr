"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutModal } from "./logout-modal"
import { getSupabaseClient } from "@/lib/supabase/client"

interface HeaderProps {
  userId?: string
}

export default function Header({ userId }: HeaderProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return

      try {
        setIsLoading(true)
        const supabase = getSupabaseClient()

        const { data, error } = await supabase.from("admin_profiles").select("*").eq("id", userId).single()

        if (error) {
          console.error("Profil getirme hatası:", error.message)
        } else {
          console.log("Header'da getirilen profil:", data)
          setProfile(data)
        }
      } catch (error) {
        console.error("Profil getirme exception:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  // Kullanıcı adının baş harflerini al
  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U"
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ara..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Bildirimler</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Yeni bir bildiriminiz yok</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.name || "Kullanıcı"} />
              <AvatarFallback>{getInitials(profile?.name || "")}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Profil</span>
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
          <DropdownMenuItem onClick={() => setIsLogoutModalOpen(true)}>Çıkış Yap</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </header>
  )
}

export { Header }
