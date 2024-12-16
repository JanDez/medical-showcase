import { NextResponse } from 'next/server'
import { db } from '@/app/server/db'
import { assetRequests } from '@/app/server/db/schema'

/**
 * @swagger
 * /api/assets/request:
 *   post:
 *     tags: [Assets]
 *     summary: Submit an asset request
 *     description: Creates a new asset request with pending status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the requested asset
 *               description:
 *                 type: string
 *                 description: Description of the requested asset
 *     responses:
 *       200:
 *         description: Request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Server error
 */

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    await db.insert(assetRequests).values({
      name,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to submit request:', error)
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    )
  }
} 