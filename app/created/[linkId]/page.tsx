"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {QRCodeSVG} from 'qrcode.react'
import Link from 'next/link'

interface ZipLinkData {
  linkId: string
  url: string
  publicKey: string
  amount: number
  status: string
  memo?: string
  title?: string
  expiresAt?: string
  createdAt: string
}

export default function ZipLinkCreatedPage() {
  const params = useParams()
  const linkId = params?.linkId as string
  const [zipLink, setZipLink] = useState<ZipLinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

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
    } catch (error: any) {
      console.error('Fetch error:', error)
      toast.error(error.message || 'Failed to load ZipLink')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (zipLink) {
      navigator.clipboard.writeText(zipLink.url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const shareOnTwitter = () => {
    if (zipLink) {
      const text = encodeURIComponent(`💸 ${zipLink.title || 'Someone sent you SOL!'}\n\nClaim it here: ${zipLink.url}`)
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
    }
  }

  const shareViaEmail = () => {
    if (zipLink) {
      const subject = encodeURIComponent(zipLink.title || 'You received SOL!')
      const body = encodeURIComponent(
        `${zipLink.memo || 'Someone sent you SOL!'}\n\n` +
        `Amount: ${zipLink.amount} SOL\n\n` +
        `Claim it here: ${zipLink.url}\n\n` +
        `Powered by ZipLink`
      )
      window.location.href = `mailto:?subject=${subject}&body=${body}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F3]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[rgba(55,50,47,0.60)] font-sans">Loading...</p>
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
          <h1 className="text-2xl font-bold text-[#37322f] mb-4">ZipLink Not Found</h1>
          <Link href="/create">
            <Button>Create a New ZipLink</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#37322f] font-serif mb-2">
            ZipLink Created! 🎉
          </h1>
          <p className="text-[rgba(55,50,47,0.60)] font-sans">
            Your ZipLink is ready to share
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Link Details */}
          <Card className="border-[rgba(55,50,47,0.12)]">
            <CardHeader>
              <CardTitle className="font-serif">ZipLink Details</CardTitle>
              <CardDescription className="font-sans">
                Share this link with anyone to send them SOL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-sm font-medium text-[rgba(55,50,47,0.60)] font-sans">Amount</label>
                <div className="text-3xl font-bold text-[#9945FF] font-mono mt-1">
                  {zipLink.amount} SOL
                </div>
              </div>

              {/* Title */}
              {zipLink.title && (
                <div>
                  <label className="text-sm font-medium text-[rgba(55,50,47,0.60)] font-sans">Title</label>
                  <p className="text-lg font-semibold text-[#37322f] font-sans mt-1">
                    {zipLink.title}
                  </p>
                </div>
              )}

              {/* Message */}
              {zipLink.memo && (
                <div>
                  <label className="text-sm font-medium text-[rgba(55,50,47,0.60)] font-sans">Message</label>
                  <p className="text-[rgba(55,50,47,0.80)] font-sans mt-1">
                    {zipLink.memo}
                  </p>
                </div>
              )}

              {/* Expires */}
              {zipLink.expiresAt && (
                <div>
                  <label className="text-sm font-medium text-[rgba(55,50,47,0.60)] font-sans">Expires</label>
                  <p className="text-[rgba(55,50,47,0.80)] font-sans mt-1">
                    {new Date(zipLink.expiresAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Link URL */}
              <div>
                <label className="text-sm font-medium text-[rgba(55,50,47,0.60)] font-sans">Link URL</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={zipLink.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-[rgba(55,50,47,0.12)] rounded-lg bg-white font-mono text-sm"
                  />
                  <Button onClick={copyLink} size="sm">
                    {copied ? '✓ Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="border-[rgba(55,50,47,0.12)]">
            <CardHeader>
              <CardTitle className="font-serif">QR Code</CardTitle>
              <CardDescription className="font-sans">
                Scan to claim on mobile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                <QRCodeSVG
                  value={zipLink.url}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-center text-[rgba(55,50,47,0.60)] mt-4 font-sans">
                Anyone can scan this QR code to claim the SOL
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Share Buttons */}
        <Card className="mt-6 border-[rgba(55,50,47,0.12)]">
          <CardHeader>
            <CardTitle className="font-serif">Share Your ZipLink</CardTitle>
            <CardDescription className="font-sans">
              Send to your recipient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={copyLink}
                variant="outline"
                className="w-full border-[rgba(55,50,47,0.12)] hover:bg-[rgba(55,50,47,0.05)]"
              >
                📋 Copy Link
              </Button>
              <Button
                onClick={shareOnTwitter}
                variant="outline"
                className="w-full border-[rgba(55,50,47,0.12)] hover:bg-[rgba(55,50,47,0.05)]"
              >
                🐦 Share on Twitter
              </Button>
              <Button
                onClick={shareViaEmail}
                variant="outline"
                className="w-full border-[rgba(55,50,47,0.12)] hover:bg-[rgba(55,50,47,0.05)]"
              >
                ✉️ Send via Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/create">
            <Button variant="outline">
              Create Another ZipLink
            </Button>
          </Link>
          <Link href="/admin">
            <Button>
              View Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

