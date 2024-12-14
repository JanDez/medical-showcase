import { NextResponse } from 'next/server';
import { db } from '@/app/server/db';
import { assets } from '@/app/server/db/schema';
import { assetSearchParamsSchema } from '@/app/lib/schemas';
import { sql, desc } from 'drizzle-orm';

const sortColumnMap = {
  viewCount: assets.viewCount,
  createdAt: assets.createdAt,
} as const;

// GET /api/trending - List trending assets
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = assetSearchParamsSchema.safeParse({
      page: searchParams.get('page') ?? '1',
      pageSize: searchParams.get('pageSize') ?? '4',
      sortBy: searchParams.get('sortBy') ?? 'viewCount',
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
      id: assets.id,
      name: assets.name,
      description: assets.description,
      viewCount: assets.viewCount,
      createdAt: assets.createdAt,
      updatedAt: assets.updatedAt,
    })
    .from(assets)
    .limit(data.pageSize)
    .offset(offset)
    .orderBy(desc(sortColumnMap[data.sortBy as keyof typeof sortColumnMap]));

    const total = await db.select({ count: sql<number>`count(*)` })
      .from(assets)
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
      { error: 'Failed to fetch trending assets' },
      { status: 500 }
    );
  }
}