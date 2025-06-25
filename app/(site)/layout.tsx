import type React from "react"
import { SiteWrapper } from "@/components/site-wrapper"
import LoadingIndicator from "@/components/loading-indicator"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ThemeProvider } from "@/components/theme-provider"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SkipLink />
      <LoadingIndicator />
      <div id="main-content" className="min-h-screen flex flex-col">
        <SiteWrapper>{children}</SiteWrapper>
      </div>
      <ScrollToTop />
    </ThemeProvider>
  )
}
