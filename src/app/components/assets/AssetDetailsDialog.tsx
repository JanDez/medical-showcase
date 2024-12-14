"use client"

import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { Badge } from "@/app/components/ui/badge"
import { PieChart, X, Share2, Heart } from 'lucide-react'
import type { Asset } from "@/app/features/types/types"
import { useToast } from "@/app/features/hooks/useToast"
import { useState } from "react"
import { ShareModal } from "../modals/ShareModal"
import { cn } from "@/app/lib/utils"
import { useAssetStore } from "@/app/features/stores/useAssetStore"
import { useAssets } from "@/app/features/hooks/useAssets"
import { useFavoriteContext } from "@/app/features/contexts/FavoriteContext"

interface AssetDetailsDialogProps {
  asset: Asset | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AssetDetailsDialog({ asset, isOpen, onOpenChange }: AssetDetailsDialogProps) {
  const { toast } = useToast()
  const [showShareModal, setShowShareModal] = useState(false)
  const { toggleFavorite, isFavorite } = useFavoriteContext()
  const isAssetFavorite = isFavorite(asset?.id ?? 0)
  
  if (!asset) return null

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleFavorite = () => {
    toggleFavorite(asset.id, isAssetFavorite)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl" showClose={false}>
          <DialogHeader className="relative">
            <div className="absolute right-0 top-0 flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <PieChart className="w-8 h-8 text-gray-500" />
              </div>
              <div>
                <DialogTitle>{asset.name}</DialogTitle>
                <DialogDescription>
                  Descriptive name of the {asset.type}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <p className="text-center text-muted-foreground">
              {asset.description}
            </p>

            <div className="flex justify-center gap-2">
              {asset.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y">
              <div className="text-center">
                <p className="text-xl font-semibold">{asset.usageCount ?? 0}</p>
                <p className="text-sm text-muted-foreground">Used</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">{asset.pagesCount ?? 1}</p>
                <p className="text-sm text-muted-foreground">Pages No.</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">
                  {new Date(asset.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Last Updated</p>
              </div>
            </div>

            {asset.questions && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Business Questions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {asset.questions.map((question, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Question {index + 1}</h4>
                      <p className="text-sm text-muted-foreground">{question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleFavorite}
              className={cn(
                "w-full group transition-all",
                isAssetFavorite 
                  ? "bg-pink-50 hover:bg-pink-100 text-pink-600" 
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              )} 
              size="lg"
            >
              <Heart className={cn(
                "mr-2 h-4 w-4 transition-all",
                isAssetFavorite 
                  ? "fill-pink-600 group-hover:scale-110" 
                  : "group-hover:scale-110 group-hover:fill-white"
              )} />
              {isAssetFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ShareModal 
        assetId={asset?.id}
        isOpen={showShareModal}
        onOpenChange={setShowShareModal}
      />
    </>
  )
} 