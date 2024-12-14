import { NextResponse } from 'next/server';
import { db } from '@/app/server/db';
import { recentSearches } from '@/app/server/db/schema';
import { assetSearchParamsSchema } from '@/app/lib/schemas';
import { sql, desc } from 'drizzle-orm';

const sortColumnMap = {
  createdAt: recentSearches.createdAt,
} as const;

// Function to get the four most recent searches
export async function getRecentSearches() {
  return await db.select({
    id: recentSearches.id,
    searchTerm: recentSearches.searchTerm,
    createdAt: recentSearches.createdAt,
  })
  .from(recentSearches)
  .orderBy(desc(recentSearches.createdAt))
  .limit(4);
}

// POST /api/recent - Add a new recent search
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { searchTerm } = body;

    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    const newSearch = await db.insert(recentSearches).values({ searchTerm }).returning();
    return NextResponse.json(newSearch, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to add recent search' }, { status: 500 });
  }
}

// GET /api/recent - List recent searches
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = assetSearchParamsSchema.safeParse({
      page: searchParams.get('page') ?? '1',
      pageSize: searchParams.get('pageSize') ?? '4',
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
      id: recentSearches.id,
      searchTerm: recentSearches.searchTerm,
      createdAt: recentSearches.createdAt,
    })
    .from(recentSearches)
    .limit(data.pageSize)
    .offset(offset)
    .orderBy(desc(sortColumnMap[data.sortBy as keyof typeof sortColumnMap]));

    const total = await db.select({ count: sql<number>`count(*)` })
      .from(recentSearches)
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
      { error: 'Failed to fetch recent searches' },
      { status: 500 }
    );
  }
}