import Head from "next/head"

interface MetaTagsProps {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  canonical?: string
}

export function MetaTags({
  title,
  description,
  keywords = [],
  ogImage = "/gc-law-logo.png",
  ogType = "website",
  canonical,
}: MetaTagsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://guncevik.av.tr"
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
    </Head>
  )
}
