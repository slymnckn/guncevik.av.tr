"use server"

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
    console.log("Redis istemcisi başarıyla başlatıldı.")
  } else {
    console.warn(
      "Redis ortam değişkenleri (UPSTASH_REDIS_REST_URL veya UPSTASH_REDIS_REST_TOKEN) eksik. Redis önbellekleme devre dışı.",
    )
  }
} catch (error) {
  console.error("Redis bağlantı hatası:", error)
  redis = null // Hata durumunda redis'i null olarak ayarla
}

// Önbellek süresi (saniye)
const DEFAULT_CACHE_TIME = 60 * 60 * 24 // 24 saat

/**
 * Redis önbelleğinden veri getir (JSON parse edilir)
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    console.log(`[RedisCache] Redis bağlantısı yok, önbellekten okuma atlanıyor: ${key}`)
    return null
  }
  try {
    console.log(`[RedisCache] Attempting to get from cache: ${key}`)
    const raw = await redis.get<string>(key)
    if (typeof raw !== "string") {
      console.log(`[RedisCache] No data or invalid type in cache for key: ${key}`)
      return null
    }
    const parsedData = JSON.parse(raw) as T
    console.log(`[RedisCache] Successfully retrieved and parsed data for key: ${key}`)
    return parsedData
  } catch (error) {
    console.error(`[RedisCache] Redis cache read/JSON parse error (key: ${key}): ${error.message}`)
    try {
      await redis.del(key)
      console.log(`[RedisCache] Deleted corrupted Redis key: ${key}`)
    } catch (delError) {
      console.error("[RedisCache] Redis cache deletion error (after parse error):", delError)
    }
    return null
  }
}

/**
 * Redis önbelleğine veri kaydet (JSON.stringify edilir)
 */
export async function setCache<T>(key: string, data: T, expireIn: number = DEFAULT_CACHE_TIME): Promise<void> {
  if (!redis) {
    console.log(`[RedisCache] Redis bağlantısı yok, önbelleğe yazma atlanıyor: ${key}`)
    return
  }
  try {
    const payload = JSON.stringify(data)
    await redis.set(key, payload, { ex: expireIn })
    console.log(`[RedisCache] Successfully set cache for key: ${key}, expires in ${expireIn}s`)
  } catch (error) {
    console.error(`[RedisCache] Redis cache write/JSON stringify error (key: ${key}): ${error.message}`)
  }
}

/**
 * Redis önbelleğinden veri sil
 */
export async function invalidateCache(key: string): Promise<void> {
  if (!redis) {
    console.log(`Redis bağlantısı yok, önbellek silme atlanıyor: ${key}`)
    return
  }
  try {
    await redis.del(key)
    console.log(`Redis önbelleği silindi: ${key}`)
  } catch (error) {
    console.error(`Redis önbellek silme hatası (anahtar: ${key}):`, error)
  }
}

/**
 * Belirli bir önekle başlayan tüm anahtarları sil
 */
export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
  if (!redis) {
    console.log(`Redis bağlantısı yok, önbellek deseni silme atlanıyor: ${prefix}`)
    return
  }
  try {
    const keys = await redis.keys(`${prefix}:*`)
    if (keys.length > 0) {
      await redis.del(...keys)
      console.log(`Redis'ten ${keys.length} anahtar silindi (desen: ${prefix})`)
    } else {
      console.log(`Redis'te '${prefix}:*' deseniyle eşleşen anahtar bulunamadı.`)
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
    console.log(`[RedisCache] Cache hit for key: ${key}`)
    return cachedData
  }
  console.log(`[RedisCache] Cache miss for key: ${key}, fetching fresh data...`)
  try {
    const freshData = await fetchFn()
    await setCache(key, freshData, expireIn)
    console.log(`[RedisCache] Fresh data fetched and cached for key: ${key}`)
    return freshData
  } catch (error) {
    console.error(`[RedisCache] Error fetching fresh data for key: ${key}: ${error.message}`)
    // Hata durumunda, önbelleğe alınmamış olsa bile boş bir dizi döndürün
    // Bu, uygulamanın çökmesini engeller ve UI'ın boş veriyle render edilmesini sağlar.
    // Hatanın türüne göre daha spesifik bir fallback düşünebilirsiniz.
    return [] as T // Eğer T bir dizi ise, boş bir dizi döndürün.
  }
}

// Tüm önbelleği temizle
export async function invalidateAllCache() {
  if (!redis) {
    console.log("Redis bağlantısı yok, tüm önbelleği temizleme atlanıyor.")
    return false
  }
  try {
    await redis.flushall()
    console.log("Tüm Redis önbelleği temizlendi.")
    return true
  } catch (error) {
    console.error("Tüm önbelleği temizleme hatası:", error)
    return false
  }
}

// Yolu yeniden doğrula ve önbelleği temizle
export async function revalidateAndClearCache(path: string) {
  try {
    // Next.js önbelleğini temizle
    revalidatePath(path)
    console.log(`Next.js yolu yeniden doğrulandı: ${path}`)

    // Redis önbelleğini temizle (varsa)
    if (redis) {
      await invalidateAllCache()
    }

    return true
  } catch (error) {
    console.error(`Yeniden doğrulama hatası (${path}):`, error)
    return false
  }
}
