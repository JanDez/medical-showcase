import { NextResponse } from 'next/server';
import { db } from '@/app/server/db';
import { assets } from '@/app/server/db/schema';
import { baseSearchParamsSchema } from '@/app/lib/schemas';
import { sql, desc } from 'drizzle-orm';

// GET /api/search/recent - Search recent searches
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