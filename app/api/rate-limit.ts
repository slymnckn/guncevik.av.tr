import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

// Redis istemcisi oluştur
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

// Rate limit ayarları
const RATE_LIMIT_REQUESTS = 10 // İzin verilen istek sayısı
const RATE_LIMIT_WINDOW = 60 // Saniye cinsinden pencere süresi

export async function rateLimit(req: NextRequest) {
  // IP adresi al
  const ip = req.headers.get("x-forwarded-for") || "anonymous"
  const key = `rate-limit:${ip}`

  // Mevcut istek sayısını al
  const currentRequests = await redis.get<number>(key)

  // İlk istek ise, sayacı başlat
  if (!currentRequests) {
    await redis.set(key, 1, { ex: RATE_LIMIT_WINDOW })
    return { success: true, remaining: RATE_LIMIT_REQUESTS - 1 }
  }

  // Limit aşıldı mı kontrol et
  if (currentRequests >= RATE_LIMIT_REQUESTS) {
    return { success: false, remaining: 0 }
  }

  // Sayacı artır
  await redis.incr(key)
  return { success: true, remaining: RATE_LIMIT_REQUESTS - (currentRequests + 1) }
}

// Rate limit middleware
export async function withRateLimit(req: NextRequest, handler: () => Promise<NextResponse>) {
  const { success, remaining } = await rateLimit(req)

  if (!success) {
    return new NextResponse(
      JSON.stringify({
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": RATE_LIMIT_REQUESTS.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": RATE_LIMIT_WINDOW.toString(),
        },
      },
    )
  }

  const response = await handler()

  // Rate limit bilgilerini yanıta ekle
  response.headers.set("X-RateLimit-Limit", RATE_LIMIT_REQUESTS.toString())
  response.headers.set("X-RateLimit-Remaining", remaining.toString())
  response.headers.set("X-RateLimit-Reset", RATE_LIMIT_WINDOW.toString())

  return response
}
