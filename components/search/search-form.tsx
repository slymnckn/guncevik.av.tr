"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFormProps {
  initialQuery?: string
  initialType?: string
  className?: string
  variant?: "default" | "minimal"
}

export function SearchForm({
  initialQuery = "",
  initialType = "all",
  className = "",
  variant = "default",
}: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(initialType)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    startTransition(() => {
      const params = new URLSearchParams()
      params.set("q", query)
      if (type !== "all") {
        params.set("type", type)
      }
      router.push(`/arama?${params.toString()}`)
    })
  }

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
        <Input
          type="search"
          placeholder="Arama yapın..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
          disabled={isPending}
        >
          {isPending ? "Aranıyor..." : "Ara"}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative flex-grow">
        <Input
          type="search"
          placeholder="Arama yapın..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 py-6 rounded-lg border-none text-gray-800 shadow-lg w-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>

      <div className="flex gap-2">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[140px] bg-white border-none shadow-lg">
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="blog">Makaleler</SelectItem>
            <SelectItem value="service">Hizmetler</SelectItem>
            <SelectItem value="faq">SSS</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="submit"
          className="px-6 py-2 h-[42px] bg-primary text-white hover:bg-primary/90"
          disabled={isPending}
        >
          {isPending ? "Aranıyor..." : "Ara"}
        </Button>
      </div>
    </form>
  )
}
