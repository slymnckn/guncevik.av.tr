"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Çıkış yapılırken bir hata oluştu")
      }

      toast({
        title: "Başarıyla çıkış yapıldı",
        description: "Yeniden giriş yapmak için login sayfasına yönlendiriliyorsunuz.",
      })

      // Kısa bir gecikme ekleyerek toast'un görünmesini sağlayalım
      setTimeout(() => {
        router.push("/admin/login")
      }, 1000)
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error)
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir sorun oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Çıkış Yapmak İstiyor musunuz?</DialogTitle>
          <DialogDescription>
            Çıkış yaptıktan sonra admin paneline erişmek için tekrar giriş yapmanız gerekecektir.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            İptal
          </Button>
          <Button variant="destructive" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function LogoutModalButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 w-full text-left rounded-md transition-colors text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-5 w-5" />
        <span>Çıkış Yap</span>
      </button>
      <LogoutModal open={open} onOpenChange={setOpen} />
    </>
  )
}
