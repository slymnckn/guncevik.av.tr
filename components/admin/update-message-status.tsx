"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { updateMessageStatus } from "@/actions/admin"

interface UpdateMessageStatusProps {
  messageId: string
  currentStatus: string
}

export default function UpdateMessageStatus({ messageId, currentStatus }: UpdateMessageStatusProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (status === newStatus) return

    setIsUpdating(true)
    try {
      const result = await updateMessageStatus(messageId, newStatus)
      if (result.success) {
        setStatus(newStatus)
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      } else {
        console.error("Error updating status:", result.message)
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusLabel = (statusCode: string) => {
    switch (statusCode) {
      case "new":
        return "Yeni"
      case "in_progress":
        return "İşleme Alındı"
      case "completed":
        return "Tamamlandı"
      case "archived":
        return "Arşivlendi"
      default:
        return statusCode
    }
  }

  return (
    <div className="flex items-center">
      {showSuccess && (
        <div className="flex items-center text-green-600 mr-3">
          <Check className="h-4 w-4 mr-1" />
          <span className="text-sm">Güncellendi</span>
        </div>
      )}

      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="border rounded-md py-2 px-3 text-sm"
        disabled={isUpdating}
      >
        <option value="new">Yeni</option>
        <option value="in_progress">İşleme Alındı</option>
        <option value="completed">Tamamlandı</option>
        <option value="archived">Arşivlendi</option>
      </select>
    </div>
  )
}
