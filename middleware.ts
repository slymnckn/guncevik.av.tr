import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()

  // Güvenlik başlıklarını ekle
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  )
  res.headers.set("X-DNS-Prefetch-Control", "on")
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  )

  return res
}

// Middleware'in çalışacağı path'leri belirt
export const config = {
  matcher: [
    // Sadece API olmayan rotalar için çalıştır
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
