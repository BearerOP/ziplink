import { NextRequest, NextResponse } from 'next/server'
import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'
import prisma from '@/lib/prisma'
import {
  generateLinkId,
  generateZipLinkKeypair,
  encryptSecretKey,
  generateZipLinkUrl,
  validateAmount,
  solToLamports
} from '@/lib/ziplink/utils'

/**
 * POST /api/ziplink/create
 * 
 * Creates a new ZipLink with SOL
 * 
 * Request Body:
 * {
 *   amount: number,           // Amount in SOL
 *   memo?: string,            // Optional message
 *   title?: string,           // Optional title
 *   expiresIn?: number,       // Optional: hours until expiry
 *   creatorEmail?: string,    // Optional: creator's email
 *   fundingWalletKey?: string // Optional: private key to fund from
 * }
 * 
 * Response:
 * {
 *   linkId: string,
 *   url: string,
 *   publicKey: string,
 *   amount: number,
 *   qrCode?: string
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      amount, 
      memo, 
      title, 
      expiresIn, 
      creatorEmail,
      fundingWalletKey 
    } = body

    // Validate amount
    if (!amount || !validateAmount(amount)) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be between 0 and 1,000,000 SOL' },
        { status: 400 }
      )
    }

    // Generate unique link ID and keypair
    const linkId = generateLinkId()
    const zipLinkKeypair = generateZipLinkKeypair()
    
    // Encrypt the secret key
    const encryptionPassword = process.env.WALLET_SECRET || 'development-secret'
    const encryptedSecretKey = encryptSecretKey(
      zipLinkKeypair.secretKey,
      encryptionPassword
    )

    // Calculate expiry date if provided
    let expiresAt: Date | null = null
    if (expiresIn && expiresIn > 0) {
      expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + expiresIn)
    }

    // Generate URL
    const url = generateZipLinkUrl(linkId)

    // Create ZipLink in database
    const zipLink = await prisma.zipLink.create({
      data: {
        linkId,
        url,
        publicKey: zipLinkKeypair.publicKey.toString(),
        secretKey: encryptedSecretKey,
        tokenMint: null, // null = SOL
        amount: amount.toString(),
        memo: memo || null,
        title: title || null,
        status: 'active',
        expiresAt,
        creatorEmail: creatorEmail || null,
      }
    })

    // Fund the ZipLink wallet on Solana
    try {
      const connection = new Connection(
        process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com',
        'confirmed'
      )

      if (fundingWalletKey) {
        // User provided their own funding wallet
        const fundingWallet = Keypair.fromSecretKey(
          Buffer.from(fundingWalletKey, 'base64')
        )

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: fundingWallet.publicKey,
            toPubkey: zipLinkKeypair.publicKey,
            lamports: solToLamports(amount),
          })
        )

        await sendAndConfirmTransaction(connection, transaction, [fundingWallet])
      } else {
        // For development: Request airdrop on devnet
        if (process.env.SOLANA_NETWORK === 'devnet') {
          const airdropSignature = await connection.requestAirdrop(
            zipLinkKeypair.publicKey,
            solToLamports(amount)
          )
          
          await connection.confirmTransaction(airdropSignature)
        }
      }

      console.log(`[ZipLink] Created and funded: ${linkId} with ${amount} SOL`)
    } catch (error) {
      console.error('[ZipLink] Failed to fund wallet:', error)
      // Don't fail the entire operation - mark as unfunded
      await prisma.zipLink.update({
        where: { id: zipLink.id },
        data: { 
          memo: `${memo || ''} [UNFUNDED - Manual funding required]`.trim()
        }
      })
    }

    // Update analytics
    await updateAnalytics(amount)

    return NextResponse.json({
      linkId: zipLink.linkId,
      url: zipLink.url,
      publicKey: zipLink.publicKey,
      amount: parseFloat(zipLink.amount.toString()),
      expiresAt: zipLink.expiresAt,
      status: 'created'
    })

  } catch (error) {
    console.error('[ZipLink Create] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create ZipLink' },
      { status: 500 }
    )
  }
}

/**
 * Update daily analytics
 */
async function updateAnalytics(amount: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.zipLinkAnalytics.upsert({
    where: { date: today },
    update: {
      linksCreated: { increment: 1 },
      totalAmount: { increment: amount }
    },
    create: {
      date: today,
      linksCreated: 1,
      totalAmount: amount,
      linksClaimed: 0,
      uniqueUsers: 0
    }
  })
}

