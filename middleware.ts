import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Sadece güvenlik başlıklarını ekle, auth kontrolü yapma
  const res = NextResponse.next()

  // Güvenlik başlıklarını ekle
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-XSS-Protection", "1; mode=block")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return res
}

// Middleware'in çalışacağı path'leri belirt
export const config = {
  matcher: [
    // Sadece API olmayan rotalar için çalıştır
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
