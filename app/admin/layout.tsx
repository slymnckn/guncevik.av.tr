import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin Panel | GÜN ÇEVİK Hukuk Bürosu",
  description: "GÜN ÇEVİK Hukuk Bürosu yönetim paneli",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={`${inter.className} bg-gray-50 min-h-screen`}>{children}</div>
}
