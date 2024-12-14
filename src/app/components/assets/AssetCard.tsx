"use client"

import { useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import type { Asset } from "@/app/features/types/types"
import { PieChart, Heart } from "lucide-react"
import { AssetDetailsDialog } from "./AssetDetailsDialog"
import { cn } from "@/app/lib/utils"
import { useFavoriteContext } from "@/app/features/contexts/FavoriteContext"

interface AssetCardProps {
  asset: Asset
}

export function AssetCard({ asset }: AssetCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toggleFavorite, isFavorite } = useFavoriteContext()
  const isAssetFavorite = isFavorite(asset.id)

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await toggleFavorite(asset.id, isAssetFavorite)
  }

  return (
    <>
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="p-6 flex gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <PieChart className="w-8 h-8 text-gray-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold mb-1">{asset.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">
              {asset.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Heart 
                onClick={handleFavorite}
                className={cn(
                  "h-4 w-4 transition-colors cursor-pointer hover:scale-110",
                  isAssetFavorite 
                    ? "fill-pink-600 text-pink-600" 
                    : "text-gray-400 hover:text-pink-600"
                )} 
              />
              <time className="text-sm text-muted-foreground">
                {new Date(asset.updatedAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        </CardContent>
      </Card>

      <AssetDetailsDialog 
        asset={asset}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}