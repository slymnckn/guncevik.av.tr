"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseClient } from "@/lib/supabase/client"

export function StatusUpdateForm({ messageId, currentStatus }: { messageId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const updateStatus = async () => {
    setIsUpdating(true)
    try {
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", messageId)

      if (error) {
        console.error("Error updating status:", error)
        return
      }

      router.refresh()
    } catch (err) {
      console.error("Exception updating status:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Durum Seçin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">Yeni</SelectItem>
          <SelectItem value="in_progress">İşleme Alındı</SelectItem>
          <SelectItem value="completed">Tamamlandı</SelectItem>
          <SelectItem value="archived">Arşivlendi</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={updateStatus} disabled={isUpdating || status === currentStatus} size="sm">
        <Check className="h-4 w-4 mr-1" />
        Güncelle
      </Button>
    </div>
  )
}

export function DeleteButton({ messageId }: { messageId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const deleteMessage = async () => {
    if (!window.confirm("Bu mesajı silmek istediğinizden emin misiniz?")) {
      return
    }

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", messageId)

      if (error) {
        console.error("Error deleting message:", error)
        return
      }

      router.push("/admin/messages")
    } catch (err) {
      console.error("Exception deleting message:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button onClick={deleteMessage} disabled={isDeleting} variant="destructive" size="sm">
      <Trash2 className="h-4 w-4 mr-1" />
      Sil
    </Button>
  )
}
