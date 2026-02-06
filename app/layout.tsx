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
    default: "Gün Çevik Hukuk | Ceza, Aile, İş ve Gayrimenkul Hukuku Uzmanı",
    template: "%s | GÜN ÇEVİK Hukuk Bürosu",
  },
  description: "Gün Çevik Hukuk Bürosu olarak İzmir'de ceza, aile, iş ve gayrimenkul hukuku alanlarında uzman avukatlarımızla profesyonel hukuki danışmanlık ve dava desteği sunuyoruz.",
  keywords: [
    "avukat",
    "hukuk bürosu",
    "izmir avukat",
    "hukuk danışmanlığı",
    "ticaret hukuku",
    "sigorta hukuku",
    "iş hukuku",
  ],
  authors: [{ name: "Av. İrfan Çevik" }],
  creator: "Av. İrfan Çevik",
  publisher: "Av. İrfan Çevik",
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
    generator: 'broosmedia.com'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
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
