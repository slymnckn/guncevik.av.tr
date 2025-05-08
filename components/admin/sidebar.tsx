"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, LayoutDashboard, MessageSquare, Settings, Users, Calendar, Palette, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogoutModal } from "./logout-modal"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <div className={cn("flex flex-col h-screen border-r bg-background", className)}>
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold">Günçevik</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/admin"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/appointments"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/admin/appointments" || pathname.startsWith("/admin/appointments/")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Calendar className="h-4 w-4" />
            Randevular
          </Link>
          <Link
            href="/admin/blog"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/admin/blog" || pathname.startsWith("/admin/blog/")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <FileText className="h-4 w-4" />
            Blog
          </Link>
          <Link
            href="/admin/messages"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/admin/messages" || pathname.startsWith("/admin/messages/")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Mesajlar
          </Link>
          <Link
            href="/admin/users"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/admin/users" || pathname.startsWith("/admin/users/")
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Users className="h-4 w-4" />
            Kullanıcılar
          </Link>
          <Link
            href="/admin/site-settings"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/admin/site-settings"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Palette className="h-4 w-4" />
            Site Ayarları
          </Link>
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === "/admin/settings"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Settings className="h-4 w-4" />
            Ayarlar
          </Link>
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <Button variant="destructive" className="w-full justify-start" onClick={() => setShowLogoutModal(true)}>
          <LogOut className="mr-2 h-4 w-4" />
          Çıkış Yap
        </Button>
      </div>

      <LogoutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
    </div>
  )
}

export default Sidebar
