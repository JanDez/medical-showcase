import { NextResponse } from 'next/server';
import { db } from '@/app/server/db';
import { assets } from '@/app/server/db/schema';
import { baseSearchParamsSchema } from '@/app/lib/schemas';
import { sql, desc } from 'drizzle-orm';

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Search assets
 *     description: Search across assets with query parameters, pagination and sorting
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query string
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
 *           enum: [createdAt, updatedAt, name, viewCount]
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
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = baseSearchParamsSchema.safeParse({
      page: searchParams.get('page') ?? '1',
      pageSize: searchParams.get('pageSize') ?? '10',
      query: searchParams.get('query') ?? '',
      sortBy: searchParams.get('sortBy') ?? 'createdAt',
      sortOrder: searchParams.get('sortOrder') ?? 'desc',
    });

    if (!validatedParams.success) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const { data } = validatedParams;
    const offset = (data.page - 1) * data.pageSize;

    const sortColumnMap = {
      createdAt: assets.createdAt,
      updatedAt: assets.updatedAt,
      name: assets.name,
      viewCount: assets.viewCount,
    };

    const sortByColumn = sortColumnMap[data.sortBy as keyof typeof sortColumnMap] || assets.createdAt;

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
    .where(sql`${assets.name} ILIKE ${`%${data.query}%`} OR ${assets.description} ILIKE ${`%${data.query}%`}`)
    .limit(data.pageSize)
    .offset(offset)
    .orderBy(desc(sortByColumn));

    const total = await db.select({ count: sql<number>`count(*)` })
      .from(assets)
      .where(sql`${assets.name} ILIKE ${`%${data.query}%`} OR ${assets.description} ILIKE ${`%${data.query}%`}`)
      .then(res => res[0]?.count ?? 0);

    return NextResponse.json({
      data: results,
      total,
      page: data.page,
      pageSize: data.pageSize,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}