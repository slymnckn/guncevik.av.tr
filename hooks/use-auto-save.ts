"use client"

import { useState, useEffect, useRef } from "react"

interface AutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  interval?: number
  key?: string
}

export function useAutoSave<T>({ data, onSave, interval = 30000, key }: AutoSaveOptions<T>) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const previousDataRef = useRef<T>(data)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Veriyi localStorage'a kaydet
  useEffect(() => {
    if (key) {
      try {
        localStorage.setItem(`autosave_${key}`, JSON.stringify(data))
      } catch (err) {
        console.error("Otomatik kaydetme için localStorage hatası:", err)
      }
    }
  }, [data, key])

  // Otomatik kaydetme
  useEffect(() => {
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current)

    const save = async () => {
      if (hasChanged) {
        setIsSaving(true)
        setError(null)

        try {
          await onSave(data)
          setLastSaved(new Date())
          previousDataRef.current = data
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Kaydetme sırasında bir hata oluştu"))
          console.error("Otomatik kaydetme hatası:", err)
        } finally {
          setIsSaving(false)
        }
      }
    }

    // Zamanlayıcıyı temizle ve yeniden başlat
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(save, interval)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, interval, onSave])

  // Manuel kaydetme fonksiyonu
  const saveNow = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsSaving(true)
    setError(null)

    try {
      await onSave(data)
      setLastSaved(new Date())
      previousDataRef.current = data
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Kaydetme sırasında bir hata oluştu"))
      console.error("Manuel kaydetme hatası:", err)
    } finally {
      setIsSaving(false)
    }
  }

  // localStorage'dan taslak yükleme
  const loadDraft = (): T | null => {
    if (!key) return null

    try {
      const saved = localStorage.getItem(`autosave_${key}`)
      return saved ? JSON.parse(saved) : null
    } catch (err) {
      console.error("Taslak yükleme hatası:", err)
      return null
    }
  }

  // Taslağı temizleme
  const clearDraft = () => {
    if (!key) return

    try {
      localStorage.removeItem(`autosave_${key}`)
    } catch (err) {
      console.error("Taslak temizleme hatası:", err)
    }
  }

  return { lastSaved, isSaving, error, saveNow, loadDraft, clearDraft }
}
