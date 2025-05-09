import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "GÜN ÇEVİK Hukuk Bürosu | İzmir'de Uzman Avukatlık Hizmetleri",
    template: "%s | GÜN ÇEVİK Hukuk Bürosu",
  },
  description: "İzmir'de uzman hukuk danışmanlığı ve avukatlık hizmetleri.",
  keywords: [
    "avukat",
    "hukuk bürosu",
    "izmir avukat",
    "hukuk danışmanlığı",
    "ticaret hukuku",
    "sigorta hukuku",
    "iş hukuku",
  ],
  authors: [{ name: "GÜN ÇEVİK Hukuk Bürosu" }],
  creator: "GÜN ÇEVİK Hukuk Bürosu",
  publisher: "GÜN ÇEVİK Hukuk Bürosu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Suspense fallback={`Loading ...`}>{children}</Suspense>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
