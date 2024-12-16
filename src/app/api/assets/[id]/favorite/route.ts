import { NextResponse } from 'next/server'
import { db } from '@/app/server/db'
import { assets } from '@/app/server/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    const { isFavorite }: { isFavorite: boolean } = await request.json()

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
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

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
