"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchForm } from "@/components/search/search-form"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "Hizmetlerimiz", href: "/hizmetlerimiz" },
    { name: "Makaleler", href: "/makaleler" },
    { name: "S.S.S.", href: "/sss" },
    { name: "İletişim", href: "/iletisim" },
  ]

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white shadow-md py-2 dark:bg-gray-900"
          : "bg-white/80 backdrop-blur-sm py-4 dark:bg-gray-900/80"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-gc.png"
              alt="GÜN ÇEVİK Hukuk Bürosu"
              width={120}
              height={120}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-primary font-semibold"
                    : "text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-2 dark:hover:bg-gray-800"
                aria-label="Arama"
              >
                <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
              <Button asChild className="ml-2">
                <Link href="/randevu">Randevu Al</Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2 dark:hover:bg-gray-800"
              aria-label="Arama"
            >
              <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menü">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Image
                      src="/logo-gc.png"
                      alt="GÜN ÇEVİK Hukuk Bürosu"
                      width={100}
                      height={100}
                      className="h-14 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        pathname === item.href
                          ? "text-primary font-semibold"
                          : "text-gray-700 hover:text-primary dark:text-gray-300"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button asChild className="w-full">
                      <Link href="/randevu">Randevu Al</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Arama Formu */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 dark:bg-gray-900 dark:border-gray-700">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium dark:text-white">Site İçi Arama</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Aramayı kapat"
              >
                <X className="h-5 w-5 dark:text-gray-300" />
              </button>
            </div>
            <SearchForm variant="minimal" />
          </div>
        </div>
      )}
    </header>
  )
}
