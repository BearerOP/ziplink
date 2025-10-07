import { NextRequest, NextResponse } from 'next/server'
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  sendAndConfirmTransaction 
} from '@solana/web3.js'
import prisma from '@/lib/prisma'
import { decryptSecretKey } from '@/lib/ziplink/utils'

/**
 * POST /api/ziplink/claim
 * 
 * Claims a ZipLink and transfers funds to recipient
 * 
 * Request Body:
 * {
 *   linkId: string,              // ZipLink ID
 *   recipientAddress: string,    // Recipient's Solana address
 *   claimerEmail?: string,       // Optional: claimer's email
 *   claimerName?: string,        // Optional: claimer's name
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   txSignature: string,
 *   amount: number,
 *   recipientAddress: string
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { linkId, recipientAddress, claimerEmail, claimerName } = body

    if (!linkId || !recipientAddress) {
      return NextResponse.json(
        { error: 'Missing linkId or recipientAddress' },
        { status: 400 }
      )
    }

    // Validate recipient address
    try {
      new PublicKey(recipientAddress)
    } catch {
      return NextResponse.json(
        { error: 'Invalid recipient address' },
        { status: 400 }
      )
    }

    // Find the ZipLink
    const zipLink = await prisma.zipLink.findUnique({
      where: { linkId },
      include: { claims: true }
    })

    if (!zipLink) {
      return NextResponse.json(
        { error: 'ZipLink not found' },
        { status: 404 }
      )
    }

    // Check if already claimed
    if (zipLink.status === 'claimed') {
      return NextResponse.json(
        { error: 'This ZipLink has already been claimed' },
        { status: 400 }
      )
    }

    // Check if expired
    if (zipLink.status === 'expired' || (zipLink.expiresAt && new Date() > zipLink.expiresAt)) {
      await prisma.zipLink.update({
        where: { id: zipLink.id },
        data: { status: 'expired' }
      })
      
      return NextResponse.json(
        { error: 'This ZipLink has expired' },
        { status: 400 }
      )
    }

    // Check if cancelled
    if (zipLink.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This ZipLink has been cancelled' },
        { status: 400 }
      )
    }

    // Decrypt the secret key
    const encryptionPassword = process.env.WALLET_SECRET || 'development-secret'
    const secretKey = decryptSecretKey(zipLink.secretKey, encryptionPassword)
    const zipLinkKeypair = Keypair.fromSecretKey(secretKey)

    // Connect to Solana
    const connection = new Connection(
      process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com',
      'confirmed'
    )

    // Get current balance
    const balance = await connection.getBalance(zipLinkKeypair.publicKey)
    
    if (balance === 0) {
      return NextResponse.json(
        { error: 'ZipLink has no funds' },
        { status: 400 }
      )
    }

    // Create transfer transaction
    const recipientPubkey = new PublicKey(recipientAddress)
    
    // Calculate rent exemption (5000 lamports minimum)
    const rentExemption = 5000
    const transferAmount = balance - rentExemption

    if (transferAmount <= 0) {
      return NextResponse.json(
        { error: 'Insufficient funds after rent exemption' },
        { status: 400 }
      )
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: zipLinkKeypair.publicKey,
        toPubkey: recipientPubkey,
        lamports: transferAmount,
      })
    )

    // Send transaction
    const txSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [zipLinkKeypair]
    )

    console.log(`[ZipLink Claim] Transaction: ${txSignature}`)

    // Create claim record
    const claim = await prisma.zipClaim.create({
      data: {
        zipLinkId: zipLink.id,
        claimerAddr: recipientAddress,
        claimerEmail: claimerEmail || null,
        claimerName: claimerName || null,
        txSignature,
        amount: (transferAmount / 1e9).toString(),
        metadata: {
          userAgent: request.headers.get('user-agent'),
          timestamp: new Date().toISOString()
        }
      }
    })

    // Update ZipLink status
    await prisma.zipLink.update({
      where: { id: zipLink.id },
      data: {
        status: 'claimed',
        claimedAt: new Date()
      }
    })

    // Update analytics
    await updateClaimAnalytics(transferAmount / 1e9)

    return NextResponse.json({
      success: true,
      txSignature,
      amount: transferAmount / 1e9,
      recipientAddress,
      claimId: claim.id
    })

  } catch (error) {
    console.error('[ZipLink Claim] Error:', error)
    return NextResponse.json(
      { error: 'Failed to claim ZipLink' },
      { status: 500 }
    )
  }
}

/**
 * Update daily analytics for claims
 */
async function updateClaimAnalytics(amount: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.zipLinkAnalytics.upsert({
    where: { date: today },
    update: {
      linksClaimed: { increment: 1 },
      uniqueUsers: { increment: 1 } // Simplified - in production, track unique addresses
    },
    create: {
      date: today,
      linksCreated: 0,
      linksClaimed: 1,
      totalAmount: 0,
      uniqueUsers: 1
    }
  })
}

