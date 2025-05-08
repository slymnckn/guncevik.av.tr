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
  }
} catch (error) {
  console.error("Redis bağlantı hatası:", error)
}

// Önbellek süresi (saniye)
const DEFAULT_CACHE_TIME = 60 * 60 * 24 // 24 saat

/**
 * Redis önbelleğinden veri getir
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    if (!redis) return null
    const cachedData = await redis.get<T>(key)
    return cachedData
  } catch (error) {
    console.error("Redis önbellek okuma hatası:", error)
    return null
  }
}

/**
 * Redis önbelleğine veri kaydet
 */
export async function setCache<T>(key: string, data: T, expireIn: number = DEFAULT_CACHE_TIME): Promise<void> {
  try {
    if (!redis) return
    await redis.set(key, data, { ex: expireIn })
  } catch (error) {
    console.error("Redis önbellek yazma hatası:", error)
  }
}

/**
 * Redis önbelleğinden veri sil
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    if (!redis) return
    await redis.del(key)
  } catch (error) {
    console.error("Redis önbellek silme hatası:", error)
  }
}

/**
 * Belirli bir önekle başlayan tüm anahtarları sil
 */
export async function invalidateCacheByPrefix(prefix: string): Promise<void> {
  try {
    if (!redis) return
    const keys = await redis.keys(`${prefix}:*`)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error("Redis önbellek toplu silme hatası:", error)
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
  // Önbellekten veriyi almaya çalış
  const cachedData = await getFromCache<T>(key)

  // Eğer önbellekte varsa, onu döndür
  if (cachedData !== null) {
    return cachedData
  }

  // Yoksa, fonksiyonu çalıştır
  const freshData = await fetchFn()

  // Sonucu önbelleğe al
  await setCache(key, freshData, expireIn)

  // Sonucu döndür
  return freshData
}

// Tüm önbelleği temizle
export async function invalidateAllCache() {
  try {
    if (!redis) return false
    await redis.flushall()
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
