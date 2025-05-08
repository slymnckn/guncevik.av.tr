import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Sidebar from "@/components/admin/sidebar"
import Header from "@/components/admin/header"
import { getCurrentUser } from "@/actions/auth-actions"

export const metadata: Metadata = {
  title: "Admin Panel - Günçevik Hukuk Bürosu",
  description: "Günçevik Hukuk Bürosu admin paneli",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <Header userId={user.id} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
