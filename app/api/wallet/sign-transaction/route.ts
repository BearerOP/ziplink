import { NextRequest, NextResponse } from 'next/server'
import { Transaction } from '@solana/web3.js'
import { getSession } from '@/lib/sessions'

/**
 * POST /api/wallet/sign-transaction
 * 
 * Signs a Solana transaction with the user's wallet
 * 
 * Headers:
 * Authorization: Bearer {sessionToken}
 * 
 * Request Body:
 * {
 *   transaction: number[],  // Serialized transaction bytes
 *   origin?: string         // Optional: origin domain
 * }
 * 
 * Response:
 * {
 *   signature: number[]     // Transaction signature bytes
 * }
 */

export async function POST(request: NextRequest) {
  try {
    // Get session token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const sessionToken = authHeader.replace('Bearer ', '')
    const session = getSession(sessionToken)

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    // Get transaction from request body
    const body = await request.json()
    const { transaction: txBytes, origin } = body

    if (!txBytes || !Array.isArray(txBytes)) {
      return NextResponse.json(
        { error: 'Missing or invalid transaction' },
        { status: 400 }
      )
    }

    try {
      // Deserialize transaction
      const transaction = Transaction.from(Buffer.from(txBytes))

      // Sign transaction with user's wallet
      transaction.sign(session.wallet)

      console.log(`[Wallet API] Transaction signed for: ${session.email}`)
      if (origin) {
        console.log(`[Wallet API] Origin: ${origin}`)
      }

      // Return signature
      const signature = transaction.signature
      if (!signature) {
        throw new Error('Failed to get signature from transaction')
      }

      return NextResponse.json({
        signature: Array.from(signature)
      })

    } catch (error) {
      console.error('[Wallet API] Transaction signing failed:', error)
      return NextResponse.json(
        { error: 'Failed to sign transaction' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('[Wallet API] Sign transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

