import { NextRequest, NextResponse } from 'next/server'
import { getSession, deleteSession } from '@/lib/sessions'

/**
 * POST /api/wallet/disconnect
 * 
 * Disconnects the user's wallet session
 * 
 * Headers:
 * Authorization: Bearer {sessionToken}
 * 
 * Response:
 * {
 *   success: boolean
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

    // Delete session
    deleteSession(sessionToken)

    console.log(`[Wallet API] Session disconnected for: ${session.email}`)

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('[Wallet API] Disconnect error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

