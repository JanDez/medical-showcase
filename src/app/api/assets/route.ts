import { NextResponse } from 'next/server'
import { db } from '@/app/server/db'
import { assets } from '@/app/server/db/schema'
import { assetSearchParamsSchema } from '@/app/lib/schemas'
import { sql, desc } from 'drizzle-orm'
import { handleApiError } from '@/app/lib/api-utils'

const sortColumnMap = {
  createdAt: assets.createdAt,
  updatedAt: assets.updatedAt,
  name: assets.name,
  viewCount: assets.viewCount,
} as const;

/**
 * @swagger
 * /api/assets:
 *   get:
 *     tags: [Assets]
 *     summary: Get a list of assets
 *     description: Retrieves a paginated list of assets with sorting options
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/pageSizeParam'
 *       - $ref: '#/components/parameters/sortByParam'
 *       - $ref: '#/components/parameters/sortOrderParam'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const validatedParams = assetSearchParamsSchema.safeParse({
      page: searchParams.get('page') ?? '1',
      pageSize: searchParams.get('pageSize') ?? '10',
      sortBy: searchParams.get('sortBy') ?? 'createdAt',
      sortOrder: searchParams.get('sortOrder') ?? 'desc',
    })

    if (!validatedParams.success) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      )
    }

    const { data } = validatedParams
    const offset = (data.page - 1) * data.pageSize

    const results = await db.select({
      id: assets.id,
      name: assets.name,
      description: assets.description,
      isFavorite: assets.isFavorite,
      visualsAvailable: assets.visualsAvailable,
      lastViewed: assets.lastViewed,
      viewCount: assets.viewCount,
      createdAt: assets.createdAt,
      updatedAt: assets.updatedAt,
    })
    .from(assets)
    .limit(data.pageSize)
    .offset(offset)
    .orderBy(desc(sortColumnMap[data.sortBy as keyof typeof sortColumnMap]))

    const total = await db.select({ count: sql<number>`count(*)` })
      .from(assets)
      .then(res => res[0]?.count ?? 0)

    return NextResponse.json({
      data: results,
      total,
      page: data.page,
      pageSize: data.pageSize
    })
  } catch (error) {
    console.error('Database error:', error)
    return handleApiError(error, 'Failed to fetch assets')
  }
}



