"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { User } from "@supabase/auth-helpers-nextjs"
import type { AdminProfile } from "@/lib/types/admin"

type AdminContextType = {
  user: User | null
  profile: AdminProfile | null
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  profile: null,
})

export function AdminProvider({
  children,
  user,
  profile,
}: {
  children: ReactNode
  user: User
  profile: AdminProfile
}) {
  return <AdminContext.Provider value={{ user, profile }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  return useContext(AdminContext)
}
