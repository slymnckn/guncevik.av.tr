"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, FileText, Home, Mail, BriefcaseBusiness, ChevronDown, ChevronRight, LogOut, X } from "lucide-react"
import { useState } from "react"
import LogoutModal from "./logout-modal"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  onLinkClick?: () => void
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    blog: false, // Blog menüsü varsayılan olarak kapalı
  })
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick()
    }
  }

  return (
    <div className="h-full py-4 flex flex-col">
      <div className="px-4 mb-6 flex items-center justify-between">
        <Link href="/admin/dashboard" onClick={handleLinkClick} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">GÇ</div>
          <span className="text-lg font-semibold">Admin Panel</span>
        </Link>

        {/* Mobil görünümde kapatma butonu */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={handleLinkClick} aria-label="Menüyü kapat">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="space-y-1 px-2 flex-1 overflow-y-auto">
        <Link
          href="/admin/dashboard"
          className={`flex items-center space-x-2 px-3 py-3 rounded-md transition-colors ${
            isActive("/admin/dashboard") ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={handleLinkClick}
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/admin/messages"
          className={`flex items-center space-x-2 px-3 py-3 rounded-md transition-colors ${
            isActive("/admin/messages") ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={handleLinkClick}
        >
          <Mail className="h-5 w-5 flex-shrink-0" />
          <span>Mesajlar</span>
        </Link>

        <Link
          href="/admin/appointments"
          className={`flex items-center space-x-2 px-3 py-3 rounded-md transition-colors ${
            isActive("/admin/appointments")
              ? "bg-primary/10 text-primary font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={handleLinkClick}
        >
          <Calendar className="h-5 w-5 flex-shrink-0" />
          <span>Randevular</span>
        </Link>

        <Link
          href="/admin/services"
          className={`flex items-center space-x-2 px-3 py-3 rounded-md transition-colors ${
            isActive("/admin/services") ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={handleLinkClick}
        >
          <BriefcaseBusiness className="h-5 w-5 flex-shrink-0" />
          <span>Hizmetler</span>
        </Link>

        <div className="py-1">
          <button
            onClick={() => toggleMenu("blog")}
            className={`flex items-center justify-between w-full px-3 py-3 rounded-md transition-colors ${
              isActive("/admin/blog") ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 flex-shrink-0" />
              <span>Blog</span>
            </div>
            {openMenus.blog ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {openMenus.blog && (
            <div className="mt-1 ml-6 space-y-1">
              <Link
                href="/admin/blog"
                className={`block px-3 py-2 text-sm rounded-md ${
                  pathname === "/admin/blog"
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={handleLinkClick}
              >
                Tüm Yazılar
              </Link>
              <Link
                href="/admin/blog/new"
                className={`block px-3 py-2 text-sm rounded-md ${
                  pathname === "/admin/blog/new"
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={handleLinkClick}
              >
                Yeni Yazı
              </Link>
              <Link
                href="/admin/blog/categories"
                className={`block px-3 py-2 text-sm rounded-md ${
                  isActive("/admin/blog/categories")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={handleLinkClick}
              >
                Kategoriler
              </Link>
              <Link
                href="/admin/blog/tags"
                className={`block px-3 py-2 text-sm rounded-md ${
                  isActive("/admin/blog/tags")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={handleLinkClick}
              >
                Etiketler
              </Link>
              <Link
                href="/admin/blog/comments"
                className={`block px-3 py-2 text-sm rounded-md ${
                  isActive("/admin/blog/comments")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={handleLinkClick}
              >
                Yorumlar
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Çıkış Yap Butonu - Sidebar'ın alt kısmında */}
      <div className="mt-auto px-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center space-x-2 w-full px-3 py-3 rounded-md transition-colors text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Çıkış Yap</span>
        </button>
      </div>

      {/* Çıkış Yap Modal */}
      <LogoutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
    </div>
  )
}
