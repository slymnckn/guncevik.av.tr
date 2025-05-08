import { createHash, randomBytes } from "crypto"

// CSRF token oluştur
export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex")
}

// CSRF token doğrula
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false
  }

  // Sabit zamanlı karşılaştırma (timing attack'lara karşı koruma)
  const a = Buffer.from(token)
  const b = Buffer.from(storedToken)

  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i]
  }

  return result === 0
}

// CSRF token hash'i oluştur
export function hashCSRFToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}
