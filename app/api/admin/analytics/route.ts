import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/analytics
 * 
 * Get analytics data
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Get date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    // Get daily analytics
    const dailyAnalytics = await prisma.zipLinkAnalytics.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Get summary statistics
    const summary = await prisma.$transaction([
      // Total ZipLinks
      prisma.zipLink.count(),
      
      // Active ZipLinks
      prisma.zipLink.count({
        where: { status: 'active' }
      }),
      
      // Claimed ZipLinks
      prisma.zipLink.count({
        where: { status: 'claimed' }
      }),
      
      // Total claims
      prisma.zipClaim.count(),
      
      // Total amount created (all time)
      prisma.zipLink.aggregate({
        _sum: { amount: true }
      }),
      
      // Total amount claimed
      prisma.zipClaim.aggregate({
        _sum: { amount: true }
      })
    ])

    const [
      totalZipLinks,
      activeZipLinks,
      claimedZipLinks,
      totalClaims,
      totalAmountCreated,
      totalAmountClaimed
    ] = summary

    // Get recent activity
    const recentZipLinks = await prisma.zipLink.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        linkId: true,
        amount: true,
        status: true,
        createdAt: true,
        memo: true
      }
    })

    const recentClaims = await prisma.zipClaim.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        zipLink: {
          select: {
            linkId: true,
            amount: true
          }
        }
      }
    })

    return NextResponse.json({
      summary: {
        totalZipLinks,
        activeZipLinks,
        claimedZipLinks,
        totalClaims,
        totalAmountCreated: totalAmountCreated._sum.amount || 0,
        totalAmountClaimed: totalAmountClaimed._sum.amount || 0,
        claimRate: totalZipLinks > 0 
          ? ((claimedZipLinks / totalZipLinks) * 100).toFixed(2)
          : '0'
      },
      dailyAnalytics,
      recentActivity: {
        zipLinks: recentZipLinks,
        claims: recentClaims
      }
    })

  } catch (error) {
    console.error('[Admin] Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

