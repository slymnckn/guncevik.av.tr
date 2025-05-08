"use client"

import { useEffect } from "react"

export function SpeedInsights() {
  useEffect(() => {
    // Speed Insights'ı yalnızca tarayıcı ortamında yükle
    if (typeof window !== "undefined") {
      const script = document.createElement("script")
      script.src = "https://va.vercel-scripts.com/v1/speed-insights/script.js"
      script.defer = true
      script.async = true
      document.body.appendChild(script)

      return () => {
        // Temizleme işlemi
        document.body.removeChild(script)
      }
    }
  }, [])

  return null
}
