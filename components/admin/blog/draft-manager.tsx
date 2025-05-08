"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Save } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

interface DraftManagerProps {
  formId: string
  draftKey: string
  onLoadDraft: (data: any) => void
  currentData: any
}

export function DraftManager({ formId, draftKey, onLoadDraft, currentData }: DraftManagerProps) {
  const [hasDraft, setHasDraft] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const { toast } = useToast()

  // Taslak kontrolü
  useEffect(() => {
    const checkDraft = () => {
      try {
        const draft = localStorage.getItem(`draft_${draftKey}`)
        if (draft) {
          const { data, timestamp } = JSON.parse(draft)
          setHasDraft(true)
          setLastSaved(timestamp)
        } else {
          setHasDraft(false)
          setLastSaved(null)
        }
      } catch (error) {
        console.error("Taslak kontrolü sırasında hata:", error)
        setHasDraft(false)
      }
    }

    checkDraft()

    // Otomatik kaydetme
    const interval = setInterval(() => {
      saveDraft()
    }, 60000) // 1 dakika

    return () => clearInterval(interval)
  }, [draftKey, currentData])

  // Taslak kaydetme
  const saveDraft = () => {
    try {
      const timestamp = new Date().toISOString()
      localStorage.setItem(
        `draft_${draftKey}`,
        JSON.stringify({
          data: currentData,
          timestamp,
        }),
      )
      setHasDraft(true)
      setLastSaved(timestamp)

      toast({
        title: "Taslak kaydedildi",
        description: "İçerik otomatik olarak taslak olarak kaydedildi.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Taslak kaydetme sırasında hata:", error)
      toast({
        title: "Hata",
        description: "Taslak kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  // Taslak yükleme
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem(`draft_${draftKey}`)
      if (draft) {
        const { data } = JSON.parse(draft)
        onLoadDraft(data)

        toast({
          title: "Taslak yüklendi",
          description: "Kaydedilmiş taslak başarıyla yüklendi.",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Taslak yükleme sırasında hata:", error)
      toast({
        title: "Hata",
        description: "Taslak yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  // Taslak silme
  const clearDraft = () => {
    try {
      localStorage.removeItem(`draft_${draftKey}`)
      setHasDraft(false)
      setLastSaved(null)

      toast({
        title: "Taslak silindi",
        description: "Kaydedilmiş taslak başarıyla silindi.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Taslak silme sırasında hata:", error)
    }
  }

  if (!hasDraft) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-blue-800">Kaydedilmemiş değişiklikler</h3>
          <p className="text-sm text-blue-600 mt-1">{lastSaved && `Son kayıt: ${formatDateTime(lastSaved)}`}</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={loadDraft}>
              Taslağı Yükle
            </Button>
            <Button size="sm" variant="ghost" onClick={clearDraft}>
              Taslağı Sil
            </Button>
            <Button size="sm" variant="default" onClick={saveDraft} className="ml-auto">
              <Save className="h-4 w-4 mr-1" />
              Şimdi Kaydet
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
