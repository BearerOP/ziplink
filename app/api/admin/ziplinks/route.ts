import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/ziplinks
 * 
 * Get all ZipLinks with pagination and filters
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') || 'all'
    const skip = (page - 1) * limit

    // Build filter
    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }

    // Get total count
    const total = await prisma.zipLink.count({ where })

    // Get ZipLinks
    const zipLinks = await prisma.zipLink.findMany({
      where,
      include: {
        claims: {
          select: {
            id: true,
            claimerAddr: true,
            claimerEmail: true,
            amount: true,
            createdAt: true
          }
        },
        creator: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    return NextResponse.json({
      zipLinks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('[Admin] Error fetching ZipLinks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ZipLinks' },
      { status: 500 }
    )
  }
}

