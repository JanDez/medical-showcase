import { NextResponse } from 'next/server';
import { db } from '@/app/server/db';
import { storyboards } from '@/app/server/db/schema';
import { assetSearchParamsSchema } from '@/app/lib/schemas';
import { sql, desc } from 'drizzle-orm';

const sortColumnMap = {
  createdAt: storyboards.createdAt,
  updatedAt: storyboards.updatedAt,
  name: storyboards.name,
} as const;

/**
 * @swagger
 * /api/storyboards:
 *   get:
 *     tags: [Storyboards]
 *     summary: Get a list of storyboards
 *     description: Retrieves a paginated list of storyboards with sorting options
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
 *                     $ref: '#/components/schemas/Storyboard'
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
    const { searchParams } = new URL(request.url);
    const validatedParams = assetSearchParamsSchema.safeParse({
      page: searchParams.get('page') ?? '1',
      pageSize: searchParams.get('pageSize') ?? '10',
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

    const results = await db.select({
      id: storyboards.id,
      name: storyboards.name,
      coupledKpis: storyboards.coupledKpis,
      applicableAffiliates: storyboards.applicableAffiliates,
      assetId: storyboards.assetId,
      createdAt: storyboards.createdAt,
      updatedAt: storyboards.updatedAt,
    })
    .from(storyboards)
    .limit(data.pageSize)
    .offset(offset)
    .orderBy(desc(sortColumnMap[data.sortBy as keyof typeof sortColumnMap]));

    const total = await db.select({ count: sql<number>`count(*)` })
      .from(storyboards)
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
      { error: 'Failed to fetch storyboards' },
      { status: 500 }
    );
  }
}