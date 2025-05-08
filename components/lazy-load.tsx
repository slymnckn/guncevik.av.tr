"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"

interface LazyLoadProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  placeholder?: React.ReactNode
  className?: string
}

export default function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = "0px",
  placeholder = <div className="animate-pulse bg-gray-200 h-40 w-full rounded-md" />,
  className = "",
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    const currentRef = ref.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  useEffect(() => {
    if (isVisible) {
      // İçerik görünür olduktan sonra yükleme durumunu güncelle
      const timer = setTimeout(() => {
        setHasLoaded(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <div className={`transition-opacity duration-500 ${hasLoaded ? "opacity-100" : "opacity-0"}`}>{children}</div>
      ) : (
        placeholder
      )}
    </div>
  )
}
