import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'tweetnacl'
import { getSession } from '@/lib/sessions'

/**
 * POST /api/wallet/sign-message
 * 
 * Signs an arbitrary message with the user's wallet
 * 
 * Headers:
 * Authorization: Bearer {sessionToken}
 * 
 * Request Body:
 * {
 *   message: number[]  // Message bytes to sign
 * }
 * 
 * Response:
 * {
 *   signature: number[]  // Signature bytes
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

    // Get message from request body
    const body = await request.json()
    const { message: messageBytes } = body

    if (!messageBytes || !Array.isArray(messageBytes)) {
      return NextResponse.json(
        { error: 'Missing or invalid message' },
        { status: 400 }
      )
    }

    try {
      // Sign message with user's wallet private key
      const messageUint8 = new Uint8Array(messageBytes)
      const signature = sign.detached(messageUint8, session.wallet.secretKey)

      console.log(`[Wallet API] Message signed for: ${session.email}`)

      return NextResponse.json({
        signature: Array.from(signature)
      })

    } catch (error) {
      console.error('[Wallet API] Message signing failed:', error)
      return NextResponse.json(
        { error: 'Failed to sign message' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('[Wallet API] Sign message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

