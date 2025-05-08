"use client"

interface EventOptions {
  category: string
  label?: string
  value?: number
  nonInteraction?: boolean
  [key: string]: any
}

// Google Analytics entegrasyonu domain geçişinden sonra yapılacak
// Şimdilik boş fonksiyonlar döndürüyoruz
export function useAnalytics() {
  const trackEvent = (action: string, options: EventOptions) => {
    // Domain geçişinden sonra implement edilecek
    console.log("Analytics event:", action, options)
  }

  const trackConversion = (conversionId: string, label: string, value?: number) => {
    // Domain geçişinden sonra implement edilecek
    console.log("Conversion tracking:", conversionId, label, value)
  }

  const setUserProperty = (name: string, value: string) => {
    // Domain geçişinden sonra implement edilecek
    console.log("User property:", name, value)
  }

  return {
    trackEvent,
    trackConversion,
    setUserProperty,
  }
}
