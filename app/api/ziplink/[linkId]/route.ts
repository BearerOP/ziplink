import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'
import prisma from '@/lib/prisma'

/**
 * GET /api/ziplink/[linkId]
 * 
 * Get ZipLink details
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params

    const zipLink = await prisma.zipLink.findUnique({
      where: { linkId },
      include: {
        claims: {
          select: {
            id: true,
            claimerAddr: true,
            claimerEmail: true,
            claimerName: true,
            amount: true,
            createdAt: true,
            txSignature: true
          }
        }
      }
    })

    if (!zipLink) {
      return NextResponse.json(
        { error: 'ZipLink not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (zipLink.expiresAt && new Date() > zipLink.expiresAt && zipLink.status === 'active') {
      await prisma.zipLink.update({
        where: { id: zipLink.id },
        data: { status: 'expired' }
      })
      zipLink.status = 'expired'
    }

    // Get current balance from Solana
    let currentBalance = 0
    try {
      const connection = new Connection(
        process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com',
        'confirmed'
      )
      const publicKey = new PublicKey(zipLink.publicKey)
      const balanceLamports = await connection.getBalance(publicKey)
      currentBalance = balanceLamports / 1e9
    } catch (error) {
      console.error('[ZipLink] Failed to fetch balance:', error)
    }

    return NextResponse.json({
      linkId: zipLink.linkId,
      url: zipLink.url,
      publicKey: zipLink.publicKey,
      amount: parseFloat(zipLink.amount.toString()),
      currentBalance,
      status: zipLink.status,
      memo: zipLink.memo,
      title: zipLink.title,
      expiresAt: zipLink.expiresAt,
      createdAt: zipLink.createdAt,
      claimedAt: zipLink.claimedAt,
      claims: zipLink.claims,
      totalClaims: zipLink.claims.length
    })

  } catch (error) {
    console.error('[ZipLink Get] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ZipLink' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/ziplink/[linkId]
 * 
 * Cancel a ZipLink (only if not claimed)
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const { linkId } = await params

    const zipLink = await prisma.zipLink.findUnique({
      where: { linkId }
    })

    if (!zipLink) {
      return NextResponse.json(
        { error: 'ZipLink not found' },
        { status: 404 }
      )
    }

    if (zipLink.status === 'claimed') {
      return NextResponse.json(
        { error: 'Cannot cancel a claimed ZipLink' },
        { status: 400 }
      )
    }

    // Update status to cancelled
    await prisma.zipLink.update({
      where: { id: zipLink.id },
      data: { status: 'cancelled' }
    })

    // TODO: In production, return remaining funds to creator

    return NextResponse.json({
      success: true,
      message: 'ZipLink cancelled successfully'
    })

  } catch (error) {
    console.error('[ZipLink Cancel] Error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel ZipLink' },
      { status: 500 }
    )
  }
}

