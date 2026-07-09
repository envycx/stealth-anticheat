import { randomBytes, createHash } from "crypto"

/**
 * Generate a license key in format: STLTH-XXXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  const segments = []
  for (let i = 0; i < 4; i++) {
    const segment = randomBytes(2).toString("hex").toUpperCase()
    segments.push(segment)
  }
  return `STLTH-${segments.join("-")}`
}

/**
 * Generate an API key with prefix (sk_live_ or sk_test_)
 * Returns both the full key and a hash for storage
 */
export function generateApiKey(environment: "production" | "sandbox"): {
  fullKey: string
  keyHash: string
  keyPreview: string
} {
  const prefix = environment === "production" ? "sk_live_" : "sk_test_"
  const randomPart = randomBytes(32).toString("hex")
  const fullKey = prefix + randomPart

  // Hash the key for storage
  const keyHash = createHash("sha256").update(fullKey).digest("hex")

  // Create a preview (first 8 chars after prefix + last 4 chars)
  const keyPreview = `${prefix}${randomPart.slice(0, 8)}...${randomPart.slice(-4)}`

  return {
    fullKey,
    keyHash,
    keyPreview,
  }
}

/**
 * Hash an API key for comparison
 */
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex")
}

/**
 * Generate a hardware ID (HWID) - in production this would come from client
 * For demo purposes, generates a random 32-char hex string
 */
export function generateHwid(): string {
  return randomBytes(16).toString("hex").toUpperCase()
}

/**
 * Mask HWID for display (show first 4 and last 4 chars)
 */
export function maskHwid(hwid: string): string {
  if (hwid.length <= 8) return hwid
  return `${hwid.slice(0, 4)}...${hwid.slice(-4)}`
}
