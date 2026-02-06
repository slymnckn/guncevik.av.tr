import { createHash, randomBytes, timingSafeEqual } from "crypto"

// CSRF token oluştur
export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex")
}

// CSRF token doğrula
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false
  }

  try {
    const a = Buffer.from(token, "utf8")
    const b = Buffer.from(storedToken, "utf8")

    if (a.length !== b.length) {
      return false
    }

    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

// CSRF token hash'i oluştur
export function hashCSRFToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}
