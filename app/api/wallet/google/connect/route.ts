import { NextRequest, NextResponse } from 'next/server'
import { Keypair } from '@solana/web3.js'
import crypto from 'crypto'
import { setSession } from '@/lib/sessions'

/**
 * POST /api/wallet/google/connect
 * 
 * Connects or creates a Solana wallet for a Google-authenticated user
 * 
 * Request Body:
 * {
 *   idToken: string,     // Google OAuth access token
 *   email: string        // User's email
 * }
 * 
 * Response:
 * {
 *   publicKey: string,   // Solana public key
 *   sessionToken: string // Session token for future requests
 * }
 */

// In-memory wallet storage (use encrypted database in production)
const wallets = new Map<string, Keypair>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken, email } = body

    if (!idToken || !email) {
      return NextResponse.json(
        { error: 'Missing idToken or email' },
        { status: 400 }
      )
    }

    // Verify Google token
    try {
      const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })

      if (!googleResponse.ok) {
        return NextResponse.json(
          { error: 'Invalid Google token' },
          { status: 401 }
        )
      }

      const googleUser = await googleResponse.json()
      const userId = googleUser.sub // Google user ID

      // Get or create wallet for this user
      let wallet = wallets.get(userId)
      
      if (!wallet) {
        // Create deterministic wallet from user ID + secret
        const walletSecret = process.env.WALLET_SECRET || 'development-secret-key'
        const seed = crypto.createHash('sha256')
          .update(userId + walletSecret)
          .digest()
        
        wallet = Keypair.fromSeed(seed.slice(0, 32))
        wallets.set(userId, wallet)
        
        console.log(`[Wallet API] Created new wallet for user: ${email}`)
      } else {
        console.log(`[Wallet API] Retrieved existing wallet for user: ${email}`)
      }

      // Create session
      const sessionToken = crypto.randomUUID()
      setSession(sessionToken, {
        userId,
        email,
        wallet,
        createdAt: Date.now()
      })

      console.log(`[Wallet API] Session created for: ${email}`)

      return NextResponse.json({
        publicKey: wallet.publicKey.toString(),
        sessionToken
      })

    } catch (error) {
      console.error('[Wallet API] Google token verification failed:', error)
      return NextResponse.json(
        { error: 'Failed to verify Google token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('[Wallet API] Connect error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

