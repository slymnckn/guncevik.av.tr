import Script from "next/script"

interface LawFirmSchemaProps {
  name: string
  description: string
  url: string
  logo: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  telephone: string
  email: string
  sameAs?: string[]
  openingHours?: string[]
  geo?: {
    latitude: number
    longitude: number
  }
}

export function LawFirmSchema({
  name,
  description,
  url,
  logo,
  address,
  telephone,
  email,
  sameAs = [],
  openingHours = ["Mo-Fr 09:00-18:00"],
  geo,
}: LawFirmSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name,
    description,
    url,
    logo,
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    telephone,
    email,
    sameAs,
    openingHoursSpecification: openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.split(" ")[0],
      opens: hours.split(" ")[1].split("-")[0],
      closes: hours.split(" ")[1].split("-")[1],
    })),
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
  }

  return (
    <Script id="law-firm-schema" type="application/ld+json">
      {JSON.stringify(schema)}
    </Script>
  )
}
