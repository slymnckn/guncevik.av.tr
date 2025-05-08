"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  style?: React.CSSProperties
}

// Default export'u named export olarak da ekleyelim
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  quality = 80,
  placeholder = "empty",
  blurDataURL,
  style,
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Görüntü yükleme durumunu izle
  const handleLoad = () => {
    setLoading(false)
  }

  // Görüntü yükleme hatası durumunu izle
  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  // Görüntü URL'sini kontrol et
  const imageSrc = src.startsWith("http") || src.startsWith("/") ? src : `/${src}`

  // Görüntü boyutlarını kontrol et
  const imageWidth = width || (fill ? undefined : 800)
  const imageHeight = height || (fill ? undefined : 600)

  // Görüntü yükleme durumuna göre sınıf adlarını ayarla
  const imageClasses = `
    ${className}
    ${loading ? "animate-pulse bg-gray-200" : ""}
    ${error ? "bg-gray-200" : ""}
    transition-opacity duration-300
    ${loading || error ? "opacity-50" : "opacity-100"}
  `

  // Hata durumunda yedek görüntü göster
  if (error) {
    return (
      <div
        className={`${imageClasses} flex items-center justify-center`}
        style={{
          width: imageWidth,
          height: imageHeight,
          ...style,
        }}
      >
        <span className="text-gray-500 text-sm">Görüntü yüklenemedi</span>
      </div>
    )
  }

  return (
    <Image
      src={imageSrc || "/placeholder.svg"}
      alt={alt}
      width={imageWidth}
      height={imageHeight}
      className={imageClasses}
      priority={priority}
      sizes={sizes}
      fill={fill}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onLoad={handleLoad}
      onError={handleError}
      style={style}
    />
  )
}

// Default export'u da koruyalım
export default OptimizedImage
