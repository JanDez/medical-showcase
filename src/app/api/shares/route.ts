// app/api/shares/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/app/server/db'
import { assetShares } from '@/app/server/db/schema'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
  try {
    const { assetId, expiresIn } = await request.json()
    
    const shareToken = nanoid(10)
    const expiresAt = new Date(Date.now() + expiresIn)
    
    const [share] = await db.insert(assetShares)
      .values({
        assetId,
        shareToken,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning({ token: assetShares.shareToken })
    
    if (!share) {
      return NextResponse.json(
        { error: 'Failed to create share' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ data: share.token })
  } catch (error) {
    console.error('Failed to create share:', error)
    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 }
    )
  }
}