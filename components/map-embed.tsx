interface MapEmbedProps {
  address: string
  height?: string
  width?: string
  zoom?: number
}

export default function MapEmbed({ address, height = "400px", width = "100%", zoom = 15 }: MapEmbedProps) {
  // Adresi URL-safe formata dönüştür
  const encodedAddress = encodeURIComponent(address)

  return (
    <div className="map-container rounded-lg overflow-hidden shadow-md">
      <iframe
        src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${address} konumu`}
        className="w-full h-full"
      ></iframe>
    </div>
  )
}
