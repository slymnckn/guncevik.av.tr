import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog Yorumları",
  description: "Blog yorumlarını yönetin",
}

export default function CommentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
