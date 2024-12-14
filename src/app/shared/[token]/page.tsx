import { notFound } from 'next/navigation'
import { db } from '@/app/server/db'
import { assetShares, assets, assetTags, assetQuestions } from '@/app/server/db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Grid3X3, Eye, Clock, Calendar } from 'lucide-react'

interface PageProps {
  params: Promise<{
    token: string
  }>
}

export default async function SharedAssetPage({ params }: PageProps) {
  const resolvedParams = await params
  const token = resolvedParams.token
  
  if (token.endsWith('.map')) {
    return null
  }
  
  if (!token) {
    notFound()
  }

  try {
    console.log('Searching for token:', token)
    
    // First check if share exists
    const share = await db.select()
      .from(assetShares)
      .where(
        and(
          eq(assetShares.shareToken, token),
          gt(assetShares.expiresAt, new Date())
        )
      )
      .limit(1)
      .then(rows => rows[0])

    console.log('Found share:', share)

    if (!share) {
      notFound()
    }

    if (!share.assetId) {
      notFound()
    }

    console.log('Asset ID from share:', share.assetId);

    // Then get asset details
    const assetDetails = await db.select({
      id: assets.id,
      name: assets.name,
      description: assets.description,
      isFavorite: assets.isFavorite,
      lastViewed: assets.lastViewed,
      viewCount: assets.viewCount,
      createdAt: assets.createdAt,
      updatedAt: assets.updatedAt,
      jsonTags: assets.tags,
      relatedTags: assetTags.name,
      questions: {
        id: assetQuestions.id,
        text: assetQuestions.text
      }
    })
    .from(assets)
    .leftJoin(assetTags, eq(assetTags.assetId, assets.id))
    .leftJoin(assetQuestions, eq(assetQuestions.assetId, assets.id))
    .where(eq(assets.id, share.assetId))
    .then(rows => {
      if (!rows.length) return null
      
      const firstRow = rows[0]

      if (!firstRow) {
        return null
      }

      const jsonTagsArray = firstRow.jsonTags as string[] || []
      const relatedTagsArray = Array.from(new Set(rows.map(r => r.relatedTags).filter(Boolean)))
      const combinedTags = Array.from(new Set([...jsonTagsArray, ...relatedTagsArray]))
      
      return {
        ...firstRow,
        tags: combinedTags,
        questions: rows
          .filter(r => r.questions && 'id' in r.questions)
          .map(r => ({
            id: (r.questions as { id: number }).id,
            text: (r.questions as { text: string }).text
          }))
      }
    })

    console.log('Found asset:', assetDetails)

    if (!assetDetails) {
      notFound()
    }

    const formattedDate = assetDetails.updatedAt 
      ? new Date(assetDetails.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'Not available'

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Card className="overflow-hidden shadow-lg">
            <div className="p-6 border-b">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <Grid3X3 className="w-12 h-12 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">Layout</p>
                  <h1 className="text-2xl font-semibold mt-1">{assetDetails.name}</h1>
                  <p className="text-muted-foreground mt-2">{assetDetails.description}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  {assetDetails.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs px-3 py-1 bg-gray-100"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <CardContent className="p-6 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 text-center w-full max-w-2xl">
                <MetadataItem label="Used" value={assetDetails.viewCount || 0} />
                <MetadataItem label="Pages No." value={6} />
                <MetadataItem 
                  label="Last Updated" 
                  value={formattedDate || 'Not available'} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching shared asset:', error)
    notFound()
  }
}

function MetadataItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-semibold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}