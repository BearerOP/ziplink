/**
 * ZipLink Utility Functions
 */

import { Keypair } from '@solana/web3.js'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

/**
 * Generate a unique short ID for the ZipLink
 */
export function generateLinkId(): string {
  return nanoid(10) // 10 characters, URL-safe
}

/**
 * Generate a new Solana keypair for the ZipLink
 */
export function generateZipLinkKeypair(): Keypair {
  return Keypair.generate()
}

/**
 * Encrypt the secret key for storage
 */
export function encryptSecretKey(secretKey: Uint8Array, password: string): string {
  const algorithm = 'aes-256-gcm'
  const iv = crypto.randomBytes(16)
  const salt = crypto.randomBytes(64)
  
  // Derive key from password
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512')
  
  // Encrypt
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(secretKey)),
    cipher.final()
  ])
  
  const authTag = cipher.getAuthTag()
  
  // Combine salt + iv + authTag + encrypted
  const combined = Buffer.concat([salt, iv, authTag, encrypted])
  
  return combined.toString('base64')
}

/**
 * Decrypt the secret key from storage
 */
export function decryptSecretKey(encryptedData: string, password: string): Uint8Array {
  const algorithm = 'aes-256-gcm'
  const combined = Buffer.from(encryptedData, 'base64')
  
  // Extract components
  const salt = combined.slice(0, 64)
  const iv = combined.slice(64, 80)
  const authTag = combined.slice(80, 96)
  const encrypted = combined.slice(96)
  
  // Derive key from password
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512')
  
  // Decrypt
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(authTag)
  
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ])
  
  return new Uint8Array(decrypted)
}

/**
 * Generate full URL for a ZipLink
 */
export function generateZipLinkUrl(linkId: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base}/claim/${linkId}`
}

/**
 * Validate amount
 */
export function validateAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount) && amount <= 1000000
}

/**
 * Format SOL amount for display
 */
export function formatSOL(lamports: number): string {
  return (lamports / 1e9).toFixed(4)
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * 1e9)
}

