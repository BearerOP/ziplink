/**
 * GOOGLE-AUTHENTICATED WALLET ADAPTER
 * ====================================
 * 
 * This adapter creates a Solana wallet for users who sign in with Google.
 * The wallet is managed by your backend and keys are derived from the user's Google ID.
 * 
 * FEATURES:
 * - Email-based wallet (no extension required)
 * - Secure key management on backend
 * - Seamless user experience
 * - Works on any device
 */

import { WalletAdapter, WalletAdapterEvents, SignPayload } from './adapter'

export interface GoogleWalletConfig {
  /**
   * Your backend API endpoint
   * Example: 'https://api.yourapp.com'
   */
  apiEndpoint: string

  /**
   * Google ID token from OAuth
   */
  googleIdToken: string

  /**
   * Optional: User's email for display
   */
  userEmail?: string
}

/**
 * Creates a wallet adapter for Google-authenticated users
 * 
 * BACKEND REQUIREMENTS:
 * Your backend must implement these endpoints:
 * 
 * POST /wallet/google/connect
 * - Input: { idToken: string }
 * - Output: { publicKey: string, sessionToken: string }
 * 
 * POST /wallet/sign-transaction
 * - Headers: Authorization: Bearer {sessionToken}
 * - Input: { transaction: number[] }
 * - Output: { signature: number[] }
 * 
 * POST /wallet/sign-message
 * - Headers: Authorization: Bearer {sessionToken}
 * - Input: { message: number[] }
 * - Output: { signature: number[] }
 * 
 * POST /wallet/disconnect
 * - Headers: Authorization: Bearer {sessionToken}
 * - Output: { success: boolean }
 */
export function createGoogleWalletAdapter(
  config: GoogleWalletConfig
): WalletAdapter {
  // State
  let currentPublicKey: string | null = null
  let sessionToken: string | null = null
  let isConnecting = false

  // Event management
  const listeners = new Map<string, Set<Function>>()

  const on = <K extends keyof WalletAdapterEvents>(
    event: K,
    callback: WalletAdapterEvents[K]
  ) => {
    if (!listeners.has(event)) {
      listeners.set(event, new Set())
    }
    listeners.get(event)!.add(callback as Function)
  }

  const off = <K extends keyof WalletAdapterEvents>(
    event: K,
    callback: WalletAdapterEvents[K]
  ) => {
    listeners.get(event)?.delete(callback as Function)
  }

  const emit = (event: string, ...args: any[]) => {
    listeners.get(event)?.forEach((fn) => fn(...args))
  }

  // Helper for making authenticated API calls
  const apiCall = async (
    endpoint: string,
    data?: any,
    requiresAuth = false
  ) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (requiresAuth && sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`
    }

    const response = await fetch(`${config.apiEndpoint}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data || {}),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  return {
    get publicKey() {
      return currentPublicKey
    },

    isZipLink: true,

    /**
     * Connect to the Google-authenticated wallet
     * 
     * Flow:
     * 1. Send Google ID token to backend
     * 2. Backend verifies token with Google
     * 3. Backend creates/retrieves Solana wallet for this user
     * 4. Backend returns public key and session token
     */
    async connect(): Promise<{ publicKey: string }> {
      if (isConnecting) {
        throw new Error('Connection already in progress')
      }

      if (currentPublicKey) {
        return { publicKey: currentPublicKey! }
      }

      isConnecting = true

      try {
        console.log('[GoogleWallet] Connecting with Google authentication...')

        // Request wallet creation/connection from backend
        const result = await apiCall('/wallet/google/connect', {
          idToken: config.googleIdToken,
          email: config.userEmail,
        })

        if (!result.publicKey || !result.sessionToken) {
          throw new Error('Invalid response from server')
        }

        currentPublicKey = result.publicKey
        sessionToken = result.sessionToken

        // Emit connect event
        emit('connect')

        console.log('[GoogleWallet] Connected:', {
          publicKey: currentPublicKey,
          email: config.userEmail,
        })

        return { publicKey: currentPublicKey! }
      } catch (error) {
        console.error('[GoogleWallet] Connection failed:', error)
        throw error
      } finally {
        isConnecting = false
      }
    },

    /**
     * Disconnect from the wallet
     */
    async disconnect(): Promise<void> {
      if (!currentPublicKey) {
        return
      }

      try {
        console.log('[GoogleWallet] Disconnecting...')

        // Notify backend to invalidate session
        if (sessionToken) {
          await apiCall('/wallet/disconnect', {}, true)
        }

        currentPublicKey = null
        sessionToken = null

        // Clear listeners
        listeners.clear()

        // Emit disconnect event
        emit('disconnect')

        console.log('[GoogleWallet] Disconnected')
      } catch (error) {
        console.error('[GoogleWallet] Disconnect failed:', error)
        // Clear state even if API call fails
        currentPublicKey = null
        sessionToken = null
        throw error
      }
    },

    /**
     * Sign a transaction using the backend-managed wallet
     */
    async signTransaction(payload: SignPayload) {
      if (!currentPublicKey || !sessionToken) {
        throw new Error('Wallet not connected')
      }

      try {
        console.log('[GoogleWallet] Signing transaction...')

        const result = await apiCall(
          '/wallet/sign-transaction',
          {
            transaction: Array.from(payload.transaction),
            origin: payload.origin,
          },
          true // requires authentication
        )

        if (!result.signature) {
          throw new Error('No signature returned from server')
        }

        const signature = new Uint8Array(result.signature)

        console.log('[GoogleWallet] Transaction signed')

        return { signature }
      } catch (error) {
        console.error('[GoogleWallet] Transaction signing failed:', error)
        throw error
      }
    },

    /**
     * Sign multiple transactions
     */
    async signAllTransactions(payloads: SignPayload[]) {
      if (!currentPublicKey || !sessionToken) {
        throw new Error('Wallet not connected')
      }

      try {
        console.log(`[GoogleWallet] Signing ${payloads.length} transactions...`)

        // Option 1: Use batch endpoint if available
        // const result = await apiCall(
        //   '/wallet/sign-batch',
        //   {
        //     transactions: payloads.map(p => ({
        //       transaction: Array.from(p.transaction),
        //       origin: p.origin,
        //     }))
        //   },
        //   true
        // )
        // return {
        //   signatures: result.signatures.map((s: number[]) => new Uint8Array(s))
        // }

        // Option 2: Sign one by one
        const signatures = await Promise.all(
          payloads.map(async (payload) => {
            const result = await this.signTransaction(payload)
            return result.signature
          })
        )

        console.log(`[GoogleWallet] ${signatures.length} transactions signed`)

        return { signatures }
      } catch (error) {
        console.error('[GoogleWallet] Batch signing failed:', error)
        throw error
      }
    },

    /**
     * Sign an arbitrary message
     */
    async signMessage(message: Uint8Array) {
      if (!currentPublicKey || !sessionToken) {
        throw new Error('Wallet not connected')
      }

      try {
        console.log('[GoogleWallet] Signing message...')

        const result = await apiCall(
          '/wallet/sign-message',
          {
            message: Array.from(message),
          },
          true
        )

        if (!result.signature) {
          throw new Error('No signature returned from server')
        }

        const signature = new Uint8Array(result.signature)

        console.log('[GoogleWallet] Message signed')

        return { signature }
      } catch (error) {
        console.error('[GoogleWallet] Message signing failed:', error)
        throw error
      }
    },

    on,
    off,
  }
}

