import { useAssetStore } from "../stores/useAssetStore"
import { useAssets } from "./useAssets"
import { useToast } from "./useToast"
import { useQueryClient } from "@tanstack/react-query"

export function useFavorite() {
  const { toast } = useToast()
  const updateAsset = useAssetStore((state) => state.updateAsset)
  const { updateAssetInCache } = useAssets()
  const queryClient = useQueryClient()

  const toggleFavorite = async (assetId: number, currentState: boolean) => {
    const newState = !currentState
    
    // Update cache and store first
    updateAsset(assetId, { isFavorite: newState })
    updateAssetInCache(assetId, { isFavorite: newState })
    
    // Persist in localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    const newFavorites = savedFavorites.filter((f: any) => f.id !== assetId)
    if (newState) {
      newFavorites.push({ id: assetId, isFavorite: true })
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites))

    try {
      // Then trigger API call
      const response = await fetch(`/api/assets/${assetId}/favorite`, {
        method: newState ? 'PUT' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: newState ? JSON.stringify({ isFavorite: true }) : undefined,
        cache: 'no-store'
      })

      if (!response.ok) throw new Error('Failed to update favorite status')
      
      // Only show toast after successful API call
      toast({
        title: newState ? "Added to favorites" : "Removed from favorites",
        description: newState 
          ? "The item has been added to your favorites"
          : "The item has been removed from your favorites",
      })
    } catch (error) {
      // Revert all updates on error
      updateAsset(assetId, { isFavorite: currentState })
      updateAssetInCache(assetId, { isFavorite: currentState })
      localStorage.setItem('favorites', JSON.stringify(savedFavorites))
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status",
      })
    }
  }

  return toggleFavorite
} 