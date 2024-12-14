import { NextResponse } from 'next/server';
import { db } from '@/app/server/db';
import { layouts } from '@/app/server/db/schema';
import { assetSearchParamsSchema } from '@/app/lib/schemas';
import { sql, desc } from 'drizzle-orm';
import { handleApiError } from '@/app/lib/api-utils';

const sortColumnMap = {
  createdAt: layouts.createdAt,
  updatedAt: layouts.updatedAt,
  name: layouts.name,
} as const;

// GET /api/layouts - List layouts
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
      id: layouts.id,
      name: layouts.name,
      pageCount: layouts.pageCount,
      createdAt: layouts.createdAt,
      updatedAt: layouts.updatedAt,
    })
    .from(layouts)
    .limit(data.pageSize)
    .offset(offset)
    .orderBy(desc(sortColumnMap[data.sortBy as keyof typeof sortColumnMap]));

    const total = await db.select({ count: sql<number>`count(*)` })
      .from(layouts)
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
      { error: 'Failed to fetch layouts' },
      { status: 500 }
    );
  }
}