/**
 * USAGE EXAMPLE
 * =============
 * 
 * // In your wallet-context.tsx after Google login:
 * 
 * import { createGoogleWalletAdapter } from '@/lib/wallet/google-wallet-adapter'
 * 
 * const loginWithGoogle = async () => {
 *   // 1. Authenticate with Google
 *   const googleResponse = await googleAuth.signIn()
 *   const idToken = googleResponse.credential
 *   
 *   // 2. Create wallet adapter
 *   const adapter = createGoogleWalletAdapter({
 *     apiEndpoint: 'https://api.yourapp.com',
 *     googleIdToken: idToken,
 *     userEmail: googleResponse.email
 *   })
 *   
 *   // 3. Connect the wallet
 *   const { publicKey } = await adapter.connect()
 *   
 *   // 4. Add to available wallets
 *   setAvailableWallets([
 *     ...availableWallets,
 *     {
 *       name: `Google (${googleResponse.email})`,
 *       icon: '🔑',
 *       adapter: adapter,
 *       installed: true
 *     }
 *   ])
 * }
 * 
 * // Later, when user wants to sign a transaction:
 * const tx = // ... create transaction
 * const { signature } = await adapter.signTransaction({
 *   transaction: tx.serialize()
 * })
 */

/**
 * BACKEND IMPLEMENTATION GUIDE (Node.js + Express)
 * ================================================
 * 
 * import { Keypair } from '@solana/web3.js'
 * import { OAuth2Client } from 'google-auth-library'
 * import crypto from 'crypto'
 * 
 * const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
 * const sessions = new Map() // In production, use Redis
 * const wallets = new Map()  // In production, use encrypted database
 * 
 * // Connect endpoint
 * app.post('/wallet/google/connect', async (req, res) => {
 *   try {
 *     // Verify Google token
 *     const ticket = await googleClient.verifyIdToken({
 *       idToken: req.body.idToken,
 *       audience: process.env.GOOGLE_CLIENT_ID
 *     })
 *     const payload = ticket.getPayload()
 *     const userId = payload.sub // Google user ID
 * 
 *     // Get or create wallet for this user
 *     let wallet = wallets.get(userId)
 *     if (!wallet) {
 *       // Derive deterministic keypair from user ID + secret
 *       const seed = crypto.createHash('sha256')
 *         .update(userId + process.env.WALLET_SECRET)
 *         .digest()
 *       wallet = Keypair.fromSeed(seed.slice(0, 32))
 *       wallets.set(userId, wallet)
 *     }
 * 
 *     // Create session
 *     const sessionToken = crypto.randomUUID()
 *     sessions.set(sessionToken, { userId, wallet })
 * 
 *     res.json({
 *       publicKey: wallet.publicKey.toString(),
 *       sessionToken
 *     })
 *   } catch (error) {
 *     res.status(401).json({ error: 'Authentication failed' })
 *   }
 * })
 * 
 * // Sign transaction endpoint
 * app.post('/wallet/sign-transaction', async (req, res) => {
 *   try {
 *     const token = req.headers.authorization?.replace('Bearer ', '')
 *     const session = sessions.get(token)
 *     if (!session) {
 *       return res.status(401).json({ error: 'Invalid session' })
 *     }
 * 
 *     const { transaction } = req.body
 *     const tx = Transaction.from(Buffer.from(transaction))
 *     
 *     // Sign transaction
 *     tx.sign(session.wallet)
 *     
 *     res.json({
 *       signature: Array.from(tx.signature)
 *     })
 *   } catch (error) {
 *     res.status(500).json({ error: 'Signing failed' })
 *   }
 * })
 */

