"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function SkipLink() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "bg-primary text-white px-4 py-2 rounded-md focus:outline-none",
      )}
    >
      İçeriğe geç
    </a>
  )
}
