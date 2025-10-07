/**
 * Session storage for Google wallet authentication
 * In production, replace with Redis or database storage
 */

import { Keypair } from '@solana/web3.js'

interface Session {
  userId: string
  email: string
  wallet: Keypair
  createdAt: number
}

// In-memory session storage (use Redis in production)
export const sessions = new Map<string, Session>()

/**
 * Clean up old sessions (older than 24 hours)
 */
export function cleanupSessions() {
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000 // 24 hours
  
  for (const [token, session] of sessions.entries()) {
    if (now - session.createdAt > maxAge) {
      sessions.delete(token)
    }
  }
}

/**
 * Get session by token
 */
export function getSession(token: string): Session | undefined {
  return sessions.get(token)
}

/**
 * Set session
 */
export function setSession(token: string, session: Session) {
  sessions.set(token, session)
  
  // Clean up old sessions periodically
  if (sessions.size % 10 === 0) {
    cleanupSessions()
  }
}

/**
 * Delete session
 */
export function deleteSession(token: string) {
  sessions.delete(token)
}

