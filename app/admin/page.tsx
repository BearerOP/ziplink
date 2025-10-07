"use client"

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'

interface AnalyticsData {
  summary: {
    totalZipLinks: number
    activeZipLinks: number
    claimedZipLinks: number
    totalClaims: number
    totalAmountCreated: string
    totalAmountClaimed: string
    claimRate: string
  }
  recentActivity: {
    zipLinks: any[]
    claims: any[]
  }
}

interface ZipLinksData {
  zipLinks: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [zipLinks, setZipLinks] = useState<ZipLinksData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    try {
      const [analyticsRes, zipLinksRes] = await Promise.all([
        fetch('/api/admin/analytics'),
        fetch(`/api/admin/ziplinks?status=${filter}`)
      ])

      const analyticsData = await analyticsRes.json()
      const zipLinksData = await zipLinksRes.json()

      setAnalytics(analyticsData)
      setZipLinks(zipLinksData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!zipLinks) return

    const headers = ['Link ID', 'Amount', 'Status', 'Created', 'Claimed', 'Creator Email']
    const rows = zipLinks.zipLinks.map(zl => [
      zl.linkId,
      zl.amount,
      zl.status,
      new Date(zl.createdAt).toLocaleString(),
      zl.claimedAt ? new Date(zl.claimedAt).toLocaleString() : 'N/A',
      zl.creatorEmail || 'N/A'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ziplinks-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    
    toast.success('CSV exported successfully')
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: 'default', color: 'bg-green-500' },
      claimed: { variant: 'secondary', color: 'bg-blue-500' },
      expired: { variant: 'destructive', color: 'bg-red-500' },
      cancelled: { variant: 'outline', color: 'bg-gray-500' }
    }

    const config = variants[status] || variants.active

    return (
      <Badge className={config.color + ' text-white'}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F3]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#9945FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[rgba(55,50,47,0.60)] font-sans">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#37322f] font-serif mb-2">
              Admin Dashboard
            </h1>
            <p className="text-[rgba(55,50,47,0.60)] font-sans">
              Manage and monitor your ZipLinks
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={exportCSV} variant="outline">
              📊 Export CSV
            </Button>
            <Link href="/create">
              <Button className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white">
                + Create ZipLink
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-[rgba(55,50,47,0.12)]">
              <CardHeader className="pb-3">
                <CardDescription className="font-sans">Total ZipLinks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#37322f] font-mono">
                  {analytics.summary.totalZipLinks}
                </div>
                <p className="text-xs text-green-600 mt-2 font-sans">
                  {analytics.summary.activeZipLinks} active
                </p>
              </CardContent>
            </Card>

            <Card className="border-[rgba(55,50,47,0.12)]">
              <CardHeader className="pb-3">
                <CardDescription className="font-sans">Total Claimed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#9945FF] font-mono">
                  {analytics.summary.claimedZipLinks}
                </div>
                <p className="text-xs text-[rgba(55,50,47,0.60)] mt-2 font-sans">
                  {analytics.summary.claimRate}% claim rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-[rgba(55,50,47,0.12)]">
              <CardHeader className="pb-3">
                <CardDescription className="font-sans">Total Created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#14F195] font-mono">
                  {parseFloat(analytics.summary.totalAmountCreated).toFixed(2)} SOL
                </div>
                <p className="text-xs text-[rgba(55,50,47,0.60)] mt-2 font-sans">
                  All time
                </p>
              </CardContent>
            </Card>

            <Card className="border-[rgba(55,50,47,0.12)]">
              <CardHeader className="pb-3">
                <CardDescription className="font-sans">Total Claimed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 font-mono">
                  {parseFloat(analytics.summary.totalAmountClaimed).toFixed(2)} SOL
                </div>
                <p className="text-xs text-[rgba(55,50,47,0.60)] mt-2 font-sans">
                  {analytics.summary.totalClaims} claims
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={filter === 'claimed' ? 'default' : 'outline'}
            onClick={() => setFilter('claimed')}
            size="sm"
          >
            Claimed
          </Button>
          <Button
            variant={filter === 'expired' ? 'default' : 'outline'}
            onClick={() => setFilter('expired')}
            size="sm"
          >
            Expired
          </Button>
        </div>

        {/* ZipLinks Table */}
        <Card className="border-[rgba(55,50,47,0.12)]">
          <CardHeader>
            <CardTitle className="font-serif">All ZipLinks</CardTitle>
            <CardDescription className="font-sans">
              {zipLinks?.pagination.total || 0} total ZipLinks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(55,50,47,0.12)]">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[rgba(55,50,47,0.80)] font-sans">Link ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[rgba(55,50,47,0.80)] font-sans">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[rgba(55,50,47,0.80)] font-sans">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[rgba(55,50,47,0.80)] font-sans">Created</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[rgba(55,50,47,0.80)] font-sans">Claims</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-[rgba(55,50,47,0.80)] font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {zipLinks?.zipLinks.map((zipLink) => (
                    <tr key={zipLink.id} className="border-b border-[rgba(55,50,47,0.06)] hover:bg-[rgba(55,50,47,0.02)]">
                      <td className="py-3 px-4">
                        <code className="text-sm font-mono text-[#9945FF]">
                          {zipLink.linkId}
                        </code>
                        {zipLink.title && (
                          <div className="text-xs text-[rgba(55,50,47,0.60)] mt-1 font-sans">
                            {zipLink.title}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-[#37322f]">
                          {parseFloat(zipLink.amount).toFixed(4)} SOL
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(zipLink.status)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-[rgba(55,50,47,0.80)] font-sans">
                          {new Date(zipLink.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-sans">
                          {zipLink.claims.length}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/claim/${zipLink.linkId}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(zipLink.url)
                              toast.success('Link copied!')
                            }}
                          >
                            📋
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {zipLinks?.zipLinks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-[rgba(55,50,47,0.60)] font-sans">
                    No ZipLinks found
                  </p>
                  <Link href="/create">
                    <Button className="mt-4">
                      Create Your First ZipLink
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {analytics?.recentActivity && (
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Recent ZipLinks */}
            <Card className="border-[rgba(55,50,47,0.12)]">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Recent ZipLinks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentActivity.zipLinks.slice(0, 5).map((zl) => (
                    <div key={zl.linkId} className="flex items-center justify-between p-3 bg-[rgba(55,50,47,0.02)] rounded-lg">
                      <div>
                        <code className="text-sm font-mono text-[#9945FF]">{zl.linkId}</code>
                        {zl.memo && (
                          <p className="text-xs text-[rgba(55,50,47,0.60)] mt-1 font-sans truncate max-w-xs">
                            {zl.memo}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-semibold text-sm">{parseFloat(zl.amount).toFixed(2)} SOL</div>
                        <div className="text-xs text-[rgba(55,50,47,0.60)] font-sans">
                          {new Date(zl.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Claims */}
            <Card className="border-[rgba(55,50,47,0.12)]">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Recent Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentActivity.claims.slice(0, 5).map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-3 bg-[rgba(55,50,47,0.02)] rounded-lg">
                      <div>
                        <code className="text-sm font-mono text-blue-600">{claim.zipLink.linkId}</code>
                        {claim.claimerEmail && (
                          <p className="text-xs text-[rgba(55,50,47,0.60)] mt-1 font-sans">
                            {claim.claimerEmail}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-semibold text-sm text-green-600">
                          +{parseFloat(claim.amount).toFixed(2)} SOL
                        </div>
                        <div className="text-xs text-[rgba(55,50,47,0.60)] font-sans">
                          {new Date(claim.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

