import { NextResponse } from 'next/server'
import { db } from '@/app/server/db'
import { assets } from '@/app/server/db/schema'
import { eq } from 'drizzle-orm'

/**
 * @swagger
 * /api/assets/{id}/favorite:
 *   put:
 *     tags: [Assets]
 *     summary: Update asset favorite status
 *     description: Updates the favorite status of a specific asset
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Asset ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isFavorite
 *             properties:
 *               isFavorite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully updated favorite status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Server error
 *   delete:
 *     tags: [Assets]
 *     summary: Remove asset from favorites
 *     description: Removes an asset from favorites by setting isFavorite to false
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: Successfully removed from favorites
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

interface FavoriteRequest {
  isFavorite: boolean;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const { isFavorite } = await request.json() as FavoriteRequest

    await db
      .update(assets)
      .set({ isFavorite })
      .where(eq(assets.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update favorite status:', error)
    return NextResponse.json(
      { error: 'Failed to update favorite status' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await db
      .update(assets)
      .set({ isFavorite: false })
      .where(eq(assets.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to remove favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
