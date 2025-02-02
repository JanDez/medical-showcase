import { NextResponse } from 'next/server'
import { db } from '@/app/server/db'
import { metrics } from '@/app/server/db/schema'
import { assetSearchParamsSchema } from '@/app/lib/schemas'
import { sql, desc } from 'drizzle-orm'
import { handleApiError } from '@/app/lib/api-utils'

const sortColumnMap = {
  createdAt: metrics.createdAt,
  updatedAt: metrics.updatedAt,
  name: metrics.name,
} as const;

/**
 * @swagger
 * /api/features:
 *   get:
 *     tags: [Features]
 *     summary: Get a list of features/metrics
 *     description: Retrieves a paginated list of features/metrics with sorting options
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default: 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page (default: 10)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name]
 *         description: Field to sort by (default: createdAt)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (default: desc)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Metric'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
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
      pageSize: searchParams.get('pageSize') ?? '4',
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
      id: metrics.id,
      name: metrics.name,
      description: metrics.description,
      calculation: metrics.calculation,
      businessQuestions: metrics.businessQuestions,
      metricIds: metrics.metricIds,
      affiliateApplicability: metrics.affiliateApplicability,
      assetId: metrics.assetId,
      visualType: metrics.visualType,
      dataSource: metrics.dataSource,
      refreshFrequency: metrics.refreshFrequency,
      createdAt: metrics.createdAt,
      updatedAt: metrics.updatedAt,
    })
    .from(metrics)
    .limit(data.pageSize)
    .offset(offset)
    .orderBy(desc(sortColumnMap[data.sortBy as keyof typeof sortColumnMap]))

    const total = await db.select({ count: sql<number>`count(*)` })
      .from(metrics)
      .then(res => res[0]?.count ?? 0)

    return NextResponse.json({
      data: results,
      total,
      page: data.page,
      pageSize: data.pageSize
    })
  } catch (error) {
    console.error('Database error:', error)
    return handleApiError(error, 'Failed to fetch features')
  }
} 