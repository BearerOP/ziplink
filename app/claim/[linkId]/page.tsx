"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/components/wallet-context'
import { toast } from 'sonner'
import Link from 'next/link'

interface ZipLinkData {
  linkId: string
  url: string
  publicKey: string
  amount: number
  currentBalance: number
  status: string
  memo?: string
  title?: string
  expiresAt?: string
  createdAt: string
  claims: any[]
}

export default function ClaimZipLinkPage() {
  const params = useParams()
  const linkId = params?.linkId as string
  const { publicKey, isConnected } = useWallet()
  
  const [zipLink, setZipLink] = useState<ZipLinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [claimTx, setClaimTx] = useState<string | null>(null)
  const [customAddress, setCustomAddress] = useState('')
  const [claimerName, setClaimerName] = useState('')

  useEffect(() => {
    fetchZipLink()
  }, [linkId])

  const fetchZipLink = async () => {
    try {
      const response = await fetch(`/api/ziplink/${linkId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ZipLink')
      }

      setZipLink(data)
      
      // Check if already claimed
      if (data.status === 'claimed') {
        setClaimed(true)
      }
    } catch (error: any) {
      console.error('Fetch error:', error)
      toast.error(error.message || 'Failed to load ZipLink')
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async (recipientAddress?: string) => {
    if (!zipLink) return

    // Use connected wallet or custom address
    const recipient = recipientAddress || publicKey
    
    if (!recipient) {
      toast.error('Please connect your wallet or enter a recipient address')
      return
    }

    setClaiming(true)

    try {
      const response = await fetch('/api/ziplink/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkId: zipLink.linkId,
          recipientAddress: recipient,
          claimerName: claimerName || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim ZipLink')
      }

      setClaimTx(data.txSignature)
      setClaimed(true)
      toast.success('ZipLink claimed successfully!')
      
      // Refresh data
      await fetchZipLink()

    } catch (error: any) {
      console.error('Claim error:', error)
      toast.error(error.message || 'Failed to claim ZipLink')
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F3]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[rgba(55,50,47,0.60)] font-sans">Loading your ZipLink...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!zipLink) {
    return (
      <div className="min-h-screen bg-[#F7F5F3]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-[#37322f] mb-4 font-serif">ZipLink Not Found</h1>
          <p className="text-[rgba(55,50,47,0.60)] mb-6 font-sans">
            This ZipLink doesn't exist or has been removed.
          </p>
          <Link href="/create">
            <Button>Create Your Own ZipLink</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Already claimed
  if (claimed && claimTx) {
    return (
      <div className="min-h-screen bg-[#F7F5F3]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-[#37322f] font-serif mb-2">
              Claimed Successfully! 🎉
            </h1>
            <p className="text-[rgba(55,50,47,0.60)] font-sans">
              The SOL has been transferred to your wallet
            </p>
          </div>

          <Card className="border-[rgba(55,50,47,0.12)]">
            <CardHeader>
              <CardTitle className="font-serif">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[rgba(55,50,47,0.60)] font-sans">Amount</label>
                <div className="text-2xl font-bold text-[#9945FF] font-mono mt-1">
                  {zipLink.amount} SOL
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[rgba(55,50,47,0.60)] font-sans">Transaction</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-[rgba(55,50,47,0.05)] px-3 py-2 rounded flex-1 font-mono">
                    {claimTx.slice(0, 32)}...
                  </code>
                  <Button
                    size="sm"
                    onClick={() => window.open(`https://explorer.solana.com/tx/${claimTx}?cluster=devnet`, '_blank')}
                  >
                    View
                  </Button>
                </div>
              </div>

              {zipLink.memo && (
                <div>
                  <label className="text-sm font-medium text-[rgba(55,50,47,0.60)] font-sans">Message</label>
                  <p className="text-[rgba(55,50,47,0.80)] font-sans mt-1 bg-[rgba(55,50,47,0.05)] p-3 rounded">
                    "{zipLink.memo}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/create">
              <Button>Create Your Own ZipLink</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Expired or cancelled
  if (zipLink.status === 'expired' || zipLink.status === 'cancelled') {
    return (
      <div className="min-h-screen bg-[#F7F5F3]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-[#37322f] mb-4 font-serif">
            {zipLink.status === 'expired' ? 'ZipLink Expired' : 'ZipLink Cancelled'}
          </h1>
          <p className="text-[rgba(55,50,47,0.60)] mb-6 font-sans">
            {zipLink.status === 'expired' 
              ? 'This ZipLink has expired and can no longer be claimed.'
              : 'This ZipLink has been cancelled by the creator.'}
          </p>
          <Link href="/create">
            <Button>Create Your Own ZipLink</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Ready to claim
  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💸</div>
          <h1 className="text-4xl font-bold text-[#37322f] font-serif mb-2">
            {zipLink.title || 'You Received SOL!'}
          </h1>
          {zipLink.memo && (
            <p className="text-lg text-[rgba(55,50,47,0.80)] font-sans max-w-xl mx-auto">
              "{zipLink.memo}"
            </p>
          )}
        </div>

        {/* Amount Card */}
        <Card className="border-[rgba(55,50,47,0.12)] mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-[rgba(55,50,47,0.60)] mb-2 font-sans">Amount</p>
              <div className="text-5xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent font-mono mb-4">
                {zipLink.currentBalance || zipLink.amount} SOL
              </div>
              {zipLink.expiresAt && (
                <p className="text-sm text-[rgba(55,50,47,0.60)] font-sans">
                  Expires: {new Date(zipLink.expiresAt).toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Claim Methods */}
        <div className="space-y-6">
          {/* Method 1: Connected Wallet */}
          {isConnected && publicKey ? (
            <Card className="border-[rgba(55,50,47,0.12)]">
              <CardHeader>
                <CardTitle className="font-serif">✨ Claim to Your Wallet</CardTitle>
                <CardDescription className="font-sans">
                  Your wallet is connected and ready
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-[rgba(55,50,47,0.05)] p-4 rounded-lg">
                  <p className="text-sm font-medium text-[rgba(55,50,47,0.60)] mb-2 font-sans">Recipient Address</p>
                  <p className="font-mono text-sm text-[#37322f] break-all">{publicKey}</p>
                </div>

                <div>
                  <Label htmlFor="name" className="font-sans">Your Name (Optional)</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={claimerName}
                    onChange={(e) => setClaimerName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Button
                  onClick={() => handleClaim()}
                  disabled={claiming}
                  className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-semibold"
                  size="lg"
                >
                  {claiming ? 'Claiming...' : `Claim ${zipLink.currentBalance || zipLink.amount} SOL`}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[rgba(55,50,47,0.12)]">
              <CardHeader>
                <CardTitle className="font-serif">Connect Your Wallet</CardTitle>
                <CardDescription className="font-sans">
                  Connect to claim directly to your wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    // The connect wallet button in header will handle this
                    document.querySelector<HTMLButtonElement>('button:has-text("Connect Wallet")')?.click()
                  }}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Method 2: Custom Address */}
          <Card className="border-[rgba(55,50,47,0.12)]">
            <CardHeader>
              <CardTitle className="font-serif">Or Use a Custom Address</CardTitle>
              <CardDescription className="font-sans">
                Enter any Solana address to receive the funds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address" className="font-sans">Solana Address</Label>
                <Input
                  id="address"
                  placeholder="Enter Solana public key..."
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="mt-2 font-mono text-sm"
                />
              </div>

              <Button
                onClick={() => handleClaim(customAddress)}
                disabled={claiming || !customAddress}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {claiming ? 'Claiming...' : 'Claim to Custom Address'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-sans">
            <strong>ℹ️ Note:</strong> This is on Solana Devnet for testing. The SOL has no real value.
          </p>
        </div>
      </main>
    </div>
  )
}

