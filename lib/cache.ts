import { Redis } from "@upstash/redis"

// Redis istemcisi oluştur
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

// Önbellek anahtarı oluştur
export function createCacheKey(prefix: string, params: Record<string, any> = {}): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = params[key]
        return acc
      },
      {} as Record<string, any>,
    )

  const paramsString = Object.keys(sortedParams).length ? `-${JSON.stringify(sortedParams)}` : ""

  return `${prefix}${paramsString}`
}

// Veriyi önbellekten getir
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 3600, // Varsayılan TTL: 1 saat
): Promise<T> {
  try {
    // Önbellekten veriyi kontrol et
    const cachedData = await redis.get<T>(key)

    if (cachedData) {
      console.log(`Cache hit for key: ${key}`)
      return cachedData
    }

    // Veri önbellekte yoksa, fetch fonksiyonunu çalıştır
    console.log(`Cache miss for key: ${key}, fetching data...`)
    const data = await fetchFn()

    // Veriyi önbelleğe kaydet
    await redis.set(key, data, { ex: ttl })

    return data
  } catch (error) {
    console.error(`Cache error for key ${key}:`, error)
    // Önbellekleme hatası durumunda, veriyi doğrudan getir
    return fetchFn()
  }
}

// Önbelleği temizle
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key)
    console.log(`Cache invalidated for key: ${key}`)
  } catch (error) {
    console.error(`Failed to invalidate cache for key ${key}:`, error)
  }
}

// Önbellek anahtarı desenine göre temizle
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)

    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redis.del(key)))
      console.log(`Invalidated ${keys.length} cache keys matching pattern: ${pattern}`)
    }
  } catch (error) {
    console.error(`Failed to invalidate cache pattern ${pattern}:`, error)
  }
}
