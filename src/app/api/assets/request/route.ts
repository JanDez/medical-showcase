import { NextResponse } from 'next/server'
import { db } from '@/app/server/db'
import { assetRequests } from '@/app/server/db/schema'

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    await db.insert(assetRequests).values({
      name,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to submit request:', error)
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    )
  }
} 