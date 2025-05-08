"use client"

import { useEffect, useRef } from "react"

interface MapProps {
  address: string
  height?: string
  width?: string
  zoom?: number
}

declare global {
  interface Window {
    initMap: () => void
    google: any
  }
}

export default function Map({ address, height = "400px", width = "100%", zoom = 15 }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInitializedRef = useRef(false)

  useEffect(() => {
    // Google Maps API'yi yükle
    if (!mapInitializedRef.current && mapRef.current) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=&callback=initMap`
      script.async = true
      script.defer = true

      // Global callback fonksiyonu
      window.initMap = () => {
        if (!mapRef.current) return

        // Geocoder kullanarak adresi koordinatlara çevir
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const map = new window.google.maps.Map(mapRef.current, {
              center: results[0].geometry.location,
              zoom: zoom,
            })

            // Marker ekle
            new window.google.maps.Marker({
              map,
              position: results[0].geometry.location,
              title: address,
            })
          } else {
            console.error("Geocode was not successful for the following reason:", status)
            // Hata durumunda varsayılan konum (İzmir)
            const defaultLocation = { lat: 38.4192, lng: 27.1287 }
            const map = new window.google.maps.Map(mapRef.current, {
              center: defaultLocation,
              zoom: zoom,
            })

            new window.google.maps.Marker({
              map,
              position: defaultLocation,
              title: "İzmir",
            })
          }
        })
      }

      document.head.appendChild(script)
      mapInitializedRef.current = true
    }

    return () => {
      // Temizleme işlemi
      delete window.initMap
    }
  }, [address, zoom])

  return (
    <div className="map-container rounded-lg overflow-hidden shadow-md">
      <div ref={mapRef} style={{ height, width }} className="google-map"></div>
    </div>
  )
}
