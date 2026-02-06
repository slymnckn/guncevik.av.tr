import { Redis } from "@upstash/redis"

// Redis istemcisi oluştur (null-safe)
let redis: Redis | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

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
  ttl = 3600,
): Promise<T> {
  if (!redis) {
    return fetchFn()
  }

  try {
    const cachedData = await redis.get<T>(key)

    if (cachedData) {
      return cachedData
    }

    const data = await fetchFn()
    await redis.set(key, data, { ex: ttl })

    return data
  } catch (error) {
    console.error(`Cache error for key ${key}:`, error)
    return fetchFn()
  }
}

// Önbelleği temizle
export async function invalidateCache(key: string): Promise<void> {
  if (!redis) return
  try {
    await redis.del(key)
  } catch (error) {
    console.error(`Failed to invalidate cache for key ${key}:`, error)
  }
}

// Önbellek anahtarı desenine göre temizle
export async function invalidateCachePattern(pattern: string): Promise<void> {
  if (!redis) return
  try {
    const keys = await redis.keys(pattern)

    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redis!.del(key)))
    }
  } catch (error) {
    console.error(`Failed to invalidate cache pattern ${pattern}:`, error)
  }
}
