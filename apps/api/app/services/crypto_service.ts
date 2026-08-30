import crypto from 'node:crypto'
import env from '#start/env'

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const rawKey = env.get('APP_KEY')
  const appKey =
    (typeof rawKey === 'object' && rawKey !== null && 'release' in rawKey
      ? (rawKey as { release: () => string }).release()
      : String(rawKey || '')) || 'growthcoder-default-secret-key-32b'
  // Derive a consistent 32-byte key using SHA-256
  return crypto.createHash('sha256').update(appKey).digest()
}

export class CryptoService {
  static encrypt(plainText: string): string {
    if (!plainText) return ''
    const iv = crypto.randomBytes(12) // 96-bit IV for GCM
    const key = getKey()
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])
    const authTag = cipher.getAuthTag()
    // iv (12) + authTag (16) + encrypted
    return Buffer.concat([iv, authTag, encrypted]).toString('base64')
  }

  static decrypt(cipherText: string): string {
    if (!cipherText) return ''
    try {
      const data = Buffer.from(cipherText, 'base64')
      if (data.length < 28) return cipherText // Not a valid ciphertext, return as is
      const iv = data.subarray(0, 12)
      const authTag = data.subarray(12, 28)
      const encrypted = data.subarray(28)
      const key = getKey()
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
      decipher.setAuthTag(authTag)
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
      return decrypted.toString('utf8')
    } catch {
      return cipherText // fallback if decryption fails
    }
  }
}
