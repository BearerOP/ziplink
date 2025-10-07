"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function CreateZipLinkPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    memo: '',
    title: '',
    expiresIn: '24',
    creatorEmail: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const response = await fetch('/api/ziplink/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          memo: formData.memo || undefined,
          title: formData.title || undefined,
          expiresIn: formData.expiresIn ? parseInt(formData.expiresIn) : undefined,
          creatorEmail: formData.creatorEmail || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create ZipLink')
      }

      toast.success('ZipLink created successfully!')
      
      // Redirect to success page with link details
      router.push(`/created/${data.linkId}`)

    } catch (error: any) {
      console.error('Create error:', error)
      toast.error(error.message || 'Failed to create ZipLink')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#37322f] font-serif mb-2">
            Create a ZipLink
          </h1>
          <p className="text-[rgba(55,50,47,0.60)] font-sans">
            Send SOL to anyone via a simple link - no wallet required
          </p>
        </div>

        <Card className="border-[rgba(55,50,47,0.12)]">
          <CardHeader>
            <CardTitle className="font-serif">ZipLink Details</CardTitle>
            <CardDescription className="font-sans">
              Fill in the details for your ZipLink
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="font-sans font-medium">
                  Amount (SOL) *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.001"
                  min="0.001"
                  max="1000000"
                  placeholder="0.1"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="font-mono"
                />
                <p className="text-xs text-[rgba(55,50,47,0.60)] font-sans">
                  Amount of SOL to send (on Devnet for testing)
                </p>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-sans font-medium">
                  Title (Optional)
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Happy Birthday!"
                  maxLength={100}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <p className="text-xs text-[rgba(55,50,47,0.60)] font-sans">
                  Give your ZipLink a memorable title
                </p>
              </div>

              {/* Memo */}
              <div className="space-y-2">
                <Label htmlFor="memo" className="font-sans font-medium">
                  Message (Optional)
                </Label>
                <Textarea
                  id="memo"
                  placeholder="Thanks for all your help! 🎉"
                  maxLength={500}
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-[rgba(55,50,47,0.60)] font-sans">
                  Add a personal message (max 500 characters)
                </p>
              </div>

              {/* Expiry */}
              <div className="space-y-2">
                <Label htmlFor="expiresIn" className="font-sans font-medium">
                  Expires In (Hours)
                </Label>
                <Input
                  id="expiresIn"
                  type="number"
                  min="1"
                  max="720"
                  placeholder="24"
                  value={formData.expiresIn}
                  onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
                />
                <p className="text-xs text-[rgba(55,50,47,0.60)] font-sans">
                  Link will expire after this many hours (default: 24 hours)
                </p>
              </div>

              {/* Creator Email */}
              <div className="space-y-2">
                <Label htmlFor="creatorEmail" className="font-sans font-medium">
                  Your Email (Optional)
                </Label>
                <Input
                  id="creatorEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.creatorEmail}
                  onChange={(e) => setFormData({ ...formData, creatorEmail: e.target.value })}
                />
                <p className="text-xs text-[rgba(55,50,47,0.60)] font-sans">
                  Get notified when your ZipLink is claimed
                </p>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 font-sans">
                  ℹ️ Testing on Devnet
                </h4>
                <p className="text-sm text-blue-800 font-sans">
                  This ZipLink will be created on Solana Devnet for testing purposes. 
                  The SOL has no real value and will be airdropped automatically.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isCreating || !formData.amount}
                className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-sans font-semibold hover:opacity-90"
                size="lg"
              >
                {isCreating ? 'Creating ZipLink...' : 'Create ZipLink'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="mt-8 border-[rgba(55,50,47,0.12)]">
          <CardHeader>
            <CardTitle className="font-serif text-lg">How it Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-sans text-sm text-[rgba(55,50,47,0.80)]">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#9945FF] text-white flex items-center justify-center flex-shrink-0 font-semibold text-xs">
                1
              </div>
              <p>
                <strong>Create:</strong> We generate a unique Solana wallet and fund it with your specified amount
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#9945FF] text-white flex items-center justify-center flex-shrink-0 font-semibold text-xs">
                2
              </div>
              <p>
                <strong>Share:</strong> Send the link via email, text, social media, or show the QR code
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#9945FF] text-white flex items-center justify-center flex-shrink-0 font-semibold text-xs">
                3
              </div>
              <p>
                <strong>Claim:</strong> Recipient opens the link and claims the SOL to their wallet (or creates one with Google)
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

