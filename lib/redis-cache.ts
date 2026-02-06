import { Redis } from "@upstash/redis"
import { revalidatePath } from "next/cache"

// Redis istemcisini oluştur
let redis: Redis | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  } else {
    console.warn(
      "Redis ortam değişkenleri eksik. Redis önbellekleme devre dışı.",
    )
  }
} catch (error) {
  console.error("Redis bağlantı hatası:", error)
  redis = null
}

// Önbellek süresi (saniye)
const DEFAULT_CACHE_TIME = 60 * 60 * 24 // 24 saat

/**
 * Redis önbelleğinden veri getir (JSON parse edilir)
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    return null
  }
  try {
    const raw = await redis.get(key)

    if (!raw) {
      return null
    }

    let parsedData: T
    if (typeof raw === "string") {
      parsedData = JSON.parse(raw) as T
    } else if (typeof raw === "object" && raw !== null) {
      parsedData = raw as T
    } else {
      return null
    }

    return parsedData
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[RedisCache] Cache read error (key: ${key}): ${message}`)
    try {
      await redis.del(key)
    } catch (delError) {
      console.error("[RedisCache] Cache deletion error:", delError)
    }
    return null
  }
}

/**
 * Redis önbelleğine veri kaydet (JSON.stringify edilir)
 */
export async function setCache<T>(key: string, data: T, expireIn: number = DEFAULT_CACHE_TIME): Promise<void> {
  if (!redis) {
    return
  }
  try {
    const payload = JSON.stringify(data)
    await redis.set(key, payload, { ex: expireIn })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[RedisCache] Cache write error (key: ${key}): ${message}`)
  }
}

/**
 * Redis önbelleğinden veri sil
 */
export async function invalidateCache(key: string): Promise<void> {
  if (!redis) {
    return
  }
  try {
    await redis.del(key)
  } catch (error) {
    console.error(`Redis önbellek silme hatası (anahtar: ${key}):`, error)
  }
}

/**
 * Belirli bir önekle başlayan tüm anahtarları sil
 */
export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
  if (!redis) {
    return
  }
  try {
    const keys = await redis.keys(`${prefix}:*`)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error(`Redis önbellek toplu silme hatası (desen: ${prefix}):`, error)
  }
}

/**
 * Önbellekten getir veya fonksiyonu çalıştır ve sonucu önbelleğe al
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  expireIn: number = DEFAULT_CACHE_TIME,
): Promise<T> {
  const cachedData = await getFromCache<T>(key)
  if (cachedData !== null) {
    return cachedData
  }
  try {
    const freshData = await fetchFn()
    await setCache(key, freshData, expireIn)
    return freshData
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[RedisCache] Error fetching data for key ${key}: ${message}`)
    throw error
  }
}

// Tüm önbelleği temizle
export async function invalidateAllCache() {
  if (!redis) {
    return false
  }
  try {
    await redis.flushall()
    return true
  } catch (error) {
    console.error("Tüm önbelleği temizleme hatası:", error)
    return false
  }
}

// Yolu yeniden doğrula ve ilgili önbelleği temizle
export async function revalidateAndClearCache(path: string) {
  try {
    revalidatePath(path)

    // Sadece ilgili önbellek anahtarlarını temizle (tümünü değil)
    if (redis) {
      const pathKey = path.replace(/\//g, "-").replace(/^-/, "")
      await invalidateCacheByPrefix(pathKey)
    }

    return true
  } catch (error) {
    console.error(`Yeniden doğrulama hatası (${path}):`, error)
    return false
  }
}
