// app/api/shares/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/app/server/db'
import { assetShares } from '@/app/server/db/schema'
import { nanoid } from 'nanoid'

/**
 * @swagger
 * /api/shares:
 *   post:
 *     tags: [Shares]
 *     summary: Create a new share link
 *     description: Creates a new share link for an asset with an expiration time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetId
 *               - expiresIn
 *             properties:
 *               assetId:
 *                 type: integer
 *                 description: ID of the asset to share
 *               expiresIn:
 *                 type: integer
 *                 description: Time in milliseconds until the share link expires
 *     responses:
 *       200:
 *         description: Share link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: Share token
 *       500:
 *         description: Server error
 */

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