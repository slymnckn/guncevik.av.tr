"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

type ClearCacheButtonProps = {
  action: "all" | "blog" | "service"
  label: string
}

export function ClearCacheButton({ action, label }: ClearCacheButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/cache/clear?type=${action}`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Başarılı",
          description: data.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Hata",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Önbellek temizlenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} variant="destructive" className="w-full" disabled={isLoading}>
      <Trash2 className="mr-2 h-4 w-4" />
      {isLoading ? "İşleniyor..." : label}
    </Button>
  )
}
